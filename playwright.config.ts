import { defineConfig, devices } from '@playwright/test';

// --- CAMBIO 1: Definimos la URL base dinámicamente ---
// Si Docker nos pasa la variable (http://frontend:3000), usamos esa.
// Si no (tu PC local), usamos http://localhost:3000.
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  testIgnore: '**/*.api.spec.ts',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: baseURL, // --- CAMBIO 2: Usamos la variable aquí ---

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    // Asegúrate de que este sea el comando para iniciar tu frontend de Next.js
    command: 'npm run dev',
    url: baseURL, // --- CAMBIO 3: Usamos la variable para que busque en el lugar correcto ---
    reuseExistingServer: true, // --- CAMBIO 4: Forzamos a true para que detecte que el frontend ya está corriendo ---
    timeout: 120 * 1000, // --- CAMBIO 5: Damos 2 minutos de margen por si acaso ---
  },
});
