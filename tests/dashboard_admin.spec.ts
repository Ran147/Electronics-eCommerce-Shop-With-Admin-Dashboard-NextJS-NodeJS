// tests/security.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Módulo de Seguridad y Control de Acceso', () => {
    /*
        /**
         * CÓDIGO: CP-USR-004
         * NOMBRE: Intentar acceder a la página de perfil sin iniciar sesión
         * DESCRIPCIÓN: Verificar que un usuario no autenticado es redirigido a la página de
         * inicio de sesión si intenta acceder a la URL del perfil directamente
         /** */

    test('CP-USR-004: Acceso a perfil sin autenticación', async ({ page }) => {

        ;

        // --- PASOS ---

        // Paso 1: Escribir manualmente la URL de la página de perfil en el navegador
        await page.goto('/profile');

        // --- RESULTADOS ESPERADOS (ÉXITO) ---

        // Resultado 1: El sistema redirige automáticamente al usuario a la página de login
        await expect(page).toHaveURL('/login');

        // Resultado 2: La página de login muestra el formulario de autenticación
        await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'SIGN IN' })).toBeVisible();

    });

   /**
     * CÓDIGO: CP-ADM-001
     * NOMBRE: Creación exitosa de un nuevo producto
     */
    test('CP-ADM-001: Creación exitosa de nuevo producto', async ({ page }) => {

        // --- PRECONDICIONES ---
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('realmadrid@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        
        // Esperar a que cargue la página de admin
        await page.waitForURL('/admin');

        // --- CORRECCIÓN AQUÍ ---
        // Verificamos que cargó el contenido buscando un texto único del dashboard
        await expect(page.getByText('Number of visitors today')).toBeVisible();

        // --- NAVEGACIÓN ---
        // Navegar directamente es más rápido y estable
        await page.goto('/admin/products/new');

        // --- PASOS PARA CREAR EL PRODUCTO ---
        // Generamos datos aleatorios para evitar error de "Slug duplicado" en ejecuciones repetidas
        const randomId = Math.floor(Math.random() * 10000);
        
        await page.locator('label:has-text("Product name:") input').fill(`Teclado Gamer ${randomId}`);
        
        // Seleccionar categoría por índice (la segunda opción) para no depender de IDs fijos
        await page.locator('label:has-text("Category:") select').selectOption({ index: 1 }); 

        await page.locator('label:has-text("Product slug:") input').fill(`teclado-gamer-${randomId}`);
        await page.locator('label:has-text("Product price:") input').fill('75.50');
        await page.locator('label:has-text("Manufacturer:") input').fill('Razer');
        await page.locator('label:has-text("Is product in stock?") select').selectOption({ value: '1' });
        await page.locator('label:has-text("Product description:") textarea').fill('Descripción de prueba generada automáticamente.');

        // --- PASO FINAL ---
        await page.getByRole('button', { name: 'Add product' }).click();

        // --- RESULTADOS ESPERADOS ---
        // Esperamos el mensaje de éxito (aumentamos timeout por si Docker va lento)
        await expect(page.locator('div[role="status"]')).toContainText('Product added successfully', { timeout: 15000 });

        console.log('✅ CP-ADM-001: Producto creado exitosamente');
    });



    /**
      * CÓDIGO: CP-ADM-005
      * NOMBRE: Eliminar un usuario desde el panel de administración
      * DESCRIPCIÓN: Verificar que un administrador puede eliminar la cuenta de un usuario
      * y que, tras la eliminación, el usuario ya no puede iniciar sesión
     /** */
   test('CP-ADM-005: Eliminar usuario desde panel de administración', async ({ page }) => {
        // --- LOGIN ---
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('realmadrid@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await page.waitForURL('/admin');
        await expect(page.getByText('Number of visitors today')).toBeVisible();

        // --- CREAR USUARIO ---
        await page.goto('/admin/users/new');
        
        const tempEmail = `borrar_${Date.now()}@test.com`;

        // CORRECCIÓN: Selectores basados en tu código fuente (admin/users/new/page.tsx)
        // Buscamos el input que está dentro del label que contiene el texto "Email:"
        await page.locator('label:has-text("Email:") input').fill(tempEmail);
        
        // Tu formulario de creación NO tiene campos de Name/Lastname según el archivo subido.
        // Solo tiene Email, Password y Role. Eliminamos los fills de Name/Lastname.
        await page.locator('label:has-text("Password:") input').fill('12345678');
        
        // El rol por defecto es user, así que no hace falta cambiarlo, pero por seguridad:
        await page.locator('select').selectOption('user');

        // Click en botón "Create user"
        await page.getByRole('button', { name: /Create user/i }).click();
        
        // Esperar confirmación
        await expect(page.getByText('User added successfully')).toBeVisible();
        
        // --- BORRAR USUARIO ---
        await page.goto('/admin/users');
        
        // Buscar la fila con el email creado
        const userRow = page.locator('tr').filter({ hasText: tempEmail });
        await expect(userRow).toBeVisible({ timeout: 10000 });
        
        // Click en el botón "details"
        await userRow.getByRole('link', { name: 'details' }).click();
        
        // Esperar a que cargue la página de detalle (verificando que el email aparezca en el input)
        await expect(page.locator('label:has-text("Email:") input')).toHaveValue(tempEmail, { timeout: 10000 });

        // Borrar
        page.on('dialog', async (dialog) => await dialog.accept());
        await page.getByRole('button', { name: /Delete user/i }).click();

        await expect(page.locator('div[role="status"]')).toContainText('User deleted successfully');
        console.log('✅ CP-ADM-005: Usuario creado y eliminado correctamente');
    });



    /**
 * CÓDIGO: CP-ADM-006
 * NOMBRE: Actualizar contraseña de usuario desde el panel de administración
 * DESCRIPCIÓN: Verificar que un administrador puede actualizar la contraseña de un usuario
  /** */
    test('CP-ADM-006: Actualizar contraseña de usuario', async ({ page }) => {
        // --- LOGIN ---
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('realmadrid@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await page.waitForURL('/admin');

        // --- NAVEGACIÓN ---
        await page.goto('/admin/users');
        
        // Click en el primer botón "details" de la tabla (evitamos headers)
        // El primer "details" está en el primer `tr` del `tbody`
        await page.locator('tbody tr a.btn-ghost').first().click();
        
        // --- ESPERA CRÍTICA ---
        // Esperar a que el input de email tenga algún valor (significa que el fetch terminó)
        const emailInput = page.locator('label:has-text("Email:") input');
        await expect(emailInput).toBeVisible();
        // Esperamos a que no esté vacío para asegurar que los datos cargaron
        await expect(emailInput).not.toHaveValue('');

        // --- ACTUALIZAR PASSWORD ---
        // Selector basado en tu código: label con texto "New password:"
        await page.locator('label:has-text("New password:") input').fill('Santi1240+');

        // Click en "Update user"
        await page.getByRole('button', { name: /Update user/i }).click();

        await expect(page.locator('div[role="status"]')).toContainText('User successfully updated');
        console.log('✅ CP-ADM-006: Password actualizado');
    });
    /**
 * CÓDIGO: CP-ADM-007
 * NOMBRE: Actualizar rol de usuario desde el panel de administración
 * DESCRIPCIÓN: Verificar que un administrador puede actualizar el rol de un usuario de "user" a "admin"
  /** */
    test('CP-ADM-007: Actualizar rol de usuario a administrador', async ({ page }) => {
        // --- LOGIN ---
        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Email address' }).fill('realmadrid@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('Santi1240+');
        await page.getByRole('button', { name: 'SIGN IN' }).click();
        await page.waitForURL('/admin');

        // --- NAVEGACIÓN ---
        await page.goto('/admin/users');
        
        // Click en el primer "details"
        await page.locator('tbody tr a.btn-ghost').first().click();

        // Esperar carga de datos
        const emailInput = page.locator('label:has-text("Email:") input');
        await expect(emailInput).not.toHaveValue('', { timeout: 10000 });

        // --- CAMBIAR ROL ---
        // Tu código valida que el password > 7 caracteres para actualizar CUALQUIER COSA.
        // Así que OBLIGATORIAMENTE debemos llenar el password también.
        await page.locator('label:has-text("New password:") input').fill('Santi1240+');

        // Cambiar select de rol
        const roleSelect = page.locator('label:has-text("User role:") select');
        // Obtenemos el valor actual para cambiarlo al opuesto (para que el test siempre haga un cambio)
        const currentRole = await roleSelect.inputValue();
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        
        await roleSelect.selectOption(newRole);

        // Guardar
        await page.getByRole('button', { name: /Update user/i }).click();

        await expect(page.locator('div[role="status"]')).toContainText('User successfully updated');
        console.log(`✅ CP-ADM-007: Rol cambiado a ${newRole}`);
    });

});

