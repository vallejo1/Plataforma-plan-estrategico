import re
with open(r'C:\Users\jesus\.gemini\antigravity\scratch\cruz_roja_pei\components\admin\pei\v2\EjesEditorBlock.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = '''    setSaving(true);

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

      const response = await fetch(/api/admin/pei//ejes, {'''

replacement = '''    if (peiEstado === 'ACTIVO') {
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

      const response = await fetch(/api/admin/pei//ejes, {'''

code = code.replace(target, replacement)

target2 = '''      if (configuration) {
        setConfirmedSum(configuration.weightSum);
        setConfirmedComplete(!!configuration.weightComplete);
        setWarnings(configuration.warnings || []);
      }
    } catch (err: unknown) {'''

replacement2 = '''      if (configuration) {
        setConfirmedSum(configuration.weightSum);
        setConfirmedComplete(!!configuration.weightComplete);
        setWarnings(configuration.warnings || []);
      }
      
      await onReloadPei();

      if (showJustificacionModal) {
        setShowJustificacionModal(false);
      }
    } catch (err: unknown) {'''

code = code.replace(target2, replacement2)

with open(r'C:\Users\jesus\.gemini\antigravity\scratch\cruz_roja_pei\components\admin\pei\v2\EjesEditorBlock.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
