// utils/schema.test.ts

// Importa los globales de Jest para que TypeScript no dé errores
import { describe, test, expect } from '@jest/globals';

// Importa el schema que vamos a probar
import registerSchema from './schema';

// Objeto base con datos válidos para todas las pruebas
const mockValidData = {
  name: 'Usuario',
  lastname: 'Prueba',
  email: 'test@correo.com',
  password: 'Password123', // Válido (más de 8)
  confirmPassword: 'Password123', // Válido
};

describe('Validación del Esquema de Registro (registerSchema)', () => {

  /**
   * CASO DE PRUEBA: CP-AUT-011 (Test #11)
   * REPRESENTA A: Lógica de 'CP-AUT-011: Contraseña de 8 caracteres (límite válido)'
   * HERRAMIENTA: Jest
   */
  test('CP-AUT-011: Debe validar exitosamente una contraseña de 8 caracteres', () => {
    
    // 1. Precondición: Datos con contraseña de 8 caracteres
    const data = {
      ...mockValidData,
      password: 'Pass123A', // Exactamente 8 caracteres
      confirmPassword: 'Pass123A',
    };

    // 2. Acción y Resultado: Usamos 'safeParse' para ver si la validación pasa
    const result = registerSchema.safeParse(data);
    
    // 3. Verificación: El resultado debe ser exitoso
    expect(result.success).toBe(true);
  });


  /**
   * CASO DE PRUEBA: CP-AUT-012 (Test #12)
   * REPRESENTA A: Lógica de 'CP-AUT-012: Contraseña de 7 caracteres (límite inválido)'
   * HERRAMIENTA: Jest
   */
  test('CP-AUT-012: Debe fallar la validación con una contraseña de 7 caracteres', () => {
    
    // 1. Precondición: Datos con contraseña de 7 caracteres
    const data = {
      ...mockValidData,
      password: 'Pass12A', // Exactamente 7 caracteres
      confirmPassword: 'Pass12A',
    };

    // 2. Acción y Resultado:
    const result = registerSchema.safeParse(data);
    
    // 3. Verificación (Fallo): El resultado NO debe ser exitoso
    expect(result.success).toBe(false);

    // 4. Verificación (Mensaje): El error debe ser el correcto
    // (Zod devuelve un array de errores, 'issues')
    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === 'password'
      );
      // Verificamos que el mensaje de error sea el de tu schema.ts
      expect(passwordError?.message).toBe('Password must be at least 8 characters long');
    }
  });

});