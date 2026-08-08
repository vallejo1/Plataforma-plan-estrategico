import { NextResponse } from 'next/server'
import { auth } from './auth' // NextAuth config

const publicPaths = ['/public', '/api/public', '/api/auth', '/api/admin/pei']

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isPublic = publicPaths.some(path => nextUrl.pathname.startsWith(path))

  // Permitimos acceso si es público
  if (isPublic) {
    return NextResponse.next()
  }

  // Si no hay sesión y no es público, redirigir a la página de login (la pública de acceso)
  if (!req.auth) {
    // El acceso está estrictamente controlado, si no hay sesión rechaza/redirige

    // Si es un API, devolvemos 401 para no hacer redirect HTML.
    if (nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const loginUrl = new URL('/public/login', nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export default proxy;

// Configuración de rutas donde aplica el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
