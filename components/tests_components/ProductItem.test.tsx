// components/ProductItem.test.tsx

import { render, screen } in '@testing-library/react';
import '@testing-library/jest-dom'; 
// Ajusta la ruta para importar TU componente
import ProductItem from '../ProductItem'; 

// Describimos el conjunto de pruebas
describe('Componente: ProductItem', () => {

  // Creamos datos falsos ("mock") que coincidan con las props del componente
  const mockProduct = {
    name: 'Teclado Mecánico',
    price: 75.99,
    image: 'url-a-una-imagen.jpg'
    // ...otras propiedades que tu componente necesite
  };

  /**
   * CASO DE PRUEBA: CP-UNIT-ITEM-001
   * REPRESENTA A: Pieza 1 (Componente Tarjeta) del CP-CAR-001
   * HERRAMIENTA: Jest + React Testing Library
   */
  test('CP-UNIT-ITEM-001: Debe renderizar la info y el botón de añadir', () => {
    
    // 1. Renderiza el componente pasándole el producto mock
    render(<ProductItem product={mockProduct} />);

    // 2. Busca los elementos en la pantalla virtual
    
    // Busca el nombre del producto
    const nameElement = screen.getByText('Teclado Mecánico');
    
    // Busca el precio (Ojo: puede ser sensible al formato, ej "$75.99")
    const priceElement = screen.getByText(/75.99/i); 

    // Busca el botón de añadir
    // (Ajusta el nombre si tu botón dice otra cosa)
    const addButton = screen.getByRole('button', { name: /añadir al carrito/i });

    // 3. Aserciones: Verifica que todo exista
    expect(nameElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });
});