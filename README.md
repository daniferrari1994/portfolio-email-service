# 📧 Portfolio Email Service

Servicio de API para el formulario de contacto del portfolio. Desarrollado con Next.js 14, TypeScript y Nodemailer.

## ✨ Características

- 🚀 API REST para envío de emails
- ✅ Validación de datos con Zod
- 📧 Integración con Gmail SMTP
- 🔒 Variables de entorno seguras
- 🌐 CORS configurado
- 📱 Responsive y optimizado

## 🛠️ Configuración Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Completar en `.env.local`:
```bash
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion
DESTINATION_EMAIL=email-destino@gmail.com
ALLOWED_ORIGIN=http://localhost:5173
```

### 3. Configurar Gmail
1. Activar verificación en 2 pasos en Gmail
2. Generar contraseña de aplicación
3. Usar la contraseña generada en `GMAIL_APP_PASSWORD`

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 📡 API Endpoints

### `POST /api/send-email`
Envía un email de contacto.

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez", 
  "email": "juan@ejemplo.com",
  "phoneNumber": "+1234567890",
  "message": "Mensaje de prueba",
  "language": "es"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Email enviado exitosamente"
}
```

## 🚀 Deployment en Vercel

### Variables de entorno requeridas en Vercel:
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD` 
- `DESTINATION_EMAIL`
- `ALLOWED_ORIGIN` (URL de tu portfolio en producción)

### Deploy automático:
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

## 🧪 Testing

Visita `/test` para probar el endpoint localmente.

## 🔗 Uso desde el Portfolio

```javascript
const response = await fetch('https://tu-dominio.vercel.app/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

---

Desarrollado con ❤️ para el portfolio personal.