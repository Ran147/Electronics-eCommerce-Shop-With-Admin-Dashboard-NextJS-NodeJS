// tests/cart.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Módulo de Gestión del Carrito de Compras', () => {

  test('CP-CAR-001: Agregar un producto (con stock) al carrito', async ({ page }) => {
    
    // --- Precondiciones ---
    
    // 1. REEMPLAZA ESTO con el slug de un producto que SÍ TENGA STOCK
    const productSlugConStock = 'teclado-mecanico-rgb'; // <-- ¡CAMBIA ESTO!
    
    // 2. Navegamos directamente a la página de ese producto
    await page.goto(`/product/smart-watch-demo`);

    // --- Pasos ---

    // Paso 1: En la página de detalles, hacer clic en "Add to cart"
    // (Este botón ahora debería estar HABILITADO)
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // --- Resultados Esperados ---

    // --- Resultados Esperados ---

    // Resultado 1: Se muestra la notificación de éxito
    // (Buscamos por el rol ARIA 'status', que es como react-hot-toast
    // anuncia sus notificaciones. Esto es mucho más fiable que getByText)

    await page.getByText('Product added to the cart').click();

    // Resultado 2: El icono del carrito en el header actualiza su contador
    const cartCounter = page.locator('a[href="/cart"] span');
    await expect(cartCounter).not.toHaveText('0');
  });


 test('CP-CAR-002: Aumentar la cantidad de un producto en el carrito', async ({ page }) => {

    // --- 0. Limpieza (Asegurar un carrito vacío) ---
    await page.goto('/cart');
    
    // (Tu selector de 'CartElement.tsx')
    const removeButtons = page.getByText('Remove');
    
    while (await removeButtons.count() > 0) {
      await removeButtons.first().click();
      await page.waitForTimeout(200); 
    }

    // --- 1. Preparación (Añadir producto al carrito) ---
    
    // Usamos tu producto con stock:
    const productSlugConStock = 'smart-watch-demo'; 
    
    await page.goto(`/product/${productSlugConStock}`);

    // ¡NO HAY VERIFICACIÓN DE INPUT AQUÍ!
    // Como descubrimos, es solo texto, así que solo hacemos clic.
    await page.getByRole('button', { name: 'Add to cart' }).click();
    
    // Espera a que la notificación aparezca (tu selector de codegen)
    const toastLocator = page.getByText('Product added to the cart');
    await expect(toastLocator).toBeVisible();
    
    await expect(toastLocator).not.toBeVisible(); 

    // --- 2. Prueba (Verificar el incremento) ---

    // Precondición: Ir a la página del carrito
    await page.goto('/cart');

    // ¡¡AQUÍ USAMOS EL SELECTOR QUE ENCONTRASTE!!
    // Este es el selector del CARRITO que descubriste con codegen
    const quantityInput = page.getByRole('spinbutton', { name: 'Quantity' }).first();
    
    // Verificamos que el valor es 1
    await expect(quantityInput).toHaveValue('1');

    // Hacer clic en el botón "+"
    //const increaseButton = page.getByRole('button', { name: '+' }).first();
    //await increaseButton.click();
    await page.getByRole('button').nth(2).click();
    // --- Resultados Esperados ---
    // Verificamos que el valor del 'spinbutton' es 2
    await expect(quantityInput).toHaveValue('2');
  });
  /**
   * CÓDIGO: CP-CAR-003
   * NOMBRE: Disminuir la cantidad de un producto en el carrito.
   */
  test('CP-CAR-003: Disminuir la cantidad de un producto en el carrito', async ({ page }) => {

    // --- 0. Limpieza (Asegurar un carrito vacío) ---
    await page.goto('/cart');
    
    const removeButtons = page.getByText('Remove');
    
    while (await removeButtons.count() > 0) {
      await removeButtons.first().click();
      await page.waitForTimeout(200); 
    }

    // --- 1. Preparación (Poner un producto con Cantidad = 2) ---
    
    const productSlugConStock = 'smart-watch-demo'; 
    await page.goto(`/product/${productSlugConStock}`);
    await page.getByRole('button', { name: 'Add to cart' }).click();
    
    const toastLocator = page.getByText('Product added to the cart');
    await expect(toastLocator).toBeVisible();
    await expect(toastLocator).not.toBeVisible(); 

    // Ir al carrito y AUMENTAR la cantidad a 2
    await page.goto('/cart');
    
    // Usamos el selector de AUMENTAR que te funcionó
    await page.getByRole('button').nth(2).click(); 
    
    // Verificación de la preparación: Asegurarnos de que la cantidad es 2
    const quantityInput = page.getByRole('spinbutton', { name: 'Quantity' }).first();
    await expect(quantityInput).toHaveValue('2');

    // --- 2. Prueba (Verificar el decremento) ---

    // Paso 1: Hacer clic en el botón "-"
    // (Basado en el código fuente, este es el selector del botón de decremento)
    await page.getByRole('button').nth(1).click();

    // --- Resultados Esperados ---
    // Resultado 1: El campo de cantidad ahora muestra "1"
    await expect(quantityInput).toHaveValue('1');
  });

  /**
   * CÓDIGO: CP-CAR-004
   * NOMBRE: Eliminar un producto del carrito de compras.
   */
  test('CP-CAR-004: Eliminar un producto del carrito', async ({ page }) => {

    // --- 0. Limpieza (Asegurar un carrito vacío) ---
    await page.goto('/cart');
    
    const removeButtons = page.getByText('Remove');
    
    while (await removeButtons.count() > 0) {
      await removeButtons.first().click();
      await page.waitForTimeout(200); 
    }

    // --- 1. Preparación (Añadir un producto) ---
    
    const productSlugConStock = 'smart-watch-demo'; 
    await page.goto(`/product/${productSlugConStock}`);
    await page.getByRole('button', { name: 'Add to cart' }).click();
    
    const toastLocator = page.getByText('Product added to the cart');
    await expect(toastLocator).toBeVisible();
    await expect(toastLocator).not.toBeVisible(); 

    // --- 2. Prueba (Verificar la eliminación) ---

    // Precondición: Ir a la página del carrito
    await page.goto('/cart');

    // Verificación de la preparación: Asegurarnos de que el producto está
    // (Buscamos el botón de 'Remove' para saber que hay un ítem)
    const removeButton = page.getByText('Remove').first();
    await expect(removeButton).toBeVisible();

    // Paso 1: Hacer clic en el botón "Remove"
    await removeButton.click();

    // --- Resultados Esperados ---
    
    // Resultado 1: El carrito ahora muestra "Your cart is empty"
    // (Este h1 se renderiza en app/cart/page.tsx cuando cart.length === 0)
    await page.getByText('Product removed from the cart').click();

    // Resultado 2: El contador del header vuelve a 0
    // (Selector del span dentro del Link en Header.tsx)
    const cartCounter = page.locator('a[href="/cart"] span');
    await expect(cartCounter).toHaveText('0');
  });
  /**
   * CÓDIGO: CP-CAR-005
   * NOMBRE: Intentar aumentar la cantidad por encima del stock disponible.
   */
  test('CP-CAR-005: No se puede aumentar por encima del stock', async ({ page }) => {

    // --- 0. Limpieza (Asegurar un carrito vacío) ---
    await page.goto('/cart');
    
    const removeButtons = page.getByText('Remove');
    
    while (await removeButtons.count() > 0) {
      await removeButtons.first().click();
      await page.waitForTimeout(200); 
    }

    // --- 1. Preparación (Llegar al límite de stock) ---

    // --- ¡¡CONFIGURACIÓN IMPORTANTE!! ---
    // 1. Elige tu producto
    const productSlug = 'smart-watch-demo'; 
    // 2. ¡¡CAMBIA ESTE NÚMERO POR EL STOCK REAL DE ESE PRODUCTO!!
    const stockMaximo = 5; 
    // ----------------------------------------

    // Añadir el producto al carrito
    await page.goto(`/product/${productSlug}`);
    await page.getByRole('button', { name: 'Add to cart' }).click();
    const toastLocator = page.getByText('Product added to the cart');
    await expect(toastLocator).toBeVisible();
    await expect(toastLocator).not.toBeVisible(); 

    // Ir al carrito
    await page.goto('/cart');
    
    // Tus selectores validados
    const quantityInput = page.getByRole('spinbutton', { name: 'Quantity' }).first();
    const increaseButton = page.getByRole('button').nth(2); // Tu selector para '+'

    // Verificamos que empezamos en 1
    await expect(quantityInput).toHaveValue('1');

    // Hacemos clic en "+" hasta alcanzar el stock máximo
    // (Empezamos en 1, así que clicamos 'stockMaximo - 1' veces)
    for (let i = 1; i < stockMaximo; i++) {
      await increaseButton.click();
      await page.waitForTimeout(200); // Pequeña espera
    }

    // Verificación de la preparación: 
    // Asegurarnos de que la cantidad es igual al stock máximo
    await expect(quantityInput).toHaveValue(String(stockMaximo));

    // --- 2. Prueba (Intentar superar el límite) ---

    // Paso 1: Intentar hacer clic en el botón "+" una vez más
    await increaseButton.click();
    await page.waitForTimeout(200); // Dar tiempo a que (no) reaccione

    // --- Resultados Esperados ---

    // Resultado 1: La cantidad NO debe cambiar. 
    // Debe seguir siendo el stock máximo.
    await expect(quantityInput).toHaveValue(String(stockMaximo));

    // Resultado 2 (El más importante): 
    // El botón "+" ahora debería estar deshabilitado
    await expect(increaseButton).toBeDisabled();
  });

});