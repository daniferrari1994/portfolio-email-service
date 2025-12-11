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

// Función para crear el contenido HTML del email de confirmación
export function createConfirmationEmailContent(data: ContactFormData): { subject: string; html: string; text: string } {
  const subject = `✅ Confirmación: Tu mensaje ha sido recibido - Portfolio de Dan Ferrari`;
  
  const isSpanish = data.language === 'es';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #5ad3bd; border-bottom: 2px solid #5ad3bd; padding-bottom: 10px;">
        ✅ ${isSpanish ? 'Mensaje recibido' : 'Message received'}
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #495057; font-size: 16px; margin-top: 0;">
          ${isSpanish ? `Hola ${data.firstName},` : `Hi ${data.firstName},`}
        </p>
        <p style="color: #495057; line-height: 1.6;">
          ${isSpanish 
            ? 'Gracias por contactarte conmigo a través de mi portfolio. He recibido tu mensaje y me pondré en contacto contigo lo antes posible.'
            : 'Thank you for contacting me through my portfolio. I have received your message and will get back to you as soon as possible.'
          }
        </p>
      </div>
      
      <div style="background-color: #ffffff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px;">
        <h3 style="color: #495057; margin-top: 0;">
          ${isSpanish ? 'Resumen de tu mensaje:' : 'Summary of your message:'}
        </h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #5ad3bd;">
          <p style="color: #212529; line-height: 1.6; margin: 0; font-style: italic;">
            "${data.message}"
          </p>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding: 20px; background-color: #e7f3ff; border-radius: 8px;">
        <p style="color: #495057; margin: 0; text-align: center;">
          ${isSpanish 
            ? '💼 Mientras tanto, puedes seguir explorando mi portfolio en:'
            : '💼 Meanwhile, you can continue exploring my portfolio at:'
          }
        </p>
        <p style="text-align: center; margin: 10px 0;">
          <a href="https://daniferrari1994.github.io/portfolio/" 
             style="color: #5ad3bd; text-decoration: none; font-weight: bold;">
            https://daniferrari1994.github.io/portfolio/
          </a>
        </p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666; text-align: center;">
        <p style="margin: 0;">
          ${isSpanish 
            ? 'Este es un email automático de confirmación. No responder a este mensaje.'
            : 'This is an automated confirmation email. Please do not reply to this message.'
          }
        </p>
        <p style="margin: 5px 0 0 0;">
          <strong>Dan Ferrari</strong> - Frontend Developer
        </p>
      </div>
    </div>
  `;
  
  const text = `
    ${isSpanish ? 'MENSAJE RECIBIDO' : 'MESSAGE RECEIVED'}

    ${isSpanish ? `Hola ${data.firstName},` : `Hi ${data.firstName},`}

    ${isSpanish 
      ? 'Gracias por contactarte conmigo a través de mi portfolio. He recibido tu mensaje y me pondré en contacto contigo lo antes posible.'
      : 'Thank you for contacting me through my portfolio. I have received your message and will get back to you as soon as possible.'
    }

    ${isSpanish ? 'Resumen de tu mensaje:' : 'Summary of your message:'}
    "${data.message}"

    ${isSpanish ? 'Portfolio:' : 'Portfolio:'} https://daniferrari1994.github.io/portfolio/

    ---
    ${isSpanish 
      ? 'Este es un email automático de confirmación. No responder a este mensaje.'
      : 'This is an automated confirmation email. Please do not reply to this message.'
    }

    Dan Ferrari - Frontend Developer
  `;
  
  return { subject, html, text };
}

// Función para crear el contenido HTML del email
export function createEmailContent(data: ContactFormData): { subject: string; html: string; text: string } {
  const subject = `[Portfolio] Mensaje de ${data.firstName} ${data.lastName} - ${data.email}`;
  
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

// Función para enviar email de confirmación al usuario
export async function sendConfirmationEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createEmailTransporter();
    const emailContent = createConfirmationEmailContent(data);
    
    // Configurar el email de confirmación
    const mailOptions = {
      from: `"Dan Ferrari - Portfolio" <${process.env.GMAIL_USER}>`,
      to: data.email, // Email del usuario que envió el mensaje
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };
    
    // Enviar el email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email de confirmación enviado exitosamente:', result.messageId);
    
    return { success: true };
    
  } catch (error) {
    console.error('Error enviando email de confirmación:', error);
    
    if (error instanceof Error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: false, 
      error: 'Error desconocido al enviar email de confirmación' 
    };
  }
}

// Función principal para enviar emails (contacto + confirmación)
export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createEmailTransporter();
    
    // Verificar conexión con Gmail
    await transporter.verify();
    
    // 1. Enviar email de contacto a ti
    const contactEmailContent = createEmailContent(data);
    const contactMailOptions = {
      from: `"Portfolio - ${data.firstName} ${data.lastName}" <${process.env.GMAIL_USER}>`,
      to: process.env.DESTINATION_EMAIL,
      replyTo: data.email,
      subject: contactEmailContent.subject,
      text: contactEmailContent.text,
      html: contactEmailContent.html,
    };
    
    const contactResult = await transporter.sendMail(contactMailOptions);
    console.log('Email de contacto enviado exitosamente:', contactResult.messageId);
    
    // 2. Enviar email de confirmación al usuario
    const confirmationResult = await sendConfirmationEmail(data);
    
    if (!confirmationResult.success) {
      console.warn('Error enviando email de confirmación:', confirmationResult.error);
      // No fallar todo el proceso si solo falla la confirmación
    }
    
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