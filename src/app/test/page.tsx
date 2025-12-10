'use client';

export default function TestAPI() {
  const testEndpoint = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@ejemplo.com',
          phoneNumber: '+1234567890',
          message: 'Este es un mensaje de prueba desde el test.',
          language: 'es'
        })
      });

      const data = await response.json();
      console.log('Respuesta:', data);
      
      const resultDiv = document.getElementById('result');
      if (resultDiv) {
        resultDiv.innerHTML = JSON.stringify(data, null, 2);
        resultDiv.style.backgroundColor = '#d4edda';
        resultDiv.style.color = '#155724';
      }
      
    } catch (error) {
      console.error('Error:', error);
      const resultDiv = document.getElementById('result');
      if (resultDiv) {
        resultDiv.innerHTML = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        resultDiv.style.backgroundColor = '#f8d7da';
        resultDiv.style.color = '#721c24';
      }
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>🚀 Test Portfolio Email Service</h1>
      <p>Esta página nos permite probar nuestro endpoint de email antes de conectarlo con el portfolio.</p>
      
      <button
        onClick={testEndpoint}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%',
          margin: '10px 0'
        }}
      >
        📧 Probar Endpoint /api/send-email
      </button>
      
      <pre
        id="result"
        style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          minHeight: '100px'
        }}
      >
        Haz clic en el botón para probar el endpoint
      </pre>
    </div>
  );
}