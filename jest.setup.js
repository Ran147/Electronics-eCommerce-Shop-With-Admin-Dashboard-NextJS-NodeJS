<<<<<<< HEAD
// jest.setup.js
require('@testing-library/jest-dom');
const { act } = require('@testing-library/react');

// CORRECCIÓN 1: Importar 'useProductStore'
const { useProductStore } = require('./app/_zustand/store'); 

const initialState = useProductStore.getState();

beforeEach(() => {
  act(() => {
    // CORRECCIÓN 2: Usar 'useProductStore'
    useProductStore.setState(initialState, true);
  });
  // CORRECCIÓN 3: Limpiar 'sessionStorage' (como dice tu store.ts)
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
});
=======
import '@testing-library/jest-dom';

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
>>>>>>> LuisBranch
