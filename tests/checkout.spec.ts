import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
test.describe('Módulo de Proceso de Compra (CP-CHK)', () => {

  // ---
  // CP-CHK-001 (Caso 27)
  // ---
  test('CP-CHK-001: Transición válida del Carrito a la página de Información de Envío', async ({ page }) => {

    const productLinkText = 'Phone gimbal';
    const productSlug = 'phone-gimbal-demo';

    // ---
    // FASE 1: SETUP (Precondiciones)
    // ---

    // 1. Iniciar sesión
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'joshuapicado0312@gmail.com');
    await page.fill('input[name="password"]', 'Joshua24092003');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 2. Esperar a la página principal
    await page.waitForURL('/');
    await page.waitForLoadState('networkidle');

    // 3. Ir a la página del producto
    const productCard = page.locator('div.flex.flex-col').filter({ has: page.getByText(productLinkText, { exact: true }) });
    await productCard.getByRole('link', { name: 'View product' }).click();

    // 4. Añadir al carrito desde la página de detalles
    await page.waitForURL(`/product/${productSlug}`);
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // 5. Esperar a que la notificación "toast" confirme
    const toast = page.getByText('Product added to the cart');
    await expect(toast).toBeVisible();

    // ----- NUEVA LÍNEA CLAVE -----
    // 6. Esperar a que el "toast" DESAPAREZCA para no bloquear el clic
    await expect(toast).toBeHidden();
    
    // ---
    // FASE 2: EJECUCIÓN DEL TEST
    // ---
    
    // 1. Localizar el enlace del carrito por su 'href'
    const cartLink = page.locator('a[href="/cart"]');
    
    // 2. Hacer clic (ahora es seguro, no hay "toast")
    await cartLink.click();
    
    // 3. Esperar a que la página del carrito cargue
    await page.waitForURL('/cart');
    
    // 4. Hacer clic en el enlace "Checkout"
    await page.getByRole('link', { name: 'Checkout' }).click();

    // ---
    // FASE 3: VERIFICACIÓN
    // ---
    
    // 1. Esperar a que la navegación a la página de envío termine
    await page.waitForURL('/checkout');
    
    // 2. Verificar que la URL final es la correcta
    await expect(page).toHaveURL('/checkout');
    
    // 3. Comprobar que vemos el título
    await expect(page.getByRole('heading', { name: 'Shipping address' })).toBeVisible();
  });

  // ---
  // CP-CHK-002 (Caso 28)
  // ---
  test('CP-CHK-002: Verificar que el formulario de pago es visible', async ({ page }) => {

    const productLinkText = 'Phone gimbal';
    const productSlug = 'phone-gimbal-demo';

    // ---
    // FASE 1: SETUP (Precondiciones)
    // ---

    // 1. Iniciar sesión
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'joshuapicado0312@gmail.com');
    await page.fill('input[name="password"]', 'Joshua24092003');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 2. Esperar a la página principal
    await page.waitForURL('/');
    await page.waitForLoadState('networkidle');

    // 3. Ir a la página del producto
    const productCard = page.locator('div.flex.flex-col').filter({ has: page.getByText(productLinkText, { exact: true }) });
    await productCard.getByRole('link', { name: 'View product' }).click();

    // 4. Añadir al carrito
    await page.waitForURL(`/product/${productSlug}`);
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // 5. Esperar a que la notificación "toast" confirme
    const toast = page.getByText('Product added to the cart');
    await expect(toast).toBeVisible();
    await expect(toast).toBeHidden(); // Esperar a que desaparezca
    
    // ---
    // FASE 2: EJECUCIÓN DEL TEST
    // ---
    
    // 1. Ir al carrito
    const cartLink = page.locator('a[href="/cart"]');
    await cartLink.click();
    
    // 2. Ir a checkout
    await page.waitForURL('/cart');
    await page.getByRole('link', { name: 'Checkout' }).click();

    // ---
    // FASE 3: VERIFICACIÓN
    // ---
    
    // 1. Esperar a que la página de checkout cargue
    await page.waitForURL('/checkout');
    
    // 2. Verificar que la URL es la correcta
    await expect(page).toHaveURL('/checkout');
    
    // 3. (VERIFICACIÓN DEL CASO 28)
    // Comprobar que vemos el título "Payment details"
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
  test('CP-CHK-010: Persistencia de la información de envío al navegar fuera y volver', async ({ page }) => {

    // --- FASE 1: SETUP (Llegar al checkout) ---
    const productSlug = 'phone-gimbal-demo';

    // 1. Iniciar sesión
    await page.goto('/login');
    await page.fill('input[name="email"]', 'oglabuuglo@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 2. Añadir producto al carrito
    await page.goto(`/product/${productSlug}`);
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByText('Product added to the cart')).toBeVisible();
    await expect(page.getByText('Product added to the cart')).toBeHidden();
    
    // 3. Ir a la página de checkout (Click 1)
    await page.goto('/cart');
    await page.getByRole('link', { name: 'Checkout' }).click();
    await page.waitForURL('/checkout');

    // --- FASE 2: EJECUCIÓN (Llenar el formulario y navegar) ---

    // 4. Llenar el formulario de envío
    const testAddress = `123 Main St ${Date.now()}`;
    const testCity = 'Testville';
    await page.getByRole('textbox', { name: 'Address', exact: true }).fill(testAddress);
    await page.getByRole('textbox', { name: 'City', exact: true }).fill(testCity);

    // 5. Navegar fuera de la página (a la página principal)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 6. Volver a la página de checkout (intentando ir directo)
    await page.goto('/checkout');
    
    // 7. Verificar que nos redirigió al carrito
    await expect(page).toHaveURL('/cart');

    // 8. Hacer clic en "Checkout" OTRA VEZ
    await page.getByRole('link', { name: 'Checkout' }).click();
    await page.waitForURL('/checkout');

    // --- FASE 3: VERIFICACIÓN  ---
    
    // 9. El script espera encontrar los datos.
    //    El resultado será: Error: Expected "Testville", received ""
    await expect(page.getByRole('textbox', { name: 'Address', exact: true })).toHaveValue(testAddress);
    await expect(page.getByRole('textbox', { name: 'City', exact: true })).toHaveValue(testCity);
  });

});