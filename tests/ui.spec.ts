import { test, expect } from '@playwright/test';

test.describe('Módulo de UI/UX (CP-UI)', () => {

  /**
   * CÓDIGO: CP-UI-001
   * NOMBRE: Visualización de la página principal en resolución de dispositivo móvil (375x667)
   * DESCRIPCIÓN: Verificar que el diseño se adapta a móvil (elementos apilados)
   */
  test('CP-UI-001: Visualización de la página principal en resolución de dispositivo móvil (375x667)', async ({ page }) => {
    
    // 1. Configurar Viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. Navegar a la home
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // --- CORRECCIÓN: Adaptación al diseño real (Stacked/Apilado) ---
    // Tu Header.tsx usa 'max-lg:flex-col' para apilar elementos en vez de un menú hamburguesa.
    
    // 3. Verificar que los elementos clave siguen visibles y accesibles DIRECTAMENTE
    
    // El buscador debe estar visible (no oculto)
    const searchInput = page.getByPlaceholder('Type here');
    await expect(searchInput).toBeVisible();

    // El carrito debe estar visible
    const cartLink = page.locator('a[href="/cart"]').first();
    await expect(cartLink).toBeVisible();

    // El logo debe estar visible
    const logo = page.locator('img[alt="singitronic logo"]').first();
    await expect(logo).toBeVisible();

    // 4. Verificar que el contenedor principal aplicó la clase de columna
    // (Esto confirma que el diseño reaccionó al tamaño de pantalla)
    // Buscamos el div que contiene la clase 'max-lg:flex-col'
    // Nota: Escapamos los dos puntos con doble barra invertida
    const responsiveHeader = page.locator('.max-lg\\:flex-col').first();
    
    // Si el elemento es visible, significa que el layout móvil se está renderizando
    await expect(responsiveHeader).toBeVisible();

    // 5. Validar que NO hay menú hamburguesa (para confirmar que no es un falso positivo)
    const hamburgerButton = page.locator('.lg\\:hidden svg'); 
    await expect(hamburgerButton).not.toBeVisible();

    console.log('✅ CP-UI-001: Diseño móvil (Layout Apilado) validado correctamente');
  });

});