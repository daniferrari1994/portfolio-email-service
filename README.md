# Portfolio Email Service

Servicio de API para el formulario de contacto del portfolio.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

3. Completar las variables en `.env.local`

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## API Endpoints

- `POST /api/send-email` - Envía email de contacto

## Deployment

Configurado para desplegar en Vercel.