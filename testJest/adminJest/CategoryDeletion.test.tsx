// testJest/adminJest/CategoryDeletion.test.tsx
import DashboardSingleCategory from '@/app/(dashboard)/admin/categories/[id]/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// --- Mock next/navigation ---
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/admin/categories/1',
}));

// --- Mock react-hot-toast ---
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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
  DashboardSidebar: () => (
    <div data-testid="dashboard-sidebar">Dashboard Sidebar</div>
  ),
}));

// Mock data
const mockCategory = {
  id: 1,
  name: 'electronics',
};

describe('🧪 DashboardSingleCategory - Eliminación de Categoría', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
    
    // Mock simple de fetch
    global.fetch = jest.fn()
      .mockImplementation((url: string, options?: any) => {
        // GET para cargar la categoría
        if (url === 'http://localhost:3001/api/categories/1' && !options) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockCategory),
          });
        }
        
        // DELETE para eliminar la categoría
        if (url === 'http://localhost:3001/api/categories/1' && options?.method === 'DELETE') {
          return Promise.resolve({
            ok: true,
            status: 204, // Éxito en eliminación
          });
        }
        
        return Promise.resolve({
          ok: false,
          status: 404,
        });
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería eliminar la categoría exitosamente y redirigir al listado', async () => {
    // Renderizar el componente
    render(<DashboardSingleCategory params={{ id: 1 }} />);

    // Esperar a que se cargue la categoría
    await waitFor(() => {
      expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verificar que el botón de eliminar está presente
    const deleteButton = screen.getByText(/delete category/i);
    expect(deleteButton).toBeInTheDocument();

    // Simular clic en eliminar
    fireEvent.click(deleteButton);

    // Verificar que se llamó a la API de eliminación
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/categories/1',
        {
          method: 'DELETE',
        }
      );
    });

    // Verificar que se mostró el mensaje de éxito
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Category deleted successfully');
    });

    // Verificar que se redirigió a la página de categorías
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/categories');
    });
  }, 10000);
});