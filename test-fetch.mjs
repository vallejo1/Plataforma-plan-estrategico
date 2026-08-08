(async () => {
  try {
    const url = 'http://localhost:3000/api/admin/pei/ejes/8779cc84-c22d-4573-bc4f-7cb148c38adf';
    console.log("Fetching", url);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codigo: 'E1',
        nombre: 'Eje de Prueba',
        peso_relativo: 25
      })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response Length:", text.length);
    console.log("Response snippet:", text.substring(0, 150));
  } catch (err) {
    console.error(err);
  }
})();
