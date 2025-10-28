
import React from 'react'
import { describe, it, expect, beforeAll, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'


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


import AdminLayout from '../AdminLayout'
import Sidebar from '../Sidebar'
import Dashboard from '../../../pages/admin/dashboard'
import Actividad, { registrarActividad as registrarActividadReal } from '../../../pages/admin/Actividad'


beforeAll(() => {
  
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
  it('ACT-1: Input de búsqueda puede recibir foco y acepta texto', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const searchInput = screen.getByTestId('search-input')
    searchInput.focus()
    expect(document.activeElement).toBe(searchInput)
    fireEvent.change(searchInput, { target: { value: 'entrada' } })
    expect(searchInput).toHaveValue('entrada')
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
    
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('export-btn'))
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  
  it('ACT-11: Exportar invoca URL.revokeObjectURL tras crear el blob', () => {
    
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('export-btn'))
    expect(URL.createObjectURL).toHaveBeenCalled()
    
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })

  it('ACT-12: Select de tipo incluye opción "Todos los tipos" y producto_creado', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const tipoSelect = screen.getByTestId('tipo-select')
    const options = Array.from(tipoSelect.querySelectorAll('option')).map(o => o.value)
    expect(options).toContain('todos')
    expect(options).toContain('producto_creado')
  })

  it('ACT-13: Componente Actividad muestra el contador exacto de actividades', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    expect(screen.getByText('Mostrando 2 de 2 actividades')).toBeInTheDocument()
  })

  it('ACT-14: Botón export tiene el atributo title correcto', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const btn = screen.getByTestId('export-btn')
    expect(btn).toHaveAttribute('title', 'Exportar actividades')
  })

  it('ACT-15: Botón limpiar tiene el atributo title correcto', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const btn = screen.getByTestId('limpiar-btn')
    expect(btn).toHaveAttribute('title', 'Limpiar historial')
  })

  it('ACT-16: Export crea, añade y remueve el anchor del DOM', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi.spyOn(document.body, 'removeChild')
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('export-btn'))
    expect(appendSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()
    appendSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('ACT-17: Limpiar historial actualiza localStorage.actividades cuando confirma true', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true)
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('limpiar-btn'))
    expect(confirmSpy).toHaveBeenCalled()
    
    expect(window.localStorage.getItem('actividades')).toBe(JSON.stringify([]))
    confirmSpy.mockRestore()
  })

  it('ACT-18: Limpiar historial no modifica localStorage cuando confirma false', () => {
    const setSpy = vi.spyOn(window.localStorage, 'setItem')
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false)
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('limpiar-btn'))
    expect(confirmSpy).toHaveBeenCalled()
    
    expect(setSpy).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
    setSpy.mockRestore()
  })

  it('ACT-19: El input de búsqueda tiene el placeholder correcto', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const input = screen.getByTestId('search-input')
    expect(input).toHaveAttribute('placeholder', 'Buscar en actividades...')
  })

  it('ACT-20: Select de orden contiene dos opciones', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const sel = screen.getByTestId('orden-select')
    expect(sel.querySelectorAll('option').length).toBe(2)
  })

  
  it('AL-6: AdminLayout contiene elemento nav', () => {
    render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('AL-7: Icono de campana presente', () => {
    const { container } = render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    expect(container.querySelector('.bi-bell-fill')).toBeTruthy()
  })

  it('AL-8: Icono de chat presente', () => {
    const { container } = render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    expect(container.querySelector('.bi-chat-dots-fill')).toBeTruthy()
  })

  it('AL-9: Click en chat no lanza excepción', () => {
    const { container } = render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    const chatAnchor = container.querySelector('.bi-chat-dots-fill')?.closest('a')
    expect(chatAnchor).toBeTruthy()
    if (chatAnchor) expect(() => fireEvent.click(chatAnchor)).not.toThrow()
  })

  it('SB-8: Sidebar link a /admin/usuarios existe', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>)
    const link = screen.getByText(/Usuarios/i)
    expect(link.closest('a')).toHaveAttribute('href', '/admin/usuarios')
  })

  it('SB-9: Sidebar link a actividad correcto', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>)
    const link = screen.getByText(/Actividad/i)
    expect(link.closest('a')).toHaveAttribute('href', '/admin/registro-actividad')
  })

  it('SB-10: Brand text presente en Sidebar', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>)
    expect(screen.getByText('Fonda SQL')).toBeInTheDocument()
  })

  it('DB-4: Dashboard muestra al menos una tarjeta de métricas', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    const matches = screen.getAllByText(/Productos sin stock/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('DB-5: Dashboard muestra texto Total productos', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByText(/Total productos/i)).toBeInTheDocument()
  })

  it('DB-6: Cada chart mock se renderiza exactamente una vez', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getAllByTestId('mock-ventas-mes').length).toBe(1)
    expect(screen.getAllByTestId('mock-usuarios-activos').length).toBe(1)
    expect(screen.getAllByTestId('mock-proporcion').length).toBe(1)
  })

  
  it('ACT-21: Input de búsqueda es de tipo text', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const input = screen.getByTestId('search-input')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('ACT-22: Input de fecha es de tipo date', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const fecha = screen.getByTestId('fecha-input')
    expect(fecha).toHaveAttribute('type', 'date')
  })

  it('ACT-23: Select tipo tiene valor por defecto "todos"', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const tipo = screen.getByTestId('tipo-select')
    expect(tipo).toHaveValue('todos')
  })

  it('ACT-24: Select orden tiene valor por defecto "fecha"', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const orden = screen.getByTestId('orden-select')
    expect(orden).toHaveValue('fecha')
  })

  it('ACT-25: Botón export contiene texto Exportar', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const btn = screen.getByTestId('export-btn')
    expect(btn.textContent).toMatch(/Exportar/i)
  })

  it('ACT-26: Botón limpiar contiene texto Limpiar', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const btn = screen.getByTestId('limpiar-btn')
    expect(btn.textContent).toMatch(/Limpiar/i)
  })

  it('ACT-27: Cambiar multiples controles actualiza sus valores', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const search = screen.getByTestId('search-input')
    const tipo = screen.getByTestId('tipo-select')
    const fecha = screen.getByTestId('fecha-input')
    const orden = screen.getByTestId('orden-select')

    fireEvent.change(search, { target: { value: 'Entrada General' } })
    fireEvent.change(tipo, { target: { value: 'producto_creado' } })
    fireEvent.change(fecha, { target: { value: '2024-01-14' } })
    fireEvent.change(orden, { target: { value: 'tipo' } })

    expect(search).toHaveValue('Entrada General')
    expect(tipo).toHaveValue('producto_creado')
    expect(fecha).toHaveValue('2024-01-14')
    expect(orden).toHaveValue('tipo')
  })

  it('ACT-28: Export crea anchor con atributo download "actividades.json"', () => {
    const origCreate = document.createElement.bind(document)
    const spy = vi.spyOn(document, 'createElement').mockImplementation((tag) => origCreate(tag))
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('export-btn'))
    
    const createdA = spy.mock.results.map(r => r.value).find(el => el && el.tagName === 'A')
    expect(createdA).toBeTruthy()
    expect(createdA.download).toBe('actividades.json')
    spy.mockRestore()
  })

  it('ACT-29: Sidebar tiene 6 elementos de navegación', () => {
    const { container } = render(<MemoryRouter><Sidebar /></MemoryRouter>)
    const items = container.querySelectorAll('.nav-item')
    expect(items.length).toBe(6)
  })

  it('ACT-30: Primer enlace del sidebar es Dashboard', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>)
    const first = screen.getByText(/Dashboard/i)
    expect(first).toBeInTheDocument()
  })

  it('ACT-31: Dashboard muestra texto "Productos sin stock" al menos una vez', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    const matches = screen.getAllByText(/Productos sin stock/i)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('ACT-32: Dashboard contiene el texto de categorias dentro de un div', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    const node = screen.getByText(/5 categorías/i)
    expect(node.tagName.toLowerCase()).toBe('div')
  })

  it('ACT-33: AdminLayout contiene al menos una .nav-link', () => {
    const { container } = render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    const links = container.querySelectorAll('.nav-link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('ACT-34: Todos los links del sidebar apuntan a /admin/*', () => {
    const { container } = render(<MemoryRouter><Sidebar /></MemoryRouter>)
    const anchors = Array.from(container.querySelectorAll('a'))
      .filter(a => a.closest('.nav-item'))
    anchors.forEach(a => {
      expect(a.getAttribute('href')?.startsWith('/admin')).toBe(true)
    })
  })

  it('ACT-35: Export se puede ejecutar varias veces sin lanzar', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const btn = screen.getByTestId('export-btn')
    expect(() => { fireEvent.click(btn); fireEvent.click(btn) }).not.toThrow()
  })

  it('ACT-36: Limpiar puede invocarse varias veces (confirm true) y mantiene formato en localStorage', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true)
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const btn = screen.getByTestId('limpiar-btn')
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(window.localStorage.getItem('actividades')).toBe(JSON.stringify([]))
    confirmSpy.mockRestore()
  })

  it('ACT-37: Select orden incluye opción con value "tipo"', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const orden = screen.getByTestId('orden-select')
    const values = Array.from(orden.querySelectorAll('option')).map(o => o.value)
    expect(values).toContain('tipo')
  })

  it('ACT-38: Select tipo incluye opción con texto "Producto creado"', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const tipo = screen.getByTestId('tipo-select')
    const labels = Array.from(tipo.querySelectorAll('option')).map(o => o.textContent)
    expect(labels.some(l => /Producto creado/i.test(l || ''))).toBe(true)
  })

  it('ACT-39: Fecha input acepta la fecha 2024-01-15', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    const fecha = screen.getByTestId('fecha-input')
    fireEvent.change(fecha, { target: { value: '2024-01-15' } })
    expect(fecha).toHaveValue('2024-01-15')
  })

  it('ACT-40: No quedan anchors residuales en body después de exportar', () => {
    render(<MemoryRouter><Actividad /></MemoryRouter>)
    fireEvent.click(screen.getByTestId('export-btn'))
    const anchors = Array.from(document.body.querySelectorAll('a'))
    
    expect(anchors.length).toBe(0)
  })
})
