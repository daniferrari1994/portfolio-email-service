import { z } from 'zod';

// Esquema para validar los datos del formulario de contacto
export const ContactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras'),
  
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El apellido solo puede contener letras'),
  
  email: z
    .string()
    .email('Email inválido')
    .max(50, 'El email no puede exceder 50 caracteres'),
  
  phoneNumber: z
    .string()
    .min(8, 'El teléfono debe tener al menos 8 caracteres')
    .max(15, 'El teléfono no puede exceder 15 caracteres')
    .regex(/^[+]?[0-9\s\-\(\)\.]+$/, 'El teléfono contiene caracteres inválidos'),
  
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres'),
  
  language: z
    .string()
    .optional()
    .default('es')
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;