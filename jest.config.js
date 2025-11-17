// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Proporciona la ruta a tu app Next.js
  dir: './',
});

// Añade cualquier configuración personalizada de Jest aquí
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',

  // Esto es para tus alias (como @/typings)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // --- ¡ESTA ES LA PARTE NUEVA QUE SOLUCIONA EL ERROR! ---
  // Le dice a Jest qué extensiones de archivo buscar
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // --- FIN DE LA PARTE NUEVA ---
};

module.exports = createJestConfig(customJestConfig);