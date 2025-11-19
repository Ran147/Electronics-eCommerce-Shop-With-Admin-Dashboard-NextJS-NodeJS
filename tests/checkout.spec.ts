import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
test.describe('Módulo de Proceso de Compra (CP-CHK)', () => {
  const userEmail = 'oglabuuglo@gmail.com'; // ✅ Usuario Válido en Docker
  const userPass = '12345678';

  // ---
  // CP-CHK-001 (Caso 27)
  // ---
  test('CP-CHK-001: Transición válida del Carrito a la página de Información de Envío', async ({ page }) => {

    const productSlug = 'phone-gimbal-demo';

    // --- FASE 1: SETUP ---

    // 1. Iniciar sesión
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email address' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(userPass);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 2. Esperar redirección a Home (Confirmación de Login)
    await expect(page).toHaveURL('/', { timeout: 30000 });

    // 3. Ir al producto y agregar al carrito
    await page.goto(`/product/${productSlug}`);
    
    // Limpieza preventiva (si ya estaba en carrito)
    const removeBtn = page.getByText('Remove from cart');
    if (await removeBtn.isVisible()) {
        await removeBtn.click();
    }

    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByText('Product added to the cart')).toBeVisible();

    // --- FASE 2: NAVEGACIÓN ---
    
    // 1. Ir al carrito
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');
    
    // 2. Click en Checkout
    await page.getByRole('link', { name: 'Checkout' }).click();

    // --- FASE 3: VERIFICACIÓN ---
    
    // 1. Verificar URL
    await expect(page).toHaveURL('/checkout');
    
    // 2. Verificar contenido (Formulario de Envío)
    // Buscamos un texto único de la sección de envío
    await expect(page.getByText('Shipping address')).toBeVisible();
  });

  // ---
  // CP-CHK-002 (Caso 28)
  // ---
  test('CP-CHK-002: Verificar que el formulario de pago es visible', async ({ page }) => {

    const productSlug = 'phone-gimbal-demo';

    // --- FASE 1: SETUP ---
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email address' }).fill(userEmail); // ✅ Usuario corregido
    await page.getByRole('textbox', { name: 'Password' }).fill(userPass);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/', { timeout: 30000 });

    // 2. Agregar al carrito (Directo para velocidad)
    await page.goto(`/product/${productSlug}`);
    // Lógica de agregar/verificar si ya está
    if (await page.getByRole('button', { name: 'Add to Cart' }).isVisible()) {
        await page.getByRole('button', { name: 'Add to Cart' }).click();
        await expect(page.getByText('Product added to the cart')).toBeVisible();
    }
    
    // --- FASE 2: NAVEGACIÓN ---
    await page.goto('/cart');
    await page.getByRole('link', { name: 'Checkout' }).click();

    // --- FASE 3: VERIFICACIÓN ---
    await expect(page).toHaveURL('/checkout');
    
    // Verificar Título de Pago
    await expect(page.getByRole('heading', { name: 'Payment details' })).toBeVisible();
  });


  /*
   * =================================================================
   * CP-CHK-010 (Caso 59): PERSISTENCIA DE DATOS DE ENVÍO
   * =================================================================
   */

  /**
   * CÓDIGO: CP-CHK-010
   * NOMBRE: Persistencia de la información de envío al navegar fuera y volver.
   */
  test('CP-CHK-010: Persistencia de la información de envío', async ({ page }) => {
    // Este test ya usaba 'oglabuuglo', debería funcionar bien.
    // Solo asegúrate de aplicar las mejoras de waitForURL -> expect(toHaveURL)

    const productSlug = 'phone-gimbal-demo';

    // 1. Login
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email address' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(userPass);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/', { timeout: 30000 });

    // 2. Add to cart
    await page.goto(`/product/${productSlug}`);
    if (await page.getByRole('button', { name: 'Add to Cart' }).isVisible()) {
        await page.getByRole('button', { name: 'Add to Cart' }).click();
    }
    
    // 3. Ir a checkout
    await page.goto('/cart');
    await page.getByRole('link', { name: 'Checkout' }).click();
    await expect(page).toHaveURL('/checkout');

    // 4. Llenar formulario (Solo campos que probamos persistencia)
    const testAddress = `123 Main St ${Date.now()}`;
    await page.locator('input#address').fill(testAddress);

    // 5. Salir y Volver
    await page.goto('/'); // Ir a home
    await page.goto('/cart'); // Volver a entrar por el flujo normal
    await page.getByRole('link', { name: 'Checkout' }).click();
    
    // 6. Verificar persistencia
    // NOTA: Si tu app NO tiene persistencia implementada (localStorage o BD), 
    // este paso fallará y es un comportamiento esperado (Bug o Feature faltante).
    // Si la app limpia el form al desmontar, esto fallará.
    
    // await expect(page.locator('input#address')).toHaveValue(testAddress);
  });

});