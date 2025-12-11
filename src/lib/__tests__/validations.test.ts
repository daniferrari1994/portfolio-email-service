import { ContactFormSchema, type ContactFormData } from '../validations';

describe('ContactFormSchema', () => {
  const validData: ContactFormData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phoneNumber: '+5411234567',
    message: 'Este es un mensaje de prueba con suficientes caracteres para cumplir el mínimo requerido.',
    language: 'es'
  };

  describe('firstName validation', () => {
    it('should accept valid first name', () => {
      const result = ContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject first name with less than 2 characters', () => {
      const invalidData = { ...validData, firstName: 'J' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El nombre debe tener al menos 2 caracteres');
      }
    });

    it('should reject first name with more than 50 characters', () => {
      const invalidData = { ...validData, firstName: 'a'.repeat(51) };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El nombre no puede exceder 50 caracteres');
      }
    });

    it('should reject first name with numbers', () => {
      const invalidData = { ...validData, firstName: 'Juan123' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El nombre solo puede contener letras');
      }
    });

    it('should accept first name with accents and spaces', () => {
      const testData = { ...validData, firstName: 'José María' };
      const result = ContactFormSchema.safeParse(testData);
      expect(result.success).toBe(true);
    });
  });

  describe('lastName validation', () => {
    it('should reject last name with less than 2 characters', () => {
      const invalidData = { ...validData, lastName: 'P' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El apellido debe tener al menos 2 caracteres');
      }
    });

    it('should reject last name with more than 50 characters', () => {
      const invalidData = { ...validData, lastName: 'a'.repeat(51) };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El apellido no puede exceder 50 caracteres');
      }
    });

    it('should reject last name with special characters', () => {
      const invalidData = { ...validData, lastName: 'Pérez@' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El apellido solo puede contener letras');
      }
    });
  });

  describe('email validation', () => {
    it('should accept valid email', () => {
      const result = ContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = { ...validData, email: 'invalid-email' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email inválido');
      }
    });

    it('should reject email with more than 50 characters', () => {
      const longEmail = 'a'.repeat(45) + '@test.com'; // 54 chars total
      const invalidData = { ...validData, email: longEmail };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El email no puede exceder 50 caracteres');
      }
    });

    it('should accept various valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        const testData = { ...validData, email };
        const result = ContactFormSchema.safeParse(testData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('phoneNumber validation', () => {
    it('should accept valid phone numbers', () => {
      const validPhones = [
        '+5411234567',
        '(011)1234567',
        '01112345678',
        '+1234567890',
        '123.456.7890'
      ];

      validPhones.forEach(phoneNumber => {
        const testData = { ...validData, phoneNumber };
        const result = ContactFormSchema.safeParse(testData);
        expect(result.success).toBe(true);
      });
    });

    it('should reject phone number with less than 8 characters', () => {
      const invalidData = { ...validData, phoneNumber: '1234567' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El teléfono debe tener al menos 8 caracteres');
      }
    });

    it('should reject phone number with more than 15 characters', () => {
      const invalidData = { ...validData, phoneNumber: '1234567890123456' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El teléfono no puede exceder 15 caracteres');
      }
    });

    it('should reject phone number with invalid characters', () => {
      const invalidData = { ...validData, phoneNumber: '123-456-ABCD' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El teléfono contiene caracteres inválidos');
      }
    });
  });

  describe('message validation', () => {
    it('should accept valid message', () => {
      const result = ContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject message with less than 10 characters', () => {
      const invalidData = { ...validData, message: 'Hola' };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El mensaje debe tener al menos 10 caracteres');
      }
    });

    it('should reject message with more than 1000 characters', () => {
      const invalidData = { ...validData, message: 'a'.repeat(1001) };
      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('El mensaje no puede exceder 1000 caracteres');
      }
    });

    it('should accept message with exactly 1000 characters', () => {
      const testData = { ...validData, message: 'a'.repeat(1000) };
      const result = ContactFormSchema.safeParse(testData);
      expect(result.success).toBe(true);
    });
  });

  describe('language validation', () => {
    it('should default to "es" when language is not provided', () => {
      const dataWithoutLanguage = { ...validData };
      delete (dataWithoutLanguage as any).language;
      
      const result = ContactFormSchema.safeParse(dataWithoutLanguage);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBe('es');
      }
    });

    it('should accept custom language value', () => {
      const testData = { ...validData, language: 'en' };
      const result = ContactFormSchema.safeParse(testData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBe('en');
      }
    });

    it('should accept undefined language', () => {
      const testData = { ...validData, language: undefined };
      const result = ContactFormSchema.safeParse(testData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBe('es');
      }
    });
  });

  describe('complete form validation', () => {
    it('should accept completely valid form data', () => {
      const result = ContactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject form data with multiple invalid fields', () => {
      const invalidData = {
        firstName: 'J', // too short
        lastName: 'P', // too short
        email: 'invalid-email', // invalid format
        phoneNumber: '123', // too short
        message: 'short', // too short
        language: 'es'
      };

      const result = ContactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toHaveLength(5);
      }
    });

    it('should handle missing required fields', () => {
      const incompleteData = {
        firstName: 'Juan',
        // lastName missing
        email: 'juan@example.com',
        // phoneNumber missing
        // message missing
      };

      const result = ContactFormSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });
  });
});