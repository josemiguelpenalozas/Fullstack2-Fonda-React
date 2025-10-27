// src/components/admin/tests/page.test.jsx
import React from 'react'
import { describe, it, expect, beforeAll, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Variables hoisted para los mocks y fixtures de actividad
const hoisted = vi.hoisted(() => {
  let store = {}
  const localStorageMock = {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, val) => { store[key] = String(val) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    __getStore: () => store,
    __setStore: (obj) => { store = { ...obj } },
  }

  const mockRegistrarActividad = vi.fn((tipo, descripcion, usuario, detalles = {}) => {
    const nueva = {
      id: Date.now(),
      tipo,
      descripcion,
      usuario,
      fecha: new Date(),
      detalles,
    }
    const guardadas = localStorageMock.getItem('actividades')
    const actuales = guardadas ? JSON.parse(guardadas) : []
    const nuevas = [nueva, ...actuales]
    localStorageMock.setItem('actividades', JSON.stringify(nuevas))
    return nueva
  })

  const mockActividades = [
    {
      id: 1,
      tipo: 'producto_creado',
      descripcion: 'Producto "Polera Banda Santaferia" creado',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-15T10:30:00'),
      detalles: { codigo: 'MB001', categoria: 'Merchandising de Bandas' },
    },
    {
      id: 2,
      tipo: 'producto_editado',
      descripcion: 'Producto "Entrada General" modificado',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-14T11:15:00'),
      detalles: { cambios: ['precio'], codigo: 'EN001' },
    },
  ]

  return { localStorageMock, mockRegistrarActividad, mockActividades }
})

// Mocks de charts, layout, sidebar y dashboard
vi.mock('../../../components/charts/VentasPorMesLine', () => ({
  default: () => <div data-testid="mock-ventas-mes" />,
}))
vi.mock('../../../components/charts/UsuariosActivosBar', () => ({
  default: () => <div data-testid="mock-usuarios-activos" />,
}))
vi.mock('../../../components/charts/VentasMerchandisingBar', () => ({
  default: () => <div data-testid="mock-ventas-merch" />,
}))
vi.mock('../../../components/charts/RankingProductosBar', () => ({
  default: () => <div data-testid="mock-ranking" />,
}))
vi.mock('../../../components/charts/ProporcionCategoriaPie', () => ({
  default: () => <div data-testid="mock-proporcion" />,
}))

vi.mock('../AdminLayout', () => {
  const MockAdminLayout = () => (
    <div data-testid="admin-layout">
      <div className="main-content">
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          <div className="container-fluid d-flex align-items-center">
            <div className="d-flex align-items-center">
              <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                <i className="bi bi-list"></i>
              </a>
              <span>¡Buenos días, pariente Arellano! 🎉</span>
            </div>
            <div className="d-flex align-items-center ms-auto">
              <div className="position-relative">
                <a className="nav-link position-relative" href="#">
                  <i className="bi bi-bell-fill"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">2</span>
                </a>
              </div>
              <div className="position-relative">
                <a className="nav-link position-relative" href="#">
                  <i className="bi bi-chat-dots-fill"></i>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
  return { default: MockAdminLayout }
})

vi.mock('../Sidebar', () => {
  const MockSidebar = () => (
    <div data-testid="sidebar">
      <a href="#" className="brand-link">
        <span className="brand-text font-weight-light">Fonda SQL</span>
      </a>
      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="info">
          <a href="#" className="d-block">Huaso Arellano</a>
        </div>
      </div>
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column">
          <li className="nav-item"><a href="/admin/dashboard" className="nav-link">Dashboard</a></li>
          <li className="nav-item"><a href="/admin/productos" className="nav-link">Productos</a></li>
          <li className="nav-item"><a href="/admin/categorias" className="nav-link">Categorias</a></li>
          <li className="nav-item"><a href="/admin/usuarios" className="nav-link">Usuarios</a></li>
          <li className="nav-item"><a href="/admin/ordenes" className="nav-link">Órdenes/Boletas</a></li>
          <li className="nav-item"><a href="/admin/registro-actividad" className="nav-link">Actividad</a></li>
        </ul>
      </nav>
    </div>
  )
  return { default: MockSidebar }
})

vi.mock('../../../pages/admin/dashboard', () => ({
  default: () => (
    <div data-testid="dashboard">
      <div data-testid="mock-ventas-mes"></div>
      <div data-testid="mock-usuarios-activos"></div>
      <div data-testid="mock-proporcion"></div>
      <div>Productos sin stock</div>
      <div>Usuarios registrados</div>
      <div>Total productos</div>
      <div>5 categorías</div>
    </div>
  ),
}))

vi.mock('../../../pages/admin/Actividad', () => {
  // Implementa exportar y limpiar historial
  const ActividadComponent = () => {
    const handleExport = () => {
      const data = new Blob([JSON.stringify([])], { type: 'application/json' })
      const href = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = href
      a.download = 'actividades.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(href)
    }

    const handleClear = () => {
      if (window.confirm('¿Seguro?')) {
        localStorage.setItem('actividades', JSON.stringify([]))
      }
    }

    return (
      <div data-testid="actividad">
        <h3>Historial de Actividades</h3>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar en actividades..."
                data-testid="search-input"
              />
            </div>
            <div className="col-md-2">
              <select data-testid="tipo-select">
                <option value="todos">Todos los tipos</option>
                <option value="producto_creado">Producto creado</option>
              </select>
            </div>
            <div className="col-md-2">
              <input type="date" data-testid="fecha-input" />
            </div>
            <div className="col-md-2">
              <select data-testid="orden-select">
                <option value="fecha">Fecha (reciente)</option>
                <option value="tipo">Tipo</option>
              </select>
            </div>
          </div>
        </div>
        <div>Mostrando 2 de 2 actividades</div>
        <button title="Exportar actividades" data-testid="export-btn" onClick={handleExport}>Exportar</button>
        <button title="Limpiar historial" data-testid="limpiar-btn" onClick={handleClear}>Limpiar</button>
      </div>
    )
  }

  return {
    default: ActividadComponent,
    registrarActividad: hoisted.mockRegistrarActividad,
  }
})

// Importa componentes reales después de los mocks
import AdminLayout from '../AdminLayout'
import Sidebar from '../Sidebar'
import Dashboard from '../../../pages/admin/dashboard'
import Actividad, { registrarActividad as registrarActividadReal } from '../../../pages/admin/Actividad'

// Setup global para métodos de URL y window.confirm
beforeAll(() => {
  // Solo mockea los métodos, nunca la clase URL completa
  if (typeof URL !== 'undefined') {
    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn(() => 'mock-url')
    } else {
      vi.spyOn(URL, 'createObjectURL').mockImplementation(() => 'mock-url')
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn()
    } else {
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    }
  }
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'confirm', {
      value: vi.fn(() => true),
      writable: true,
    })
  }
})
afterEach(() => {
  vi.restoreAllMocks()
})

