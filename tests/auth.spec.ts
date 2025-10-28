// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Módulo de Autenticación y Registro', () => {

  /**
   * CÓDIGO: CP-AUT-001
   * NOMBRE: Registro de usuario exitoso con datos válidos.
   *
   * NOTA: Script actualizado para coincidir con los campos de la captura
   * (Name, Lastname, Email address, etc.) y el checkbox de términos.
   */
  test('CP-AUT-001: Registro de usuario exitoso con datos válidos', async ({ page }) => {
    
    // Precondición 2: El usuario se encuentra en la página de registro
    // URL de tu captura:
    await page.goto('/register');

    // --- Pasos ---

   // Paso 1 (Modificado): Ingresar nombre y apellido
    // Selectores de tu captura, usando getByRole:
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('usuario');
    await page.getByRole('textbox', { name: 'Lastname' }).fill('Nuevo');

    // Paso 2: Ingresar un correo electrónico válido y único
    // Selector de tu captura, usando getByRole:
    await page.getByRole('textbox', { name: 'Email address' }).fill(`pruebas+${Date.now()}@correo.com`);

    // Paso 3: Ingresar una contraseña
    // Selector de tu captura, usando getByRole:
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Prueba123');

    // Paso 4: Confirmar la contraseña
    // Selector de tu captura, usando getByRole:
    await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('Prueba123');

    // PASO ADICIONAL: Aceptar los términos y condiciones
    // Este checkbox es obligatorio en tu formulario para poder registrarse
    await page.getByRole('checkbox', { name: 'Accept our terms and privacy' }).check()

    // Paso 5: Hacer clic en el botón "SIGN UP" [cite: 354]
    // Selector de tu captura:
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    // --- Resultados Esperados  ---

    // Resultado 1: El sistema redirige al usuario a la página de inicio de sesión (/login)
    await expect(page).toHaveURL('/login');

    // Resultado 2: Muestra un mensaje de éxito
    // --- Resultados Esperados ---

    // Resultado 1: El sistema redirige al usuario a la página de inicio de sesión (/login)
    // Como mencionaste, el registro exitoso NO muestra un mensaje,
    // solo redirige a /login. Por lo tanto, esta comprobación
    // de la URL es la única aserción que necesitamos para validar el éxito.
    await expect(page).toHaveURL('/login');

    // Se elimina la comprobación del mensaje de texto, ya que no existe.
    // await expect(page.getByText('cuenta ha sido creada')).toBeVisible();
  });
  /*
   * =================================================================
   * CP-AUT-002: REGISTRO FALLIDO (CORREO DUPLICADO) [NUEVO]
   * =================================================================
   */
  
  /**
   * CÓDIGO: CP-AUT-002
   * NOMBRE: Intento de registro con un correo electrónico ya existente.
   *
   */
  test('CP-AUT-002: Intento de registro con correo existente', async ({ page }) => {
    
    // --- Precondiciones ---
    // 1. (¡IMPORTANTE!) Debes asegurarte de que un usuario con el correo
    //    "usuario.existente@correo.com" YA EXISTA en tu base de datos MySQL.
    // 2. El usuario se encuentra en la página de registro
    await page.goto('/register');

    // --- Pasos ---
    // Llenamos el formulario con datos válidos, pero un correo repetido

    // Paso 1: Ingresar nombre y apellido
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('usuario');
    await page.getByRole('textbox', { name: 'Lastname' }).fill('existente');


    // Paso 2: Ingresar el correo electrónico YA EXISTENTE
    await page.getByRole('textbox', { name: 'Email address' }).fill('oglabuuglo@gmail.com');

    // Paso 3: Ingresar una contraseña
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Pruebass456');

    // Paso 4: Confirmar la contraseña
    await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('Pruebass456');

    // Paso Adicional: Aceptar términos
    await page.getByRole('checkbox', { name: 'Accept our terms and privacy' }).check()

    // Paso 5: Hacer clic en el botón "SIGN UP"
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    // --- Resultados Esperados---

    // Resultado 1: El sistema NO redirige a /login
    // Comprobamos que la URL SIGUE SIENDO /register
    await expect(page).toHaveURL('/register');

    // Resultado 2: Se muestra un mensaje de error claro
    // (¡OJO! Ajusta el texto "El correo electrónico ya está en uso" 
    // si tu mensaje de error real es diferente)
    await page.getByText('The email already in use').click();
  });

  /*
   * =================================================================
   * CP-AUT-003: REGISTRO FALLIDO (CONTRASEÑAS NO COINCIDEN) [NUEVO]
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-003
   * NOMBRE: Intento de registro con contraseñas que no coinciden.
   *
   */
  test('CP-AUT-003: Intento de registro con contraseñas no coincidentes', async ({ page }) => {
    
    // Precondición: El usuario se encuentra en la página de registro
    await page.goto('/register');

    // --- Pasos (Usando tus selectores validados) ---
    
    // Paso 1: Ingresar nombre y apellido
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Usuario');
    await page.getByRole('textbox', { name: 'Lastname' }).fill('Temporal');

    // Paso 2: Ingresar un correo electrónico válido y único
    await page.getByRole('textbox', { name: 'Email address' }).fill(`pruebas+${Date.now()}@correo.com`);

    // Paso 3: Ingresar una contraseña en el primer campo
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('ClaveCorrecta1');

    // Paso 4: Ingresar una contraseña diferente en el campo de confirmación
    await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('ClaveIncorrecta2');

    // Paso Adicional: Aceptar términos
    await page.getByRole('checkbox', { name: 'Accept our terms and privacy' }).check();

    // Paso 5: Hacer clic en el botón "SIGN UP"
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    // --- Resultados Esperados ---

    // Resultado 1: El sistema NO redirige a /login
    // Comprobamos que la URL SIGUE SIENDO /register
    await expect(page).toHaveURL('/register');

    // Resultado 2: Se muestra un mensaje de error claro
    // (¡OJO! Ajusta el texto "Las contraseñas no coinciden" 
    // si tu mensaje de error real es diferente. Por ej: "Passwords do not match")
    await page.getByRole('paragraph').filter({ hasText: 'Passwords are not equal' }).click();
  });
  /*
   * =================================================================
   * CP-AUT-004: LOGIN EXITOSO (CAMINO FELIZ) [NUEVO]
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-004
   * NOMBRE: Inicio de sesión exitoso con credenciales válidas.
   *
   */
  test('CP-AUT-004: Inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
    
    // --- Precondiciones ---
    // 1. (¡IMPORTANTE!) Debes tener un usuario en tu BD con estas
    //    credenciales exactas:
    //    Email: "pruebas@correo.com"
    //    Pass:  "Prueba123"
    //    (Estas son las credenciales del plan de pruebas )
    //
    // 2. El usuario se encuentra en la página de login
    await page.goto('/login');

    // --- Pasos (Usando selectores de tu captura de /login) ---
    
    // Paso 1: Ingresar el correo electrónico del usuario registrado [cite: 393]
    
    await page.getByRole('textbox', { name: 'Email address' }).fill('oglabuuglo@gmail.com');

    // Paso 2: Ingresar la contraseña correcta [cite: 394]
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678');

    await page.getByRole('checkbox', { name: 'Remember me' }).check();

    // Paso 3: Hacer clic en el botón "SIGN IN" [cite: 395]
    //await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    // --- Resultados Esperados  ---

    // Resultado 1: El sistema autentica y redirige a la página principal
    // (Asumimos que la página principal es '/')
    await expect(page).toHaveURL('/');

    // Resultado 2: La interfaz muestra que la sesión está iniciada.
    // (¡OJO! Esta es una suposición. Busca un botón "Log Out"
    // o "Profile" que SOLO aparezca cuando estás logueado)
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();

  });

  /*
   * =================================================================
   * CP-AUT-005: LOGIN FALLIDO (CONTRASEÑA INCORRECTA) [NUEVO]
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-005
   * NOMBRE: Inicio de sesión fallido con contraseña incorrecta.
   *
   */
  test('CP-AUT-005: Inicio de sesión fallido con contraseña incorrecta', async ({ page }) => {
    
    // --- Precondiciones ---
    // 1. (¡IMPORTANTE!) El usuario "pruebas@correo.com" debe existir
    //    en tu base de datos.
    // 2. El usuario se encuentra en la página de login
    await page.goto('/login');

    // --- Pasos ---

     
    // Paso 1: Ingresar el correo electrónico del usuario registrado [cite: 393]
    
    await page.getByRole('textbox', { name: 'Email address' }).fill('oglabuuglo@gmail.com');

    // Paso 2: Ingresar la contraseña correcta [cite: 394]
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678910');

    await page.getByRole('checkbox', { name: 'Remember me' }).check();

    // Paso 3: Hacer clic en el botón "SIGN IN" [cite: 395]
    //await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('button', { name: 'SIGN IN' }).click(); 

    // --- Resultados Esperados ---

    // Resultado 1: El sistema NO inicia sesión (la URL sigue siendo /login)
    await expect(page).toHaveURL('/login');

    // Resultado 2: Se muestra un mensaje de error claro 
    // (¡OJO! Ajusta el texto "Invalid email or password"
    // si tu mensaje de error real es diferente. Es probable que lo sea).
    await page.getByRole('paragraph').filter({ hasText: 'Invalid email or password' }).click();
  });
  

});