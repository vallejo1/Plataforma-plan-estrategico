import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/public/login",
    error: "/public/error",
  },
  callbacks: {
    async signIn({ user: user, account: account, profile }) {
      if (!profile) {
        console.warn("[AUTH] LOGIN_FAILED: Identidad incompleta");
        return false;
      }
      
      const oid = profile.oid as string;
      const tid = profile.tid as string;

      if (!oid || !tid) {
        console.warn("[AUTH] LOGIN_FAILED: Faltan oid o tid en el perfil");
        return false;
      }

      // Validación del tenant
      if (tid !== process.env.ENTRA_ALLOWED_TENANT_ID) {
        console.warn("[AUTH] ACCESS_DENIED: Tenant no autorizado");
        return false;
      }

      try {
        const dbUser = await prisma.usuario.findUnique({
          where: { oidEntraId: oid }
        });

        if (!dbUser) {
          console.warn("[AUTH] ACCESS_DENIED: Usuario no registrado");
          return "/public/access-pending"; 
        }

        if (!dbUser.activo) {
          console.warn("[AUTH] ACCESS_DENIED: Usuario inactivo");
          return "/public/access-pending";
        }

        console.info("[AUTH] LOGIN_SUCCESS");
        return true;
      } catch (error) {
        console.error("[AUTH] LOGIN_FAILED: Error de base de datos");
        return false;
      }
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.oid = profile.oid;
        token.tid = profile.tid;
        
        // Fetch user from DB to inject role and real name into token during sign-in
        const dbUser = await prisma.usuario.findUnique({
          where: { oidEntraId: profile.oid as string },
          include: { rol: true }
        });
        
        if (dbUser) {
          token.rol = dbUser.rol?.nombre || 'Rol no disponible';
          token.nombreReal = dbUser.nombre || 'Usuario institucional';
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.oid as string) || (token.sub as string);
      session.user.oid = token.oid as string;
      session.user.tid = token.tid as string;
      session.user.rol = token.rol as string;
      session.user.nombreReal = token.nombreReal as string;
      if (token.direccionId) session.user.direccionId = token.direccionId as string;
      if (token.filialId) session.user.filialId = token.filialId as string;
      return session;
    }
  },
  events: {
    signOut() {
      console.info("[AUTH] SESSION_TERMINATED");
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora de expiración
  },
  secret: process.env.AUTH_SECRET,
})
