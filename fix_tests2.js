const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(/await waitFor\(\(\) => \{ expect\(global\.fetch\)\.toHaveBeenCalledTimes\(1\); \}\);.*/g, 
    "await waitFor(() => { expect(global.fetch).toHaveBeenCalledTimes(1); });\n    await act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });");

  fs.writeFileSync(file, content);
}

fix('__tests__/components/admin/pei/v2/EjesEditorBlock-save-continue.test.tsx');
fix('__tests__/components/admin/pei/v2/ObjetivosEditorBlockRebuild-save-continue.test.tsx');
