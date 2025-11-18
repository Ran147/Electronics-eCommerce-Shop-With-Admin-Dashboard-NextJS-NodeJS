// testJest/adminJest/ProductStockValidation.test.tsx
import DashboardProductDetails from '@/app/(dashboard)/admin/products/[id]/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// --- Mock next/navigation ---
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
  }),
  usePathname: () => '/admin/products/1',
}));

// --- Mock next/image ---
jest.mock('next/image', () => function MockImage(props: any) {
  return <img {...props} />;
});

// --- Mock react-hot-toast ---
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// --- Mock nanoid ---
jest.mock('nanoid', () => ({
  nanoid: () => `mock-unique-id-${Math.random().toString(36).substr(2, 9)}`,
}));

// --- Mock utils ---
jest.mock('../../utils/categoryFormating', () => ({
  convertCategoryNameToURLFriendly: (str: string) => 
    str.toLowerCase().replace(/\s+/g, '-'),
  formatCategoryName: (str: string) => 
    str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
}));

// --- Mock components ---
jest.mock('../../components', () => ({
  CustomButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  DashboardSidebar: () => (
    <div data-testid="dashboard-sidebar">Dashboard Sidebar</div>
  ),
  SectionTitle: ({ children }: any) => <h2>{children}</h2>,
}));

// Mock data
const mockProduct = {
  id: 1,
  title: 'Smart phone',
  price: 999,
  manufacturer: 'Apple',
  slug: 'smart-phone',
  inStock: 1,
  categoryId: '2',
  description: 'A very smart phone',
  mainImage: 'main.jpg',
};

const mockCategories = [
  { id: '1', name: 'Laptops' },
  { id: '2', name: 'Smartphones' },
];

