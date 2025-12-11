import {
  createEmailTransporter,
  createConfirmationEmailContent,
  createEmailContent,
  sendConfirmationEmail,
  sendContactEmail
} from '../emailService';
import { ContactFormData } from '../validations';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');
const mockNodemailer = jest.mocked(nodemailer);

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
});

describe('emailService', () => {
  const mockContactData: ContactFormData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phoneNumber: '+54 11 1234-5678',
    message: 'Este es un mensaje de prueba para el sistema de contacto.',
    language: 'es'
  };

  const mockContactDataEnglish: ContactFormData = {
    ...mockContactData,
    language: 'en'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEmailTransporter', () => {
    it('should create email transporter with correct configuration', () => {
      const mockCreateTransport = jest.fn();
      mockNodemailer.createTransport = mockCreateTransport;

      createEmailTransporter();

      expect(mockCreateTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    });

    it('should return transporter instance', () => {
      const mockTransporter = { sendMail: jest.fn() };
      mockNodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);

      const result = createEmailTransporter();
      expect(result).toBe(mockTransporter);
    });
  });

  describe('createConfirmationEmailContent', () => {
    it('should create Spanish confirmation email content', () => {
      const result = createConfirmationEmailContent(mockContactData);

      expect(result.subject).toBe('✅ Confirmación: Tu mensaje ha sido recibido - Portfolio de Dan Ferrari');
      expect(result.html).toContain('Hola Juan');
      expect(result.html).toContain('Gracias por contactarte conmigo');
      expect(result.html).toContain('Este es un mensaje de prueba para el sistema de contacto.');
      expect(result.html).toContain('daniferrari1994.github.io/portfolio/');
      expect(result.text).toContain('MENSAJE RECIBIDO');
      expect(result.text).toContain('Hola Juan');
      expect(result.text).toContain('Gracias por contactarte conmigo');
    });

    it('should create English confirmation email content', () => {
      const result = createConfirmationEmailContent(mockContactDataEnglish);

      expect(result.subject).toBe('✅ Confirmación: Tu mensaje ha sido recibido - Portfolio de Dan Ferrari');
      expect(result.html).toContain('Hi Juan');
      expect(result.html).toContain('Thank you for contacting me');
      expect(result.html).toContain('Este es un mensaje de prueba para el sistema de contacto.');
      expect(result.text).toContain('MESSAGE RECEIVED');
      expect(result.text).toContain('Hi Juan');
      expect(result.text).toContain('Thank you for contacting me');
    });

    it('should include user message in both HTML and text content', () => {
      const result = createConfirmationEmailContent(mockContactData);

      expect(result.html).toContain(mockContactData.message);
      expect(result.text).toContain(mockContactData.message);
    });

    it('should include portfolio link in both versions', () => {
      const result = createConfirmationEmailContent(mockContactData);
      const portfolioUrl = 'https://daniferrari1994.github.io/portfolio/';

      expect(result.html).toContain(portfolioUrl);
      expect(result.text).toContain(portfolioUrl);
    });

    it('should handle special characters in user name', () => {
      const dataWithSpecialChars: ContactFormData = {
        ...mockContactData,
        firstName: 'José María',
      };

      const result = createConfirmationEmailContent(dataWithSpecialChars);
      expect(result.html).toContain('José María');
      expect(result.text).toContain('José María');
    });
  });

  describe('createEmailContent', () => {
    beforeEach(() => {
      // Mock Date for consistent testing
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T10:30:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create contact email content with correct subject', () => {
      const result = createEmailContent(mockContactData);

      expect(result.subject).toBe(`[Portfolio] Mensaje de ${mockContactData.firstName} ${mockContactData.lastName} - ${mockContactData.email}`);
    });

    it('should include all contact information in HTML', () => {
      const result = createEmailContent(mockContactData);

      expect(result.html).toContain('Juan Pérez');
      expect(result.html).toContain('juan.perez@example.com');
      expect(result.html).toContain('+54 11 1234-5678');
      expect(result.html).toContain('Español');
      expect(result.html).toContain(mockContactData.message);
    });

    it('should include all contact information in text', () => {
      const result = createEmailContent(mockContactData);

      expect(result.text).toContain('Juan Pérez');
      expect(result.text).toContain('juan.perez@example.com');
      expect(result.text).toContain('+54 11 1234-5678');
      expect(result.text).toContain('Español');
      expect(result.text).toContain(mockContactData.message);
    });

    it('should show English when language is en', () => {
      const result = createEmailContent(mockContactDataEnglish);

      expect(result.html).toContain('English');
      expect(result.text).toContain('English');
    });

    it('should include timestamp and origin info', () => {
      const result = createEmailContent(mockContactData);

      expect(result.html).toContain('Fecha:');
      expect(result.html).toContain('Portfolio - Formulario de contacto');
      expect(result.text).toContain('Fecha:');
      expect(result.text).toContain('Portfolio - Formulario de contacto');
    });

    it('should create clickable links in HTML', () => {
      const result = createEmailContent(mockContactData);

      expect(result.html).toContain(`mailto:${mockContactData.email}`);
      expect(result.html).toContain(`tel:${mockContactData.phoneNumber}`);
    });
  });

  describe('sendConfirmationEmail', () => {
    let mockTransporter: any;
    let mockSendMail: jest.Mock;

    beforeEach(() => {
      mockSendMail = jest.fn();
      mockTransporter = {
        sendMail: mockSendMail,
      };
      mockNodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);
    });

    it('should send confirmation email successfully', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const result = await sendConfirmationEmail(mockContactData);

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: `"Dan Ferrari - Portfolio" <${process.env.GMAIL_USER}>`,
          to: mockContactData.email,
          subject: '✅ Confirmación: Tu mensaje ha sido recibido - Portfolio de Dan Ferrari',
          text: expect.any(String),
          html: expect.any(String),
        })
      );
      expect(console.log).toHaveBeenCalledWith('Email de confirmación enviado exitosamente:', 'test-message-id');
    });

    it('should handle email sending errors', async () => {
      const errorMessage = 'SMTP connection failed';
      mockSendMail.mockRejectedValue(new Error(errorMessage));

      const result = await sendConfirmationEmail(mockContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error enviando email de confirmación:', expect.any(Error));
    });

    it('should handle unknown errors', async () => {
      mockSendMail.mockRejectedValue('Unknown error type');

      const result = await sendConfirmationEmail(mockContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error desconocido al enviar email de confirmación');
    });

    it('should use correct email configuration', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-id' });

      await sendConfirmationEmail(mockContactData);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.from).toBe(`"Dan Ferrari - Portfolio" <${process.env.GMAIL_USER}>`);
      expect(callArgs.to).toBe(mockContactData.email);
      expect(callArgs.subject).toContain('✅ Confirmación');
      expect(callArgs.html).toBeTruthy();
      expect(callArgs.text).toBeTruthy();
    });
  });

  describe('sendContactEmail', () => {
    let mockTransporter: any;
    let mockSendMail: jest.Mock;
    let mockVerify: jest.Mock;

    beforeEach(() => {
      mockSendMail = jest.fn();
      mockVerify = jest.fn();
      mockTransporter = {
        sendMail: mockSendMail,
        verify: mockVerify,
      };
      mockNodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);
    });

    it('should send both contact and confirmation emails successfully', async () => {
      mockVerify.mockResolvedValue(true);
      mockSendMail
        .mockResolvedValueOnce({ messageId: 'contact-message-id' })
        .mockResolvedValueOnce({ messageId: 'confirmation-message-id' });

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(true);
      expect(mockVerify).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledTimes(2);

      // Verify contact email
      const contactEmailCall = mockSendMail.mock.calls[0][0];
      expect(contactEmailCall.from).toBe(`"Portfolio - ${mockContactData.firstName} ${mockContactData.lastName}" <${process.env.GMAIL_USER}>`);
      expect(contactEmailCall.to).toBe(process.env.DESTINATION_EMAIL);
      expect(contactEmailCall.replyTo).toBe(mockContactData.email);
      expect(contactEmailCall.subject).toContain('[Portfolio] Mensaje de');

      // Verify confirmation email
      const confirmationEmailCall = mockSendMail.mock.calls[1][0];
      expect(confirmationEmailCall.to).toBe(mockContactData.email);
    });

    it('should handle transporter verification failure', async () => {
      const verificationError = new Error('SMTP verification failed');
      mockVerify.mockRejectedValue(verificationError);

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMTP verification failed');
      expect(console.error).toHaveBeenCalledWith('Error enviando email:', verificationError);
    });

    it('should handle contact email sending failure', async () => {
      mockVerify.mockResolvedValue(true);
      const contactEmailError = new Error('Failed to send contact email');
      mockSendMail.mockRejectedValue(contactEmailError);

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to send contact email');
    });

    it('should succeed even if confirmation email fails', async () => {
      mockVerify.mockResolvedValue(true);
      mockSendMail
        .mockResolvedValueOnce({ messageId: 'contact-message-id' })
        .mockRejectedValueOnce(new Error('Confirmation email failed'));

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(true);
      expect(console.warn).toHaveBeenCalledWith('Error enviando email de confirmación:', 'Confirmation email failed');
    });

    it('should handle unknown errors', async () => {
      mockVerify.mockResolvedValue(true);
      mockSendMail.mockRejectedValue('Unknown error type');

      const result = await sendContactEmail(mockContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error desconocido al enviar email');
    });

    it('should create contact email with correct replyTo', async () => {
      mockVerify.mockResolvedValue(true);
      mockSendMail.mockResolvedValue({ messageId: 'test' });

      await sendContactEmail(mockContactData);

      const contactEmailCall = mockSendMail.mock.calls[0][0];
      expect(contactEmailCall.replyTo).toBe(mockContactData.email);
    });

    it('should log successful email sending', async () => {
      mockVerify.mockResolvedValue(true);
      mockSendMail
        .mockResolvedValueOnce({ messageId: 'contact-id' })
        .mockResolvedValueOnce({ messageId: 'confirmation-id' });

      await sendContactEmail(mockContactData);

      expect(console.log).toHaveBeenCalledWith('Email de contacto enviado exitosamente:', 'contact-id');
    });
  });
});