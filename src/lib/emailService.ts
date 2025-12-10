import nodemailer from 'nodemailer';
import type { ContactFormData } from './validations';

// Configuración del transporte de email
export function createEmailTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// Función para crear el contenido HTML del email
export function createEmailContent(data: ContactFormData): { subject: string; html: string; text: string } {
  const subject = `📧 Nuevo mensaje de contacto de ${data.firstName} ${data.lastName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #5ad3bd; padding-bottom: 10px;">
        📧 Nuevo mensaje de contacto
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Información del contacto:</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #495057; width: 30%;">Nombre:</td>
            <td style="padding: 8px 0; color: #212529;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #495057;">Email:</td>
            <td style="padding: 8px 0; color: #212529;">
              <a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">
                ${data.email}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #495057;">Teléfono:</td>
            <td style="padding: 8px 0; color: #212529;">
              <a href="tel:${data.phoneNumber}" style="color: #007bff; text-decoration: none;">
                ${data.phoneNumber}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #495057;">Idioma:</td>
            <td style="padding: 8px 0; color: #212529;">${data.language === 'es' ? 'Español' : 'English'}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #ffffff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px;">
        <h3 style="color: #495057; margin-top: 0;">Mensaje:</h3>
        <p style="color: #212529; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px; font-size: 12px; color: #666;">
        <p style="margin: 0;">
          <strong>📅 Fecha:</strong> ${new Date().toLocaleString('es-ES', { 
            timeZone: 'America/Argentina/Buenos_Aires',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p style="margin: 5px 0 0 0;">
          <strong>🌐 Origen:</strong> Portfolio - Formulario de contacto
        </p>
      </div>
    </div>
  `;
  
  const text = `
NUEVO MENSAJE DE CONTACTO

Información del contacto:
- Nombre: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Teléfono: ${data.phoneNumber}
- Idioma: ${data.language === 'es' ? 'Español' : 'English'}

Mensaje:
${data.message}

---
Fecha: ${new Date().toLocaleString('es-ES', { 
  timeZone: 'America/Argentina/Buenos_Aires' 
})}
Origen: Portfolio - Formulario de contacto
  `;
  
  return { subject, html, text };
}

// Función principal para enviar email
export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createEmailTransporter();
    const emailContent = createEmailContent(data);
    
    // Verificar conexión con Gmail
    await transporter.verify();
    
    // Configurar el email
    const mailOptions = {
      from: `"${data.firstName} ${data.lastName}" <${process.env.GMAIL_USER}>`,
      to: process.env.DESTINATION_EMAIL,
      replyTo: data.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };
    
    // Enviar el email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email enviado exitosamente:', result.messageId);
    
    return { success: true };
    
  } catch (error) {
    console.error('Error enviando email:', error);
    
    if (error instanceof Error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: false, 
      error: 'Error desconocido al enviar email' 
    };
  }
}