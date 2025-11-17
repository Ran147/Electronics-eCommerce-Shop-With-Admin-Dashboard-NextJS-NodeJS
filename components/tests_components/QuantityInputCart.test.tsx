// components/QuantityInputCart.test.tsx
import { jest, beforeEach, describe, test, expect } from '@jest/globals';

// (Recuerda: sin imports de Playwright o Node)
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Importa el componente que vamos a probar
import QuantityInputCart from '../QuantityInputCart'; 
// Importa el store para que podamos "mockearlo" (simularlo)
import { useProductStore } from '../../app/_zustand/store';
// Importamos el tipo para crear un mock correcto
import type { ProductInCart } from '../../app/_zustand/store';

// --- Configuración del Mock de Zustand ---
jest.mock('../../app/_zustand/store');

const mockUpdateCartAmount = jest.fn();

const mockProduct: ProductInCart = {
  id: '123-abc',
  title: 'Smart Watch Demo',
  price: 100,
  image: 'image.jpg',
  amount: 2, 
};

beforeEach(() => {
  mockUpdateCartAmount.mockClear(); 
  (useProductStore as unknown as jest.Mock).mockReturnValue({
    updateCartAmount: mockUpdateCartAmount,
    calculateTotals: jest.fn(), 
  });
});
// --- Fin de la Configuración del Mock ---


describe('Componente: QuantityInputCart', () => {

  /**
   * CASO DE PRUEBA: CP-CAR-008 (Test #18)
   * REPRESENTA A: Lógica de validación de 'CP-CAR-008: Cantidad inválida'
   * HERRAMIENTA: Jest + React Testing Library
   */
  test('CP-CAR-008: No debe llamar a updateCartAmount con texto ("abc")', () => {
    
    // 1. Renderizar el componente
    render(<QuantityInputCart product={mockProduct} />);

    // 2. Encontrar el input (tu selector de Playwright era 'spinbutton')
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    // 3. Acción: Simular escribir "abc" en el input
    fireEvent.change(input, { target: { value: 'abc' } });

    // 4. Resultado: La función del store 'updateCartAmount'
    // NUNCA debe ser llamada, porque "abc" es inválido.
    // Si NO se llama, la prueba PASA.
    expect(mockUpdateCartAmount).not.toHaveBeenCalled();
  });

  test('CP-CAR-008: No debe llamar a updateCartAmount con 0 o negativos', () => {
    
    render(<QuantityInputCart product={mockProduct} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    // 3. Acción: Simular escribir "0"
    fireEvent.change(input, { target: { value: '0' } });

    // 4. Resultado: La función del store NO debe ser llamada
    expect(mockUpdateCartAmount).not.toHaveBeenCalled();

    // 5. Acción: Simular escribir "-5"
    fireEvent.change(input, { target: { value: '-5' } });

    // 6. Resultado: La función del store TAMPOCO debe ser llamada
    expect(mockUpdateCartAmount).not.toHaveBeenCalled();
  });
});