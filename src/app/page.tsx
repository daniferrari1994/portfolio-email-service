export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Portfolio Email Service</h1>
      <p>Este servicio está funcionando correctamente.</p>
      <p>
        <strong>Endpoints disponibles:</strong>
      </p>
      <ul>
        <li>
          <code>POST /api/send-email</code> - Enviar email de contacto
        </li>
      </ul>
      <p>
        <strong>Estado:</strong> <span style={{ color: 'green' }}>✅ Activo</span>
      </p>
    </main>
  );
}