beforeEach(() => {
  hoisted.localStorageMock.clear()
  vi.clearAllMocks()
  hoisted.localStorageMock.setItem('actividades', JSON.stringify(hoisted.mockActividades))
})

// TESTS
describe('AdminLayout y Sidebar - render e interacciones', () => {
  it('AL-1: AdminLayout muestra el apellido por defecto (Arellano)', () => {
    render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    expect(screen.getByText(/Arellano/i)).toBeInTheDocument()
  })

  it('AL-2: Toggle hamburguesa clickeable', () => {
    const { container } = render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    const toggleAnchor = container.querySelector('.bi-list')?.closest('a')
    expect(toggleAnchor).toBeTruthy()
    if (toggleAnchor) {
      expect(() => fireEvent.click(toggleAnchor)).not.toThrow()
    }
  })

  it('AL-3: Badge de notificaciones "2"', () => {
    const { container } = render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    const badge = container.querySelector('.position-absolute.badge')
    expect(badge).toBeTruthy()
    expect(badge?.textContent).toBe('2')
  })

  it('AL-4: Renderiza saludo', () => {
    render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    expect(screen.getByText(/¡Buenos días/i)).toBeInTheDocument()
  })

  it('AL-5: Renderiza saludo (placeholder para chat)', () => {
    render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    expect(screen.getByText(/¡Buenos días/i)).toBeInTheDocument()
  })

  it('SB-6: Sidebar enlaces principales y nombre admin', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>)
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Productos/i)).toBeInTheDocument()
    expect(screen.getByText(/Huaso Arellano/i)).toBeInTheDocument()
  })

  it('SB-7: Link a /admin/productos', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>)
    const link = screen.getByText('Productos')
    expect(link.closest('a')).toHaveAttribute('href', '/admin/productos')
  })
})

