import { NextRequest } from 'next/server';
import * as emailService from '@/lib/emailService';
import { ContactFormData } from '@/lib/validations';
import { OPTIONS, POST } from '../route';

// Mock the email service
jest.mock('@/lib/emailService');
const mockEmailService = jest.mocked(emailService);

// Mock console methods
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('/api/send-email', () => {
  const mockValidContactData: ContactFormData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phoneNumber: '+5411234567',
    message: 'Este es un mensaje de prueba para el sistema de contacto.',
    language: 'es'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env.GMAIL_USER = 'test@gmail.com';
    process.env.GMAIL_APP_PASSWORD = 'test-password';
    process.env.DESTINATION_EMAIL = 'destination@test.com';
    process.env.ALLOWED_ORIGIN = 'http://localhost:3000';
  });

  describe('POST method', () => {
    const createMockRequest = (body: any, origin?: string): NextRequest => {
      const headers = new Headers();
      headers.set('content-type', 'application/json');
      if (origin) {
        headers.set('origin', origin);
      }

      const req = new NextRequest('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      return req;
    };

    it('should send email successfully with valid data', async () => {
      mockEmailService.sendContactEmail.mockResolvedValue({ success: true });
      
      const request = createMockRequest(mockValidContactData, 'http://localhost:3000');
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Email enviado exitosamente'
      });
      expect(mockEmailService.sendContactEmail).toHaveBeenCalledWith(mockValidContactData);
    });

    it('should return 400 for invalid form data', async () => {
      const invalidData = {
        firstName: 'J', // too short
        lastName: 'P', // too short
        email: 'invalid-email',
        phoneNumber: '123', // too short
        message: 'short' // too short
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Datos inválidos');
      expect(data.details).toBeDefined();
      expect(Array.isArray(data.details)).toBe(true);
      expect(mockEmailService.sendContactEmail).not.toHaveBeenCalled();
    });

    it('should return 500 when environment variables are missing', async () => {
      delete process.env.GMAIL_USER;
      
      const request = createMockRequest(mockValidContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Configuración del servidor incompleta');
      expect(console.error).toHaveBeenCalledWith('Variables de entorno faltantes');
      expect(mockEmailService.sendContactEmail).not.toHaveBeenCalled();
    });

    it('should return 500 when email service fails', async () => {
      const emailError = 'SMTP connection failed';
      mockEmailService.sendContactEmail.mockResolvedValue({ 
        success: false, 
        error: emailError 
      });
      
      const request = createMockRequest(mockValidContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(emailError);
      expect(mockEmailService.sendContactEmail).toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
      // Mock JSON parsing to throw an error
      const request = createMockRequest(mockValidContactData);
      jest.spyOn(request, 'json').mockRejectedValue(new Error('Invalid JSON'));
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Error interno del servidor');
      expect(console.error).toHaveBeenCalledWith('Error en el endpoint:', expect.any(Error));
    });

    it('should validate required fields individually', async () => {
      const incompleteData = {
        firstName: 'Juan'
        // Missing other required fields
      };

      const request = createMockRequest(incompleteData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Datos inválidos');
      expect(data.details).toBeDefined();
      expect(data.details.length).toBeGreaterThan(0);
    });

    it('should handle email service error without error message', async () => {
      mockEmailService.sendContactEmail.mockResolvedValue({ 
        success: false
        // No error message provided
      });
      
      const request = createMockRequest(mockValidContactData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Error al enviar email');
    });

    it('should apply default language when not provided', async () => {
      const dataWithoutLanguage = { ...mockValidContactData };
      delete (dataWithoutLanguage as any).language;

      mockEmailService.sendContactEmail.mockResolvedValue({ success: true });
      
      const request = createMockRequest(dataWithoutLanguage);
      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(mockEmailService.sendContactEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          ...dataWithoutLanguage,
          language: 'es' // Should default to 'es'
        })
      );
    });
  });

  describe('CORS handling', () => {
    const createMockRequest = (body: any, origin?: string): NextRequest => {
      const headers = new Headers();
      headers.set('content-type', 'application/json');
      if (origin) {
        headers.set('origin', origin);
      }

      return new NextRequest('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    };

    it('should handle CORS with allowed origin', async () => {
      process.env.ALLOWED_ORIGIN = 'http://localhost:3000,https://example.com';
      mockEmailService.sendContactEmail.mockResolvedValue({ success: true });
      
      const request = createMockRequest(mockValidContactData, 'http://localhost:3000');
      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization');
    });

    it('should handle CORS with wildcard origin', async () => {
      process.env.ALLOWED_ORIGIN = '*';
      mockEmailService.sendContactEmail.mockResolvedValue({ success: true });
      
      const request = createMockRequest(mockValidContactData, 'https://any-domain.com');
      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://any-domain.com');
    });

    it('should handle CORS with no origin header', async () => {
      process.env.ALLOWED_ORIGIN = 'http://localhost:3000';
      mockEmailService.sendContactEmail.mockResolvedValue({ success: true });
      
      const request = createMockRequest(mockValidContactData); // No origin
      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('should handle CORS with disallowed origin', async () => {
      process.env.ALLOWED_ORIGIN = 'http://localhost:3000';
      mockEmailService.sendContactEmail.mockResolvedValue({ success: true });
      
      const request = createMockRequest(mockValidContactData, 'https://malicious.com');
      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('should include CORS headers in error responses', async () => {
      const invalidData = { firstName: 'J' }; // Invalid data
      const request = createMockRequest(invalidData, 'http://localhost:3000');
      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
    });

    it('should include CORS headers in server error responses', async () => {
      delete process.env.GMAIL_USER;
      
      const request = createMockRequest(mockValidContactData, 'http://localhost:3000');
      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });
  });

  describe('OPTIONS method', () => {
    const createOptionsRequest = (origin?: string): NextRequest => {
      const headers = new Headers();
      if (origin) {
        headers.set('origin', origin);
      }

      return new NextRequest('http://localhost:3000/api/send-email', {
        method: 'OPTIONS',
        headers,
      });
    };

    it('should handle OPTIONS request with correct CORS headers', async () => {
      process.env.ALLOWED_ORIGIN = 'http://localhost:3000';
      
      const request = createOptionsRequest('http://localhost:3000');
      const response = await OPTIONS(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization');
    });

    it('should handle OPTIONS with wildcard allowed origins', async () => {
      process.env.ALLOWED_ORIGIN = '*';
      
      const request = createOptionsRequest('https://example.com');
      const response = await OPTIONS(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
    });

    it('should handle OPTIONS with no origin', async () => {
      process.env.ALLOWED_ORIGIN = 'http://localhost:3000';
      
      const request = createOptionsRequest();
      const response = await OPTIONS(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('should handle OPTIONS with multiple allowed origins', async () => {
      process.env.ALLOWED_ORIGIN = 'http://localhost:3000,https://example.com,https://test.com';
      
      const request = createOptionsRequest('https://example.com');
      const response = await OPTIONS(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
    });

    it('should fallback to first allowed origin for disallowed origin', async () => {
      process.env.ALLOWED_ORIGIN = 'http://localhost:3000,https://example.com';
      
      const request = createOptionsRequest('https://malicious.com');
      const response = await OPTIONS(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });
  });

  describe('Environment validation', () => {
    it('should require GMAIL_USER environment variable', async () => {
      delete process.env.GMAIL_USER;
      process.env.GMAIL_APP_PASSWORD = 'test-password';
      process.env.DESTINATION_EMAIL = 'test@example.com';
      
      const request = new NextRequest('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mockValidContactData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Configuración del servidor incompleta');
    });

    it('should require GMAIL_APP_PASSWORD environment variable', async () => {
      process.env.GMAIL_USER = 'test@gmail.com';
      delete process.env.GMAIL_APP_PASSWORD;
      process.env.DESTINATION_EMAIL = 'test@example.com';
      
      const request = new NextRequest('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mockValidContactData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Configuración del servidor incompleta');
    });

    it('should require DESTINATION_EMAIL environment variable', async () => {
      process.env.GMAIL_USER = 'test@gmail.com';
      process.env.GMAIL_APP_PASSWORD = 'test-password';
      delete process.env.DESTINATION_EMAIL;
      
      const request = new NextRequest('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(mockValidContactData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Configuración del servidor incompleta');
    });
  });
});