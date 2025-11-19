import { test, expect } from '@playwright/test';

test.describe('Módulo de Administrador (CP-ADM)', () => {

  /*
   * =================================================================
   * CP-ADM-006 (Caso 51): ACCESO NO AUTORIZADO A RUTA ADMIN
   * =================================================================
   */

  /**
   * CÓDIGO: CP-ADM-006
   * NOMBRE: Intento de acceso a una ruta de administrador por un usuario no autorizado. este falla
   *
   */
  test('CP-ADM-006: Intento de acceso a ruta admin por usuario no autorizado', async ({ page }) => {

    // --- Datos de Prueba ---
    
    // 1. Precondición: Usamos un usuario que existe y asumimos [cite_start]
    //     que tiene el rol de "Cliente" (no-admin)[cite: 828].
    const userEmail = 'joshuapicado0312@gmail.com'; 
    const userPass = 'Joshua24092003';            
    
    //    Esta es la ruta protegida que un "Cliente" NO debería poder ver.
    const adminURL = '/admin'; 
    
    // 3. Resultado Esperado: La URL a la que el sistema debe redirigir
    const expectedRedirectURL = '/';

    // ---
    // FASE 1: SETUP (Iniciar Sesión como Cliente)
    // ---
    // 1. Ir a la página de login
    await page.goto('/login');

    // 2. Llenar el formulario de login
    await page.getByRole('textbox', { name: 'Email address' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(userPass);

    // 3. Hacer clic en "SIGN IN"
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    // 4. Esperar a ser redirigido a la página principal
    await expect(page).toHaveURL(expectedRedirectURL);
    await page.waitForLoadState('networkidle');

    // ---
    // FASE 2: EJECUCIÓN (El "Ataque")
    // ---

    await page.goto(adminURL);

    // ---
    // FASE 3: VERIFICACIÓN (El Resultado Esperado)
    // ---

    // 6. Verificar que el sistema nos ha redirigido LEJOS de la ruta de admin
    await expect(page).toHaveURL(expectedRedirectURL);

    // 7. Asegurarnos de que la URL NO ES la de admin.
    //    Esto confirma que la redirección fue exitosa.
    await expect(page).not.toHaveURL(adminURL);
  });

});
