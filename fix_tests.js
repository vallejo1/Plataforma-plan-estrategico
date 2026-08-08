const fs = require('fs');

function fixEjes() {
  const file = '__tests__/components/admin/pei/v2/EjesEditorBlock-save-continue.test.tsx';
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(/await waitFor\(\(\) => \{ expect\(global\.fetch\)\.toHaveBeenCalledTimes\(1\); \}\);.*/g, "await waitFor(() => { expect(global.fetch).toHaveBeenCalledTimes(1); });");
  content = content.replace(/await waitFor\(\(\) => \{ expect\(global\.fetch\)\.toHaveBeenCalledTimes\(1\); \}\);/g, 
    "await waitFor(() => { expect(global.fetch).toHaveBeenCalledTimes(1); });\n    await waitFor(() => { expect(screen.queryByText(/Guardando Bloque/)).not.toBeInTheDocument(); });");
  
  fs.writeFileSync(file, content);
}

function fixObjetivos() {
  const file = '__tests__/components/admin/pei/v2/ObjetivosEditorBlockRebuild-save-continue.test.tsx';
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(/await waitFor\(\(\) => \{ expect\(global\.fetch\)\.toHaveBeenCalledTimes\(1\); \}\);.*/g, "await waitFor(() => { expect(global.fetch).toHaveBeenCalledTimes(1); });");
  content = content.replace(/await waitFor\(\(\) => \{ expect\(global\.fetch\)\.toHaveBeenCalledTimes\(1\); \}\);/g, 
    "await waitFor(() => { expect(global.fetch).toHaveBeenCalledTimes(1); });\n    await waitFor(() => { expect(screen.queryByText(/Guardando Bloque/)).not.toBeInTheDocument(); });");

  fs.writeFileSync(file, content);
}

fixEjes();
fixObjetivos();