const mockImages = [
  { id: 1, image: 'img1.jpg' },
  { id: 2, image: 'img2.jpg' },
];

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn()
    .mockImplementation((url: string) => {
      if (url.includes('/api/products/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProduct),
        });
      }
      
      if (url.includes('/api/images/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockImages),
        });
      }
      
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      
      if (url.includes('/api/main-image')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Uploaded' }),
        });
      }
      
      // Para PUT requests
      if (url.includes('/api/products/1')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        });
      }
      
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });
    });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('🧪 DashboardProductDetails (stock validation)', () => {
  it('debería renderizar el producto, categoría y permitir cambiar inStock', async () => {
    render(<DashboardProductDetails params={{ id: 1 }} />);

    // Espera a que se cargue el producto
    await waitFor(() => {
      expect(screen.getByDisplayValue('Smart phone')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verificar que los elementos principales están renderizados
    expect(screen.getByDisplayValue('999')).toBeInTheDocument(); // Precio
    expect(screen.getByDisplayValue('Apple')).toBeInTheDocument(); // Fabricante
    expect(screen.getByDisplayValue('smart-phone')).toBeInTheDocument(); // Slug

    // Verificar el combo box de stock
    const stockSelect = screen.getByLabelText(/is product in stock?/i) as HTMLSelectElement;
    expect(stockSelect).toBeInTheDocument();
    expect(stockSelect.value).toBe('1'); // Valor inicial (Sí)

    // Cambiar stock a "No" (0)
    fireEvent.change(stockSelect, { target: { value: '0' } });
    expect(stockSelect.value).toBe('0');

    // Verificar que el botón de actualizar está presente
    const updateButton = screen.getByText(/update product/i);
    expect(updateButton).toBeInTheDocument();

    // Simular click en actualizar
    fireEvent.click(updateButton);

    // Verificar que se llamó a fetch para actualizar
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products/1',
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

  }, 10000);

  it('debería solo permitir valores 0 o 1 en el combo box de stock', async () => {
    render(<DashboardProductDetails params={{ id: 1 }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Smart phone')).toBeInTheDocument();
    });

    const stockSelect = screen.getByLabelText(/is product in stock?/i) as HTMLSelectElement;

    // Verificar opciones disponibles
    const options = stockSelect.querySelectorAll('option');
    expect(options).toHaveLength(2);
    expect(options[0].value).toBe('1');
    expect(options[1].value).toBe('0');

    // Verificar valor inicial
    expect(stockSelect.value).toBe('1');

    // PROBAR CAMBIOS VÁLIDOS
    // Cambiar a "No" (0)
    fireEvent.change(stockSelect, { target: { value: '0' } });
    expect(stockSelect.value).toBe('0');

    // Cambiar de vuelta a "Sí" (1)
    fireEvent.change(stockSelect, { target: { value: '1' } });
    expect(stockSelect.value).toBe('1');

    // PROBAR VALORES INVÁLIDOS - Comportamiento real del select
    // Cuando se establece un valor inválido, el select puede:
    // 1. Mantener el último valor válido
    // 2. Cambiar a un valor vacío
    // 3. Cambiar al primer valor disponible
    
    // Intentar cambiar a valor inválido
    fireEvent.change(stockSelect, { target: { value: 'invalid' } });
    
    // En lugar de esperar un valor específico, verificamos que el valor actual sea uno de los válidos
    expect(['0', '1']).toContain(stockSelect.value);
    
    // Restablecer a valor conocido
    fireEvent.change(stockSelect, { target: { value: '1' } });
    
    // Probar otro valor inválido
    fireEvent.change(stockSelect, { target: { value: '999' } });
    expect(['0', '1']).toContain(stockSelect.value);

    // Verificar que después de valores inválidos, podemos seguir usando valores válidos
    fireEvent.change(stockSelect, { target: { value: '0' } });
    expect(stockSelect.value).toBe('0');
    
    fireEvent.change(stockSelect, { target: { value: '1' } });
    expect(stockSelect.value).toBe('1');
  }, 10000);

  it('debería prevenir entrada manual de texto en el combo box', async () => {
    render(<DashboardProductDetails params={{ id: 1 }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Smart phone')).toBeInTheDocument();
    });

    const stockSelect = screen.getByLabelText(/is product in stock?/i) as HTMLSelectElement;

    // Simular que alguien intenta escribir texto manualmente
    const originalValue = stockSelect.value;
    
    // Intentar establecer valores inválidos
    const invalidValues = ['texto-manual', 'abc', 'true', 'false', '-1', '2'];
    
    invalidValues.forEach(invalidValue => {
      fireEvent.change(stockSelect, { target: { value: invalidValue } });
      
      // Después de cada intento inválido, el valor debe ser uno de los válidos
      expect(['0', '1']).toContain(stockSelect.value);
      
      // Verificar que existe una opción con ese valor
      const currentOption = stockSelect.querySelector(`option[value="${stockSelect.value}"]`);
      expect(currentOption).toBeInTheDocument();
    });

    // Después de todos los intentos inválidos, deberíamos poder usar valores válidos normalmente
    fireEvent.change(stockSelect, { target: { value: '0' } });
    expect(stockSelect.value).toBe('0');
    
    fireEvent.change(stockSelect, { target: { value: '1' } });
    expect(stockSelect.value).toBe('1');
  }, 10000);

  // Test adicional: verificar que el combo box funciona correctamente en el flujo completo
  it('debería mantener la funcionalidad completa del combo box después de intentos inválidos', async () => {
    render(<DashboardProductDetails params={{ id: 1 }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Smart phone')).toBeInTheDocument();
    });

    const stockSelect = screen.getByLabelText(/is product in stock?/i) as HTMLSelectElement;

    // Flujo completo: válido -> inválido -> válido
    expect(stockSelect.value).toBe('1'); // Inicial
    
    // Cambio válido
    fireEvent.change(stockSelect, { target: { value: '0' } });
    expect(stockSelect.value).toBe('0');
    
    // Intento inválido
    fireEvent.change(stockSelect, { target: { value: 'invalid' } });
    // Después del inválido, debe seguir siendo usable
    expect(['0', '1']).toContain(stockSelect.value);
    
    // Volver a cambio válido
    fireEvent.change(stockSelect, { target: { value: '1' } });
    expect(stockSelect.value).toBe('1');
    
    // Verificar que el botón de actualizar funciona después de estos cambios
    const updateButton = screen.getByText(/update product/i);
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products/1',
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  }, 10000);
});