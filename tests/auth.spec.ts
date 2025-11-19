// tests/auth.spec.ts
import { expect, test } from '@playwright/test';

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

    // Paso 5: Hacer clic en el botón "SIGN UP" 
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


    // Se elimina la comprobación del mensaje de texto, ya que no existe.
    // await expect(page.getByText('cuenta ha sido creada')).toBeVisible();
  });
  /*
   * =================================================================
   * CP-AUT-002: REGISTRO FALLIDO (CORREO DUPLICADO) 
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
   * CP-AUT-003: REGISTRO FALLIDO (CONTRASEÑAS NO COINCIDEN) 
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
   * CP-AUT-004: LOGIN EXITOSO (CAMINO FELIZ) 
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
    await expect(page).toHaveURL('/', { timeout: 15000 });

    // Resultado 2: La interfaz muestra que la sesión está iniciada.
    // (¡OJO! Esta es una suposición. Busca un botón "Log Out"
    // o "Profile" que SOLO aparezca cuando estás logueado)
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();

  });

  /*
   * =================================================================
   * CP-AUT-005: LOGIN FALLIDO (CONTRASEÑA INCORRECTA) 
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

  /*
   * =================================================================
   * CP-AUT-006: LOGIN FALLIDO (CORREO NO EXISTENTE) 
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-006
   * NOMBRE: Inicio de sesión fallido con correo no existente.
   *
   */
  test('CP-AUT-006: Inicio de sesión fallido con correo no existente', async ({ page }) => {

    // --- Precondiciones ---
    // 1. Asegúrate de que "no.existe@correo.com" NO esté en tu BD.
    // 2. El usuario se encuentra en la página de login
    await page.goto('/login');

    // --- Pasos ---

    // Paso 1: Ingresar un correo electrónico que no exista
    await page.getByRole('textbox', { name: 'Email address' }).fill('ogluglo@gmail.com');

    // Paso 2: Ingresar la contraseña correcta [cite: 394]
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678');

    await page.getByRole('checkbox', { name: 'Remember me' }).check();

    // Paso 3: Hacer clic en el botón "SIGN IN" [cite: 395]
    //await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    // --- Resultados Esperados ---

    // Resultado 1: El sistema NO inicia sesión (la URL sigue siendo /login)
    await expect(page).toHaveURL('/login');

    // Resultado 2: Se muestra un mensaje de error genérico
    // (¡OJO! Ajusta el texto "Invalid email or password")
    await page.getByRole('paragraph').filter({ hasText: 'Invalid email or password' }).click()
  });

  /*
   * =================================================================
   * CP-AUT-007: REGISTRO (AVL) - LÍMITE INFERIOR DE NOMBRE
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-007
   * NOMBRE: Intento de registro con nombre de usuario en el límite inferior (3 caracteres).
   *
   */
  test('CP-AUT-007: Registro con nombre de 3 caracteres (límite inferior)', async ({ page }) => {

    // --- Precondiciones ---
    await page.goto('/register');

    // --- Pasos ---

    // Paso 1: Ingresar un nombre de usuario de 3 caracteres (ej. "Ana") [cite: 228]
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Ana');
    await page.getByRole('textbox', { name: 'Lastname' }).fill('Prueba');

    // Paso 2: Completar los demás campos con datos válidos [cite: 229]
    await page.getByRole('textbox', { name: 'Email address' }).fill(`pruebas+${Date.now()}@correo.com`);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Prueba123');
    await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('Prueba123');
    await page.getByRole('checkbox', { name: 'Accept our terms and privacy' }).check();

    // Paso 3: Hacer clic en el botón "Sign Up"
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    // --- Resultados Esperados ---

    // Resultado: El registro se completa de forma exitosa [cite: 231]
    // (Basado en nuestro CP-AUT-001, "exitoso" significa redirigir a /login)
    await expect(page).toHaveURL('/login');
  });
  /*
   * =================================================================
   * CP-AUT-008: REGISTRO (AVL) - BAJO LÍMITE INFERIOR DE NOMBRE 
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-008
   * NOMBRE: Intento de registro con nombre de usuario por debajo del límite (2 caracteres).
   * ESTA VA A FALLAR PORQUE SI ACEPTA HASTA 1 SOLO CARACTER
   *
   */

  test('CP-AUT-008: Registro con nombre de 2 caracteres (bajo límite)', async ({ page }) => {

    // --- Precondiciones ---
    await page.goto('/register');

    // --- Pasos (Usando tus selectores validados) ---

    // Paso 1: Ingresar un nombre de usuario de 2 caracteres (ej. "Lu") [cite: 441]
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Lu');
    await page.getByRole('textbox', { name: 'Lastname' }).fill('Prueba');

    // Paso 2: Completar los demás campos con datos válidos [cite: 442]
    await page.getByRole('textbox', { name: 'Email address' }).fill(`pruebas+${Date.now()}@correo.com`);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Prueba123');
    await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('Prueba123');
    await page.getByRole('checkbox', { name: 'Accept our terms and privacy' }).check();

    // Paso 3: Hacer clic en el botón "Sign Up" [cite: 443]
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    // --- Resultados Esperados  ---

    // Resultado 1: El registro NO se completa (la URL sigue siendo /register)
    await expect(page).toHaveURL('/register');

    // Resultado 2: Se muestra un mensaje de error de validación
    // (¡OJO! Ajusta el texto "el nombre debe tener al menos 3 caracteres"
    // si tu mensaje de error real es diferente. Por ej: "Name must be at least 3 characters")
    await expect(page.getByText('el nombre debe tener al menos 3 caracteres')).toBeVisible();
  });

  /*
   * =================================================================
   * CP-AUT-009: REGISTRO (CLASE INVÁLIDA) - FORMATO DE CORREO INVÁLIDO [NUEVO]
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-009
   * NOMBRE: Intento de registro con formato de correo electrónico inválido.
   *
   */
  test('CP-AUT-009: Registro con formato de correo inválido', async ({ page }) => {

    // --- Precondiciones ---
    await page.goto('/register');

    // --- Pasos (Usando tus selectores validados) ---

    // Paso 1: Ingresar datos válidos en la mayoría de campos
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Usuario');
    await page.getByRole('textbox', { name: 'Lastname' }).fill('Formato');

    // Paso 2: Ingresar un correo con formato inválido (ej. sin @) [cite: 266, 267]
    await page.getByRole('textbox', { name: 'Email address' }).fill('correo-invalido.com');

    // Paso 3: Completar los campos de contraseña [cite: 270]
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Prueba123');
    await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('Prueba123');
    await page.getByRole('checkbox', { name: 'Accept our terms and privacy' }).check();

    // Paso 4: Hacer clic en el botón "Sign Up" [cite: 271]
    await page.getByRole('button', { name: 'SIGN UP' }).click();

    // --- Resultados Esperados ---

    // Resultado 1: El registro NO se completa (la URL sigue siendo /register) 
    await expect(page).toHaveURL('/register');


  });


  /*
   * =================================================================
   * CP-AUT-010: LOGIN (CLASE INVÁLIDA) - CAMPOS VACÍOS 
   * =================================================================
   */

  /**
   * CÓDIGO: CP-AUT-010
   * NOMBRE: Intento de inicio de sesión con campos vacíos.
   * NOTA: Corregido para manejar la validación nativa HTML5 (uno por uno).
   */
  test('CP-AUT-010: Intento de inicio de sesión con campos vacíos', async ({ page }) => {

    // --- Precondiciones ---
    await page.goto('/login');

    // --- Pasos (Prueba 1: Campo Email) ---

    // Paso 1: Hacer clic en "SIGN IN" con ambos campos vacíos
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    // --- Resultados Esperados (Prueba 1: Campo Email) ---

    // Resultado 1.1: La URL sigue siendo /login
    await expect(page).toHaveURL('/login');

    // Resultado 1.2: El navegador muestra el error "Please fill out this field."
    // en el primer campo (Email).
    // Usamos .evaluate() para leer el mensaje de validación del elemento.
    const emailInput = page.getByLabel('Email address');
    let validationMessage = await emailInput.evaluate(e => (e as HTMLInputElement).validationMessage);
    expect(validationMessage).toBe('Please fill out this field.');


    // --- Pasos (Prueba 2: Campo Password) ---

    // Paso 2.1: Llenamos el primer campo (Email) para que la validación avance
    await emailInput.fill('un-correo-valido@test.com');

    // Paso 2.2: Hacemos clic en "SIGN IN" de nuevo, ahora con la contraseña vacía
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    // --- Resultados Esperados (Prueba 2: Campo Password) ---

    // Resultado 2.1: La URL sigue siendo /login
    await expect(page).toHaveURL('/login');

    // Resultado 2.2: El navegador muestra el error en el segundo campo (Password)
    const passwordInput = page.getByLabel('Password');
    validationMessage = await passwordInput.evaluate(e => (e as HTMLInputElement).validationMessage);
    expect(validationMessage).toBe('Please fill out this field.');
  });




  /*
   * =================================================================
   * CP-AUT-013 (Caso 49): SOLICITUD RESET CONTRASEÑA (CORREO VÁLIDO)
   * =================================================================
   */
  
  /**
   * CÓDIGO: CP-AUT-013 
   * NOMBRE: Solicitud de restablecimiento de contraseña con correo válido. 
   *
   */
test('CP-AUT-013: Verificar la visibilidad del enlace "Forgot password?"', async ({ page }) => {
    
    // --- Precondiciones ---
    // 1. El usuario se encuentra en la página de login
    await page.goto('/login');
  
    // --- Paso de Ejecución y Verificación ---
    
    // 1. Localizar el enlace exactamente por su texto.
    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
  
    // 2. Verificar que el enlace es visible en la página.
    await expect(forgotPasswordLink).toBeVisible();

    // 3. Verificar que es un enlace "dummy".
    await expect(forgotPasswordLink).toHaveAttribute('href', '#');
  });

});