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