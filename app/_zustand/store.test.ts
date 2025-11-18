// app/_zustand/store.test.ts
import { act } from '@testing-library/react';

// CORRECCIÓN 1: Importar el store correcto
import { useProductStore } from './store'; 
// Importamos el tipo para crear un mock correcto
import type { ProductInCart } from './store';

// CORRECCIÓN 2: El mock debe coincidir 100% con tu tipo 'ProductInCart'
const mockProduct: ProductInCart = {
  id: '123-abc',
  title: 'Smart Watch Demo',
  price: 100,
  image: 'image.jpg',
  amount: 1, // Tu tipo usa 'amount'
};

// 'describe', 'test', y 'expect' son globales en Jest, no necesitas importarlos.
describe('Store de Zustand (Lógica del Carrito)', () => {

  /**
   * CASO DE PRUEBA: CP-CAR-006 (Test #16)
   * REPRESENTA A: Lógica de persistencia del CP-CAR-006 (Test #16)
   * HERRAMIENTA: Jest
   */
  test('CP-CAR-006: La acción "addToCart" debe persistir el estado', () => {
    
    // CORRECCIÓN 3: Revisar 'sessionStorage' y la llave 'products-storage'
    expect(sessionStorage.getItem('products-storage')).toBeNull();

    // 2. Acción: Llama a la acción 'addToCart'
    act(() => {
      // CORRECCIÓN 4: 'addToCart' espera el objeto ProductInCart directamente
      useProductStore.getState().addToCart(mockProduct);
    });

    // 3. Resultado Esperado:
    const storageData = JSON.parse(sessionStorage.getItem('products-storage') || '{}');

    // CORRECCIÓN 5: El estado se llama 'products', no 'cart'
    expect(storageData).toBeDefined();
    expect(storageData.state.products.length).toBe(1);
    expect(storageData.state.products[0].title).toBe('Smart Watch Demo');

    // CORRECCIÓN 6: El campo se llama 'amount', no 'quantity'
    expect(storageData.state.products[0].amount).toBe(1);
  });
  
  /**
   * CASO DE PRUEBA: CP-CAR-007 (Test #17)
   * REPRESENTA A: Lógica interna de 'CP-CAR-007: Modificar cantidad'
   * HERRAMIENTA: Jest
   */
  test('CP-CAR-007: Debe actualizar la cantidad de un producto (acción updateCartAmount)', () => {
    
    // 1. Precondición: Añadir un producto al carrito
    act(() => {
      // (Usamos el mockProduct de arriba, asegurándonos que la cantidad inicial es 1)
      useProductStore.getState().addToCart({ ...mockProduct, amount: 1 });
    });

    // 2. Verificación de Precondición: El 'amount' debe ser 1
    let state = useProductStore.getState();
    expect(state.products.length).toBe(1);
    expect(state.products[0].amount).toBe(1);

    // 3. Acción: Llamar a 'updateCartAmount' para cambiar la cantidad a '5'
    act(() => {
      useProductStore.getState().updateCartAmount('123-abc', 5);
    });

    // 4. Resultado Esperado: El 'amount' del producto ahora debe ser 5
    state = useProductStore.getState();
    expect(state.products.length).toBe(1); // Seguimos teniendo un solo producto
    expect(state.products[0].amount).toBe(5); // La cantidad se actualizó
  });
});