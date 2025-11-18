import { test, expect } from '@playwright/test';

test.describe('Módulo de UI/UX (CP-UI)', () => {

  /*
   * =================================================================
   * CP-UI-001 (Caso 54): VISTA RESPONSIVA MÓVIL
   * =================================================================
   */

  /**
   * CÓDIGO: CP-UI-001
   * NOMBRE: Visualización de la página principal en resolución de dispositivo móvil.
   * RESOLUCIÓN: 375x667 (iPhone 8)
   */
  test('CP-UI-001: Visualización de la página principal en resolución de dispositivo móvil (375x667)', async ({ page }) => {
    
    // --- FASE 1: SETUP (Configurar el viewport) ---
    await page.setViewportSize({ width: 375, height: 667 });

    // --- FASE 2: EJECUCIÓN (Navegar a la página) ---
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // --- FASE 3: VERIFICACIÓN ---

    // Verificación 1: El menú de navegación se colapsa en un "hamburguesa"
    
    const hamburgerButton = page.getByRole('button', { name: /menu/i }); 
    await expect(hamburgerButton).toBeVisible();


    const desktopNavLink = page.locator('header').getByRole('link', { name: 'Laptops', exact: true });
    await expect(desktopNavLink).not.toBeVisible();


    // Verificación 2: No hay desbordamiento horizontal
    
 
    // Ejecuta la comprobación de scroll directamente en el contexto de la página
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    
    // El ancho del viewport es 375
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });
});