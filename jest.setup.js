import '@testing-library/jest-dom';
const { act } = require('@testing-library/react');

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// --- Mock para next/navigation ---
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
  }),
  usePathname: () => '',
}));

// Mock global de nanoid para Jest
jest.mock('nanoid', () => ({
  nanoid: () => 'mock-id-123',
}));

// --- Mock global de matchMedia para react-slick ---
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// --- Configuración de stores (Zustand) ---
// NOTA: Asegúrate de que la ruta del store sea correcta
try {
  const { useProductStore } = require('./app/_zustand/store');
  const initialState = useProductStore.getState();

  beforeEach(() => {
    act(() => {
      useProductStore.setState(initialState, true);
    });
    sessionStorage.clear();
  });
} catch (error) {
  // Si el store no existe, ignorar silenciosamente
  console.warn('Store configuration skipped:', error.message);
}

// --- Limpieza después de cada test ---
afterEach(() => {
  sessionStorage.clear();
});

// --- Silenciar ciertos console.error durante los tests ---
const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
