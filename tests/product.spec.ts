import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
test.describe('Módulo de Búsqueda y Visualización (CP-PROD)', () => {

  // ---
  // Datos de Prueba
  // ---
  const searchTerm = 'Phone Gimbal'; // Término de búsqueda
  const expectedProduct = 'Phone gimbal'; // El texto del enlace

  test('CP-PROD-001: Búsqueda de un producto existente por su nombre', async ({ page }) => {
    
    // ---
    // FASE 1: EJECUCIÓN DEL TEST (Como cliente)
    // ---

    // 1. Ir a la página principal
    await page.goto('/');

    // 2. Localizar la barra de búsqueda y escribir el término
    const searchInput = page.getByPlaceholder('Type here');
    await searchInput.fill(searchTerm);

    // 3. Presionar "Enter" para enviar la búsqueda
    await searchInput.press('Enter');

    // ---
    // FASE 2: VERIFICACIÓN (Resultados Esperados)
    // ---
    
    // Verificación 1: La URL debe ser correcta
    await expect(page).toHaveURL(`/search?search=${searchTerm.replaceAll(' ', '%20')}`);
 
    //Verificación 2: 
    // Buscamos el texto. Esto nos da el <a> del texto
    // y excluye el <h3> del título y el <a> de la imagen (que usa alt text).
    await expect(page.getByText(expectedProduct, { exact: true })).toBeVisible();
  });

  test('CP-PROD-002: Búsqueda de un producto que no existe', async ({ page }) => {
    
    // Término de búsqueda sin sentido 
    const searchTermInvalid = 'asdfghjkl';
    
    // El mensaje que realmente muestra la app 
    const expectedMessage = `No products found for specified query`;

    // ---
    // FASE 1: EJECUCIÓN DEL TEST (Como cliente)
    // ---

    // 1. Ir a la página principal
    await page.goto('/');

    // 2. Llenar la búsqueda con el término inválido
    const searchInput = page.getByPlaceholder('Type here');
    await searchInput.fill(searchTermInvalid);

    // 3. Presionar Enter
    await searchInput.press('Enter');

    // ---
    // FASE 2: VERIFICACIÓN (Resultados Esperados)
    // ---
    
    // Verificación 1: La URL debe ser correcta
    await expect(page).toHaveURL(`/search?search=${searchTermInvalid}`);
    
    // Verificación 2: El mensaje de "No products found..." debe ser visible.
    // Usamos getByRole('heading') para ser específicos.
    await expect(page.getByRole('heading', { name: expectedMessage })).toBeVisible();
  });


// ---
  // CP-PROD-003 (Caso 24) 
  // ---
  test('CP-PROD-003: Acceder a la página de detalles de un producto', async ({ page }) => {

    // Datos de prueba (del producto sembrado)
    const productLinkText = 'Phone gimbal';
    const productSlug = 'phone-gimbal-demo';

    // El título en la página de detalles es "Phone Gimbal Demo"
    const productFullName = 'Phone gimbal';

    // ---
    // FASE 1: EJECUCIÓN DEL TEST (Como cliente)
    // ---

    // 1. Ir a la página principal
    await page.goto('/');

 
    // Esperar a que la página esté completamente cargada (JS hidratado)
    await page.waitForLoadState('networkidle');

    // 2. Localizar el enlace del producto (por su texto exacto) y hacer clic
    const linkToClick = page.getByText(productLinkText, { exact: true });

    // Esperar a que el enlace sea visible
    await linkToClick.waitFor({ state: 'visible' });

    // Hacer clic
    await linkToClick.click();

    // ---
    // FASE 2: VERIFICACIÓN (Resultados Esperados)
    // ---

    // Verificación 1: La URL debe ser la página de detalles del producto
    await expect(page).toHaveURL(`/product/${productSlug}`);

    // Verificación 2: El nombre completo del producto debe estar visible
    await expect(page.getByRole('heading', { name: productFullName })).toBeVisible();
  });

  // ---
  // CP-PROD-004 (Caso 25)
  // ---
  test('CP-PROD-004: Filtrar productos por categoría', async ({ page }) => {

    // Datos de prueba
    const categoryName = 'Laptops';
    const categorySlug = 'laptops';
    const expectedProduct = 'Notebook horizon';
    const productToDisappear = 'Phone gimbal';

    // ---
    // FASE 1: EJECUCIÓN DEL TEST
    // ---

    // 1. Ir a la página principal
    await page.goto('/');

    // 2. Esperar a que la página esté completamente cargada
    await page.waitForLoadState('networkidle');

    // 3. Localizar el enlace de la categoría (buscamos el H3 que está dentro del A)
    const laptopLink = page.getByRole('heading', { name: categoryName, exact: true });
    
    // 4. Esperar a que el enlace sea visible
    await laptopLink.waitFor({ state: 'visible' });

    // 5. Hacer clic en el enlace
    await laptopLink.click();

    // ---
    // FASE 2: VERIFICACIÓN
    // ---

    // 6. ¡ESPERAR A QUE LA NAVEGACIÓN TERMINE!
    // Esto soluciona el error de "timing".
    const expectedUrl = `/shop/${categorySlug}?outOfStock=true&inStock=true&rating=0&price=3000&sort=defaultSort&page=1`;
    await page.waitForURL(expectedUrl);
    
    // 7. Ahora que la página ha cargado, podemos verificar la URL
    await expect(page).toHaveURL(expectedUrl);

    // 8. El producto esperado ("MacBook Pro") SÍ debe ser visible
    await expect(page.getByText(expectedProduct, { exact: true })).toBeVisible();

    // 9. El producto de otra categoría NO debe ser visible
    await expect(page.getByText(productToDisappear, { exact: true })).not.toBeVisible();
  });

  // ---
  // CP-PROD-005 (Caso 26)
  // ---
  test.describe('Módulo de Búsqueda (Seguridad CP-PROD-005)', () => {
  const securityPayloads = [
    { name: 'XSS Attack', payload: "<script>alert('test')</script>" },
    { name: 'SQL Injection (OR)', payload: "'OR '1'='1'" },
    { name: 'SQL Injection (DROP)', payload: "; DROP TABLE products;--" }

  ];
  for (const item of securityPayloads) {
    test(`CP-PROD-005: Búsqueda con caracteres especiales (${item.name})`, async ({ page }) => {
      const expectedMessage = `No products found`;
      // ---
      // FASE 1: EJECUCIÓN
      // ---
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const searchInput = page.getByPlaceholder('Type here');
      await searchInput.fill(item.payload);
      await searchInput.press('Enter');
      // ---
      // FASE 2: VERIFICACIÓN
      // ---
      // Usamos una expresión regular para una verificación más flexible.
      // Solo nos importa que sea la página de búsqueda.
      await expect(page).toHaveURL(/search\?search=.*/);

      // Verificación 2: Esta es la prueba real de seguridad.
      // Si "No products found" es visible, el payload no se ejecutó.
      await expect(page.getByRole('heading', { name: expectedMessage })).toBeVisible();

    });
  }
  });

  test('Verificar la visibilidad del componente estático de reseñas', async ({ page }) => {
    
    // --- Datos de Prueba ---
    const productSlug = '/product/phone-gimbal-demo'; 

    // --- FASE 1: EJECUCIÓN (Navegar a la página) ---
    await page.goto(productSlug);
    await page.waitForLoadState('networkidle');

    // --- FASE 2: VERIFICACIÓN (Validar los elementos estáticos) ---

    // 1. Verificar que el texto "(3 reviews)" es visible
    const reviewText = page.getByText('(3 reviews)');
    await expect(reviewText).toBeVisible();

    // 2. Verificar que las 5 estrellas SVG son visibles
    const starIcons = page.locator('svg.text-custom-yellow');
    
    // Verificamos que hay exactamente 5 estrellas
    await expect(starIcons).toHaveCount(5);
  });


  /*
   * =================================================================
   * CP-PROD-008 (Caso 55): COMBINAR FILTROS (CATEGORÍA + PRECIO)
   * =================================================================
   */

  /**
   * CÓDIGO: CP-PROD-008
   * NOMBRE: Combinar filtros de categoría y rango de precio (Adaptado).
   */
  test('CP-PROD-008: Combinar filtros de categoría y rango de precio', async ({ page }) => {

    // --- Datos de Prueba ---
    const categoryName = 'Laptops';
    const categorySlug = 'laptops';
    const productToFilter = 'Notebook horizon'; // Cuesta $52
    const newMaxPrice = '30'; 

    // --- FASE 1: NAVEGACIÓN Y FILTRO DE CATEGORÍA ---
    
    // 1. Ir a la página principal
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2. Localizar y hacer clic en el enlace de la categoría
    const laptopLink = page.getByRole('heading', { name: categoryName, exact: true });
    await laptopLink.waitFor({ state: 'visible' });
    await laptopLink.click();

    // 3. Esperar a que la página de categoría cargue
    await page.waitForURL(new RegExp(categorySlug));
    await page.waitForLoadState('networkidle');

    // 4. Verificación 1: El producto ($52) SÍ debe ser visible
    await expect(page.getByText(productToFilter, { exact: true })).toBeVisible();

    // --- FASE 2: APLICAR FILTRO DE PRECIO ---

    // 5. Localizar el slider del rango de precios
    const priceSlider = page.locator('input[type="range"][max="3000"]');

    // 6. Mover el del slider para establecer el precio máximo en $30
    await priceSlider.fill(newMaxPrice);

    // 7. Esperar a que la UI reaccione
    await page.waitForTimeout(2000); 

    // --- FASE 3: VERIFICACIÓN ---
    
    // 8. Verificación 2: El producto ($52) debe desaparecer
    await expect(page.getByText(productToFilter, { exact: true })).not.toBeVisible();
  });


  /*
   * =================================================================
   * CP-USR-006: VER DESCRIPCIÓN DE PRODUCTO
   * =================================================================
   */

  /**
   * CÓDIGO: CP-USR-006 
   * NOMBRE: Verificar la visibilidad de la descripción de un producto.
   */
  test('CP-USR-006 : Verificar la visibilidad de la descripción de un producto', async ({ page }) => {

    // --- Datos de Prueba ---
    const productSlug = '/product/phone-gimbal-demo'; 

    // descripción del producto "Phone gimbal"
    const expectedDescription = 'This is phone gimbal description';

    // --- FASE 1: EJECUCIÓN (Navegar a la página) ---
    await page.goto(productSlug);
    await page.waitForLoadState('networkidle');

    // --- FASE 2: VERIFICACIÓN ---

    // 1. Verificar que el texto de la descripción es visible
    const descriptionText = page.getByText(expectedDescription, { exact: true });
    await expect(descriptionText).toBeVisible();
  });



  /*
   * =================================================================
   * CP-PROD-009 (Caso 58 - ADAPTADO): BÚSQUEDA INSENSIBLE A MAYÚSCULAS
   * =================================================================
   */

  /**
   * CÓDIGO: CP-PROD-009 
   * NOMBRE: Búsqueda insensible a mayúsculas/minúsculas.
   */
  test('CP-PROD-009 (Adaptado): Búsqueda insensible a mayúsculas/minúsculas', async ({ page }) => {

    // --- Datos de Prueba ---
    // Usamos el producto de tus otras pruebas
    const productName = 'Phone gimbal';
    const searchTerms = [
      'phone gimbal', // minúsculas
      'PHONE GIMBAL', // MAYÚSCULAS
      'PhOnE GiMbAl'  // Mezclado
    ];
    
    const searchInput = page.getByPlaceholder('Type here');

    // Usamos un bucle 'for' para ejecutar la misma lógica 3 veces
    for (const term of searchTerms) {
      
      // --- FASE 1: Búsqueda ---
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await searchInput.fill(term);
      await searchInput.press('Enter');

      // --- FASE 2: Verificación ---
      // Verificamos que la URL es correcta (codificando el término)
      await expect(page).toHaveURL(new RegExp(`/search\\?search=${encodeURIComponent(term).replace(' ', '%20')}`));
      
      // Verificamos que el producto "Phone gimbal" es visible
      await expect(page.getByText(productName, { exact: true })).toBeVisible();
    }
  });

});

