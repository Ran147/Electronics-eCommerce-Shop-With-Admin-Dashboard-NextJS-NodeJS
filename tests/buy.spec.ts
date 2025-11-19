// tests/buy.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Módulo de Compras - Flujo de Checkout', () => {

    /*
     * CÓDIGO: CP-CHK-003
     * NOMBRE: Regresar de la página de Pago a la de Información de Envío
     * DESCRIPCIÓN: Verificar que el usuario puede retroceder del estado "Payment"
     * al estado "Shipping Info" para modificar su dirección
     /** */
    test('CP-CHK-003: Regresar de Payment a Shipping Info', async ({ page }) => {

        // --- PRECONDICIONES ---
        // 1. El usuario debe estar autenticado
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('luis@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');

        // CORRECCIÓN: Usar el botón correcto del login
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        // O alternativamente, si no funciona por nombre:
        // await page.click('button[type="submit"]');
        // await page.click('text=SIGN IN');

        // Esperar a que el login sea exitoso - redireccione a home
        await page.waitForURL('/');

        // 2. El carrito debe tener al menos un producto
        await page.goto('/product/smart-watch-demo');

        // Esperar a que la página del producto cargue
        await page.waitForLoadState('networkidle');

        // Agregar producto al carrito - usar selector más específico
        await page.getByRole('button', { name: 'Add to cart' }).first().click();

        // Esperar breve momento para que se agregue al carrito
        await page.waitForTimeout(1000);

        // 3. Navegar al carrito
        await page.goto('/cart');

        // Verificar que estamos en el carrito y hay productos
        await expect(page).toHaveURL('/cart');

        // CORRECCIÓN: El botón Checkout es un enlace <a> no un botón
        await page.locator('a[href="/checkout"]').click();

        // --- VERIFICACIÓN QUE ESTAMOS EN CHECKOUT ---
        await expect(page).toHaveURL('/checkout');

        // --- PASO PRINCIPAL: Hacer clic en el botón del carrito para regresar ---
        // Usando el selector específico del HTML que proporcionaste
        await page.locator('div.relative a[href="/cart"]').click();

        // --- RESULTADOS ESPERADOS (ÉXITO) ---

        // Resultado 1: El sistema regresa a la página de cart
        // --- RESULTADOS ESPERADOS (ÉXITO) ---

        // Resultado 1: El sistema regresa a la página de cart
        await expect(page).toHaveURL('/cart');

        // Validación adicional: Verificar que el carrito todavía muestra "1" producto
        await expect(page.locator('div.relative span.bg-blue-600').filter({ hasText: '1' })).toBeVisible();

        // Y que el producto sigue estando en el carrito
        await expect(page.getByText('Smart watch')).toBeVisible();
    });

    /**
    * CÓDIGO: CP-CHK-004
    * NOMBRE: Intento de acceder a la página de pago sin pasar por la de envío
    * DESCRIPCIÓN: Comprobar que el sistema muestra error al intentar pagar 
    * sin completar los campos de información de envío
      /** */
    test('CP-CHK-004: Error al pagar sin completar campos de envío', async ({ page }) => {

        // --- PRECONDICIONES ---
        // 1. El usuario debe estar autenticado
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('luis@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        // Espera a que el login se complete (ajusta según tu app)
        await page.waitForURL(/\/$/, { timeout: 10000 });
        // Mejor aún: espera por un elemento que solo aparece cuando estás logueado
        await page.waitForSelector('a[href="/cart"]', { state: 'visible', timeout: 10000 });

        // 2. El carrito debe tener al menos un producto
        await page.goto('/product/smart-watch-demo');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add to cart' }).first().click();
        await page.waitForTimeout(1000);

        // 3. Navegar directamente al checkout (sin pasar por shipping)
        await page.goto('/checkout');

        // --- VERIFICACIÓN QUE ESTAMOS EN CHECKOUT ---
        await expect(page).toHaveURL('/checkout');

        // --- PASOS DE PRUEBA ---


        // Paso 2: Hacer clic en el botón "Pay Now" sin llenar los campos
        await page.getByRole('button', { name: 'Pay Now' }).click();

        // --- RESULTADOS ESPERADOS (ÉXITO) ---

        // Resultado 1: El sistema NO procesa el pago (permanece en checkout)
        await expect(page).toHaveURL('/checkout');

        // Resultado 2: Se muestra el mensaje de error específico
        await expect(page.locator('div[role="status"]').filter({
            hasText: 'You need to enter values in the input fields'
        })).toBeVisible();


    });


    test('CP-CHK-005: Completar orden de compra exitosa', async ({ page }) => {

        // --- PRECONDICIONES ---
        // 1. El usuario debe estar autenticado
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('luis@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await page.waitForURL('/');

        // 2. El carrito debe tener al menos un producto
        await page.goto('/product/smart-watch-demo');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add to cart' }).first().click();
        await page.waitForTimeout(1000);

        // 3. Navegar al checkout
        await page.goto('/checkout');
        await expect(page).toHaveURL('/checkout');

        // --- COMPLETAR INFORMACIÓN DE ENVÍO ---
        // Usando los selectores exactos del HTML

        // Información de contacto/email
        await page.locator('input#email-address').fill('luis@gmail.com');

        // Información de dirección
        await page.locator('input#address').fill('Calle Principal 123');
        await page.locator('input#apartment').fill('Apto 4B');
        await page.locator('input#city').fill('Ciudad Ejemplo');
        await page.locator('input#company').fill('Mi Empresa SA');
        await page.locator('input#region').fill("XD")
        await page.locator('input#postal-code').fill("XD")


        // Nota del pedido (textarea)
        await page.locator('textarea#order-notice').fill('Por favor entregar antes de las 5pm');

        // --- COMPLETAR INFORMACIÓN DE PAGO ---
        // Usando los selectores específicos del HTML

        // Campo: Nombre en la tarjeta
        await page.locator('input#name-on-card').fill('Real Madrid');

        // Campo: Número de tarjeta
        await page.locator('input#card-number').fill('4111111111111111');

        // Campo: Fecha de expiración
        await page.locator('input#expiration-date').fill('12/25');

        // Campo: CVC
        await page.locator('input#cvc').fill('123');

        // --- PASO PRINCIPAL: Hacer clic en "Pay Now" ---
        await page.getByRole('button', { name: 'Pay Now' }).click();

        // --- RESULTADOS ESPERADOS (ÉXITO) ---


        await page.goto('/cart');

        // Resultado 4: VERIFICAR QUE ORDER TOTAL ES $0 (stock eliminado)
        await expect(page.locator('div.flex.items-center.justify-between.border-t.border-gray-200.pt-4')
            .filter({ has: page.locator('dt:has-text("Order total")') })
            .locator('dd')
        ).toHaveText('$0');
    });

    test.describe('Módulo de Compras - Flujo de Checkout', () => {

        // ... (código anterior de CP-CHK-003, CP-CHK-004, CP-CHK-005)

        /**
         * CÓDIGO: CP-CHK-006
         * NOMBRE: Intentar continuar a pago con campos de envío vacíos
         * DESCRIPCIÓN: Verificar que el sistema muestra errores de validación si el usuario
         * intenta continuar al pago sin rellenar los campos obligatorios de la dirección
        /** */
        test('CP-CHK-006: Validación de campos vacíos en formulario de envío', async ({ page }) => {

            // --- PRECONDICIONES ---
            // 1. El usuario debe estar autenticado
            await page.goto('/login');
            await page.getByRole('textbox', { name: 'Email address' }).fill('luis@gmail.com');
            await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
            await page.getByRole('button', { name: 'SIGN IN' }).click();
            await page.waitForURL('/');

            // 2. El carrito debe tener al menos un producto
            await page.goto('/product/smart-watch-demo');
            await page.waitForLoadState('networkidle');
            await page.getByRole('button', { name: 'Add to cart' }).first().click();
            await page.waitForTimeout(1000);

            // 3. Navegar al checkout (que incluye el formulario de envío)
            await page.goto('/checkout');
            await expect(page).toHaveURL('/checkout');

            // --- PASOS DE PRUEBA ---

            // Paso 1: Dejar TODOS los campos de envío vacíos (no llenar nada)
            // Los campos permanecen vacíos por defecto

            // Paso 2: Hacer clic en el botón "Pay Now" sin llenar los campos obligatorios
            await page.getByRole('button', { name: 'Pay Now' }).click();

            // --- RESULTADOS ESPERADOS (ÉXITO) ---

            // Resultado 1: El sistema NO procesa el pago (permanece en checkout)
            await expect(page).toHaveURL('/checkout');

            // Resultado 2: Se muestra el mensaje de error específico
            await expect(page.locator('div[role="status"]').filter({
                hasText: 'You need to enter values in the input fields'
            })).toBeVisible();

            // Validación adicional: Los campos siguen vacíos y visibles
            await expect(page.locator('input#email-address')).toBeEmpty();
            await expect(page.locator('input#address')).toBeEmpty();
            await expect(page.locator('input#city')).toBeEmpty();
            await expect(page.locator('input#region')).toBeEmpty();
            await expect(page.locator('input#postal-code')).toBeEmpty();
        });
    })

    /**
        * CÓDIGO: CP-CHK-007
        * NOMBRE: Validación de número de tarjeta con menos de 14 dígitos
        * DESCRIPCIÓN: Verificar que el sistema rechaza el pago cuando el número de tarjeta 
        * tiene solo 10 dígitos (menos del mínimo requerido)
       /** */
    test('CP-CHK-007: Rechazar pago con número de tarjeta de 10 dígitos', async ({ page }) => {

        // --- PRECONDICIONES ---
        // 1. El usuario debe estar autenticado
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('luis@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await page.waitForURL('/');

        // 2. El carrito debe tener al menos un producto
        await page.goto('/product/smart-watch-demo');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add to cart' }).first().click();
        await page.waitForTimeout(1000);

        // 3. Navegar al checkout
        await page.goto('/checkout');
        await expect(page).toHaveURL('/checkout');

        // --- COMPLETAR INFORMACIÓN DE ENVÍO ---
        // Llenar todos los campos de envío correctamente
        await page.locator('input#email-address').fill('luis@gmail.com');
        await page.locator('input#address').fill('Calle Principal 123');
        await page.locator('input#apartment').fill('Apto 4B');
        await page.locator('input#city').fill('Ciudad Ejemplo');
        await page.locator('input#company').fill('Mi Empresa SA');
        await page.locator('input#region').fill('XD');
        await page.locator('input#postal-code').fill('XD');
        await page.locator('textarea#order-notice').fill('Por favor entregar antes de las 5pm');

        // --- COMPLETAR INFORMACIÓN DE PAGO CON TARJETA INVÁLIDA ---
        // Campos correctos excepto el número de tarjeta

        // Campo: Nombre en la tarjeta (válido)
        await page.locator('input#name-on-card').fill('Real Madrid');

        // Campo: Número de tarjeta INVÁLIDO - solo 10 dígitos
        await page.locator('input#card-number').fill('41111'); // Solo 5 digitos

        // Campo: Fecha de expiración (válida)
        await page.locator('input#expiration-date').fill('12/25');

        // Campo: CVC (válido)
        await page.locator('input#cvc').fill('123');
        await page.locator('input#lastname-input').fill('Madrid');
        await page.locator('input#name-input').fill('Real');
        await page.locator('input#phone-input').fill('12345678');



        // --- PASO PRINCIPAL: Hacer clic en "Pay Now" ---
        await page.getByRole('button', { name: 'Pay Now' }).click();

        // --- RESULTADOS ESPERADOS (ÉXITO = RECHAZO CORRECTO) ---

        await page.waitForTimeout(1000);

        // Resultado 2: Se muestra mensaje de error ESPECÍFICO para tarjeta inválida
        await expect(page.locator('div[role="status"]').filter({
            hasText: 'You entered invalid format for credit card number'
        })).toBeVisible();

        // Validación adicional: El carrito NO se vació

    });


    /**
     * CÓDIGO: CP-CHK-008
     * NOMBRE: Validación de pago con fecha de expiración inválida
     * DESCRIPCIÓN: Verificar que el sistema rechaza el pago cuando falta el nombre en la tarjeta
      /** */
    test('CP-CHK-008: Rechazar pago con fecha de expiración de tarjeta inválida', async ({ page }) => {

        // --- PRECONDICIONES ---
        // 1. El usuario debe estar autenticado
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('luis@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await page.waitForURL('/');

        // 2. El carrito debe tener al menos un producto
        await page.goto('/product/smart-watch-demo');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add to cart' }).first().click();
        await page.waitForTimeout(1000);

        // 3. Navegar al checkout
        await page.goto('/checkout');
        await expect(page).toHaveURL('/checkout');

        // --- COMPLETAR INFORMACIÓN DE ENVÍO ---
        // Llenar todos los campos de envío correctamente
        await page.locator('input#name-input').fill('Luis');
        await page.locator('input#lastname-input').fill('fsfs');
        await page.locator('input#phone-input').fill('12341234');

        await page.locator('input#email-address').fill('luis@gmail.com');
        await page.locator('input#address').fill('Calle Principal 123');
        await page.locator('input#apartment').fill('Apto 4B');
        await page.locator('input#city').fill('Ciudad Ejemplo');
        await page.locator('input#company').fill('Mi Empresa SA');
        await page.locator('input#region').fill('XD');
        await page.locator('input#postal-code').fill('XD');
        await page.locator('textarea#order-notice').fill('Por favor entregar antes de las 5pm');

        // --- COMPLETAR INFORMACIÓN DE PAGO SIN NOMBRE ---
        // Todos los campos correctos excepto el nombre en la tarjeta (se deja vacío)

        // Campo: Nombre en la tarjeta - DEJAR VACÍO (campo obligatorio faltante)
        await page.locator('input#name-on-card').fill('xdf wrfg w'); // Vacío

        // Campo: Número de tarjeta (válido)
        await page.locator('input#card-number').fill('12431243231234');

        // Campo: Fecha de expiración (válida)
        await page.locator('input#expiration-date').fill('24112343');

        // Campo: CVC (válido)
        await page.locator('input#cvc').fill('444');

        // --- PASO PRINCIPAL: Hacer clic en "Pay Now" ---
        await page.getByRole('button', { name: 'Pay Now' }).click();

        // --- RESULTADOS ESPERADOS (ÉXITO = RECHAZO CORRECTO) ---

        // Resultado : Se muestra mensaje de error
        // Podría ser el error genérico o uno específico para nombre faltante
        await expect(page.locator('div[role="status"]').filter({
            hasText: 'You entered invalid format for credit card expiration date'
        })).toBeVisible();

    });

    /**
    * CÓDIGO: CP-CAR-010
    * NOMBRE: Eliminar producto individual del carrito de compras
    * DESCRIPCIÓN: Verificar que un usuario puede eliminar un producto específico
    * de su carrito de compras utilizando el botón de eliminar
     */
    test('CP-CAR-010: Eliminar producto individual del carrito', async ({ page }) => {


        // --- PRECONDICIONES ---
        // 1. El usuario debe estar autenticado
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('luis@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await page.waitForURL('/');

        // 1. El usuario debe tener al menos un producto en el carrito
        // Navegar directamente al producto wireless-headphones-demo
        await page.goto('/product/wireless-headphones-demo');

        // Verificar que estamos en la página correcta del producto
        await expect(page).toHaveURL('/product/wireless-headphones-demo');

        // Agregar el producto al carrito
        const addToCartButton = page.locator('button.btn.w-\\[200px\\].text-lg.border.border-gray-300.border-1.font-normal.bg-white.text-blue-500')
            .filter({ hasText: 'Add to cart' });

        await expect(addToCartButton).toBeVisible();
        await addToCartButton.click();

        // Esperar a que se agregue al carrito y verificar el contador
        await page.waitForTimeout(1000);

        // Verificar que el contador del carrito se actualiza a 1
        await expect(page.locator('div.relative span.bg-blue-600').filter({ hasText: '1' })).toBeVisible();

        // 2. Navegar a la página del carrito
        await page.goto('/cart');
        await expect(page).toHaveURL('/cart');

        // Verificar que el producto está en el carrito
        await expect(page.getByText('wireless headphones', { exact: false })).toBeVisible();

        // --- PASOS ---

        // Paso 1: Localizar y hacer clic en el botón de eliminar producto
        // Buscar el botón de remove específico para el producto
        const removeButton = page.locator('button.-m-2.inline-flex.p-2.text-gray-400.hover\\:text-gray-500')
            .filter({
                has: page.locator('svg').filter({
                    has: page.locator('path[d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"]')
                })
            });

        await expect(removeButton).toBeVisible();
        await removeButton.click();

        // --- RESULTADOS ESPERADOS (ÉXITO) ---

        // Resultado 1: Se muestra el mensaje de confirmación específico
        await expect(page.locator('div[role="status"]').filter({
            hasText: 'Product removed from the cart'
        })).toBeVisible({ timeout: 1000 });

        console.log('✅ CP-CAR-010: Mensaje "Product removed from the cart" mostrado correctamente');

        // Resultado 2: El producto desaparece de la lista del carrito
        await expect(page.getByText('wireless headphones', { exact: false })).not.toBeVisible({ timeout: 3000 });



        // Resultado 5: El contador de ítems en la barra de navegación se actualiza a 0
        await expect(page.locator('div.relative span.bg-blue-600').filter({ hasText: '0' })).toBeVisible({ timeout: 3000 });



        // Capturar evidencia del proceso exitoso
        await test.step('Reporte de eliminación de producto CP-CAR-010', async () => {
            const removalMessage = await page.locator('div[role="status"]').filter({
                hasText: 'Product removed from the cart'
            }).isVisible().catch(() => false);

            const productRemoved = await page.getByText('wireless headphones', { exact: false }).isVisible().then(visible => !visible).catch(() => false);

            const cartEmpty = await page.locator('div.relative span.bg-blue-600').filter({ hasText: '0' }).isVisible().catch(() => false);


            console.log(`📄 REPORTE DE CARRITO CP-CAR-010:`);
            console.log(`   ✅ Mensaje de eliminación: ${removalMessage}`);
            console.log(`   ✅ Producto removido: ${productRemoved}`);
            console.log(`   ✅ Carrito en 0: ${cartEmpty}`);
            console.log(`   🌐 URL final: ${page.url()}`);


        });
    });



});

