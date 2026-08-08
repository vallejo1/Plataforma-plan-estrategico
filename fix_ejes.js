const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/admin/pei/v2/EjesEditorBlock.tsx');
let content = fs.readFileSync(file, 'utf8');

const target =     setSaving(true);

    try {
      const payload = {
        ejes: draftRows.map((r) => ({
          id: r.id,
          codigo: r.codigo.trim(),
          nombre: r.nombre.trim(),
          descripcion: r.descripcion ? r.descripcion.trim() : null,
          peso_relativo: Number(r.peso_relativo),
          ...(r.orden !== undefined ? { orden: r.orden } : {}),
        })),
      };

      const response = await fetch(\/api/admin/pei/$/ejes\, {;

const replacement =     if (peiEstado === 'ACTIVO') {
      setShowJustificacionModal(true);
      return;
    }
    
    await executeSave();
  };

  const executeSave = async (justificacion?: string) => {
    setSaving(true);

    try {
      const payload: any = {
        ejes: draftRows.map((r) => ({
          id: r.id,
          codigo: r.codigo.trim(),
          nombre: r.nombre.trim(),
          descripcion: r.descripcion ? r.descripcion.trim() : null,
          peso_relativo: Number(r.peso_relativo),
          ...(r.orden !== undefined ? { orden: r.orden } : {}),
        })),
      };

      if (justificacion) {
        payload.justificacion = justificacion;
      }

      const response = await fetch(\/api/admin/pei/$/ejes\, {;

content = content.replace(target, replacement);

const target2 =       if (configuration) {
        setConfirmedSum(configuration.weightSum);
        setConfirmedComplete(!!configuration.weightComplete);
        setWarnings(configuration.warnings || []);
      }
    } catch (err: unknown) {;

const replacement2 =       if (configuration) {
        setConfirmedSum(configuration.weightSum);
        setConfirmedComplete(!!configuration.weightComplete);
        setWarnings(configuration.warnings || []);
      }
      
      await onReloadPei();

      if (showJustificacionModal) {
        setShowJustificacionModal(false);
      }
    } catch (err: unknown) {;

content = content.replace(target2, replacement2);

fs.writeFileSync(file, content, 'utf8');
console.log("Done");
