import { test, expect } from '@playwright/test';

test.describe('Módulo de Carrito (CP-CAR)', () => {

  // El "slug" del producto sin stock
  const productURL = '/product/smart-phone-demo'; 

  test('CP-CAR-009: Intentar agregar al carrito un producto sin stock', async ({ page }) => {
    
    // ---
    // FASE 1: EJECUCIÓN DEL TEST (Como cliente)
    // ---

    // 1. Ir directamente a la página del producto sin stock
    await page.goto(productURL);

    // 2. Definir los localizadores para los elementos que queremos comprobar
    const addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    const outOfStockText = page.getByText('Out of stock'); // Buscamos el texto

    // ---
    // FASE 2: VERIFICACIÓN (Resultados Esperados)
    // ---
    
    // ✅ Verificación 1: El texto "Out of stock" SÍ debe ser visible.
    await expect(outOfStockText).toBeVisible();

    // ✅ Verificación 2: El botón "Add to Cart" NO debe ser visible (debe estar oculto).
    await expect(addToCartButton).not.toBeVisible();
  });


  test('CP-CAR-011: Fusión del carrito de un usuario anónimo al iniciar sesión', async ({ page }) => {

    // --- Datos de Prueba ---
    const productSlug = '/product/phone-gimbal-demo';
    const productName = 'Phone gimbal';
    const userEmail = 'joshuapicado0312@gmail.com'; 
    const userPass = 'Joshua24092003';            

    // ---
    // FASE 1: EJECUCIÓN (Como Anónimo)
    // ---

    // 1. Ir a la página del producto
    await page.goto(productSlug);

    // 2. Localizar y hacer clic en "Add to Cart"
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // 3. Esperar la notificación de éxito
    await expect(page.getByText('Product added to the cart')).toBeVisible();

    // 4. Ir a la página del carrito
    await page.goto('/cart');

    // 5. Verificación (Anónima): El producto está en el carrito
    await expect(page.getByText(productName)).toBeVisible();

    // ---
    // FASE 2: EJECUCIÓN (Iniciar Sesión)
    // ---

    // 6. Ir a la página de login
    await page.goto('/login');

    // 7. Llenar el formulario de login
    await page.getByRole('textbox', { name: 'Email address' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(userPass);

    // 8. Hacer clic en "SIGN IN"
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    // 9. Esperar a ser redirigido a la página principal
    await expect(page).toHaveURL('/');

    // ---
    // FASE 3: VERIFICACIÓN (Como Usuario Logueado)
    // ---

    // 10. Ir a la página del carrito nuevamente
    await page.goto('/cart');

    // Verificar que el "Phone gimbal" que añadimos como anónimos
    await expect(page.getByText(productName)).toBeVisible();
  });

});