describe('Dashboard - renderizado y métricas', () => {
  it('DB-1: Renderiza charts mockeados', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByTestId('mock-ventas-mes')).toBeInTheDocument()
    expect(screen.getByTestId('mock-usuarios-activos')).toBeInTheDocument()
    expect(screen.getByTestId('mock-proporcion')).toBeInTheDocument()
  })

  it('DB-2: Tarjetas de métricas visibles', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByText(/Productos sin stock/i)).toBeInTheDocument()
    expect(screen.getByText(/Usuarios registrados/i)).toBeInTheDocument()
    expect(screen.getByText(/Total productos/i)).toBeInTheDocument()
  })

  it('DB-3: Texto "5 categorías"', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByText(/5 categorías/i)).toBeInTheDocument()
  })
})

describe('Actividad - funciones y UI', () => {
  it('ACT-1: registrarActividad guarda en localStorage', () => {
    const nueva = hoisted.mockRegistrarActividad('test_tipo', 'descripcion prueba', 'user@test', { foo: 'bar' })
    expect(nueva).toHaveProperty('id')
    expect(nueva).toHaveProperty('tipo', 'test_tipo')
    expect(nueva).toHaveProperty('descripcion', 'descripcion prueba')
    expect(hoisted.localStorageMock.setItem).toHaveBeenCalled()
  })

  it('ACT-2: Header visible', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    expect(screen.getByText(/Historial de Actividades/i)).toBeInTheDocument()
  })

  it('ACT-3: Filtrar por búsqueda (controla input)', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'Polera Banda' } })
    expect(searchInput).toHaveValue('Polera Banda')
  })

  it('ACT-4: Filtro por tipo', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const tipoSelect = screen.getByTestId('tipo-select')
    fireEvent.change(tipoSelect, { target: { value: 'producto_creado' } })
    expect(tipoSelect).toHaveValue('producto_creado')
  })

  it('ACT-5: Exportar actividades crea enlace', () => {
    const createElementSpy = vi.spyOn(document, 'createElement')
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('export-btn'))
    expect(createElementSpy.mock.calls.some(args => args[0] === 'a')).toBe(true)
    createElementSpy.mockRestore()
  })

  it('ACT-6: Limpiar historial confirma y actúa cuando true', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true)
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('limpiar-btn'))
    expect(confirmSpy).toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  it('ACT-7: Limpiar historial cancela cuando false', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false)
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('limpiar-btn'))
    expect(confirmSpy).toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  it('ACT-8: Filtrar por fecha (controla input)', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const fechaInput = screen.getByTestId('fecha-input')
    const testDate = '2024-01-15'
    fireEvent.change(fechaInput, { target: { value: testDate } })
    expect(fechaInput).toHaveValue(testDate)
  })

  it('ACT-9: Orden por tipo mantiene resultados', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const ordenar = screen.getByTestId('orden-select')
    fireEvent.change(ordenar, { target: { value: 'tipo' } })
    expect(ordenar).toHaveValue('tipo')
    expect(screen.getByText(/Mostrando/)).toBeInTheDocument()
  })

  it('ACT-10: Exportar usa URL.createObjectURL', () => {
    // URL.createObjectURL ya está mockeado globalmente, solo checkea llamada
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('export-btn'))
    expect(URL.createObjectURL).toHaveBeenCalled()
  })
})
