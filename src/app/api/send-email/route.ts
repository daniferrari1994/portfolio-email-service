import { NextRequest, NextResponse } from 'next/server';
import { ContactFormSchema } from '@/lib/validations';
import { sendContactEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    // Obtenemos los datos del cuerpo de la petición
    const body = await request.json();
    
    // Validamos los datos usando Zod
    const validationResult = ContactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    console.log('Datos validados:', validatedData);
    
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.DESTINATION_EMAIL) {
      console.error('Variables de entorno faltantes');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuración del servidor incompleta' 
        },
        { status: 500 }
      );
    }
    
    // Enviar el email
    const emailResult = await sendContactEmail(validatedData);
    
    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Email enviado exitosamente'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: emailResult.error || 'Error al enviar email'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error en el endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// Manejamos las peticiones OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}