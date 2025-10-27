import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productos as productosIniciales } from '../../data/admin/productos';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [stockFilter, setStockFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('codigo');
  
  // Estados para modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    categoria: 'Merchandising de Bandas',
    nombre: '',
    precio: '',
    stock: '',
    stockCritico: '',
    estado: 'activo'
  });
  const [errors, setErrors] = useState({});


  const [categorias, setCategorias] = useState([]);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categoriaError, setCategoriaError] = useState('');

  // Reportes simulados
  const [reportes] = useState({
    productosMasVendidos: [
      { nombre: 'Polera Banda "Santaferia"', ventas: 45, ingresos: 674550 },
      { nombre: 'Entrada General Zona A', ventas: 38, ingresos: 456000 },
      { nombre: 'Vale "Terremoto"', ventas: 32, ingresos: 128000 },
      { nombre: 'Pañuelo Bordado', ventas: 28, ingresos: 167720 },
      { nombre: 'Vale "Empanada"', ventas: 25, ingresos: 75000 }
    ],
    productosMenosVendidos: [
      { nombre: 'Poncho Tradicional', ventas: 3, ingresos: 119970 },
      { nombre: 'Entrada VIP', ventas: 8, ingresos: 200000 },
      { nombre: 'Chupalla de Paja', ventas: 12, ingresos: 119880 },
      { nombre: 'Polera "Ráfaga"', ventas: 15, ingresos: 224850 },
      { nombre: 'Vale "Mote con Huesillo"', ventas: 18, ingresos: 45000 }
    ],
    tendenciasCategorias: [
      { categoria: 'Merchandising de Bandas', porcentaje: 35, tendencia: '↑' },
      { categoria: 'Entradas', porcentaje: 28, tendencia: '↑' },
      { categoria: 'Tickets de Consumo', porcentaje: 22, tendencia: '→' },
      { categoria: 'Vestimenta Huasa', porcentaje: 10, tendencia: '↓' },
      { categoria: 'Pañuelos de Cueca', porcentaje: 5, tendencia: '→' }
    ]
  });

  // Cargar productos y categorías desde localStorage o JSON inicial
  const cargarProductos = () => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      return JSON.parse(productosGuardados);
    }
    return productosIniciales;
  };

  // Cargar categorías desde localStorage o usar las iniciales
  const cargarCategorias = () => {
    const categoriasGuardadas = localStorage.getItem('categorias');
    if (categoriasGuardadas) {
      return JSON.parse(categoriasGuardadas);
    }
    // Categorías iniciales basadas en los productos
    return ['Merchandising de Bandas', 'Vestimenta Huasa', 'Pañuelos de Cueca', 'Tickets de Consumo', 'Entradas'];
  };

  // Guardar productos en localStorage
  const guardarProductos = (productosData) => {
    localStorage.setItem('productos', JSON.stringify(productosData));
  };

  // Guardar categorías en localStorage
  const guardarCategorias = (categoriasData) => {
    localStorage.setItem('categorias', JSON.stringify(categoriasData));
  };

  // Generar código automático
  const generarCodigo = (categoria) => {
    const categoriasMap = {
      'Merchandising de Bandas': 'MB',
      'Vestimenta Huasa': 'VH',
      'Pañuelos de Cueca': 'PQ',
      'Tickets de Consumo': 'TC',
      'Entradas': 'EN'
    };
    
    // Agregar nuevas categorías al mapa
    categorias.forEach(cat => {
      if (!categoriasMap[cat]) {
        const palabras = cat.split(' ');
        const prefijo = palabras.map(p => p.charAt(0)).join('').toUpperCase();
        categoriasMap[cat] = prefijo.substring(0, 2);
      }
    });
    
    const prefijo = categoriasMap[categoria] || 'PR';
    const productosCategoria = productos.filter(p => p.codigo.startsWith(prefijo));
    const siguienteNumero = productosCategoria.length > 0 
      ? Math.max(...productosCategoria.map(p => parseInt(p.codigo.replace(prefijo, '')))) + 1
      : 1;
    
    return `${prefijo}${siguienteNumero.toString().padStart(3, '0')}`;
  };

  // Función para agregar nueva categoría
  const handleAgregarCategoria = () => {
    if (!nuevaCategoria.trim()) {
      setCategoriaError('El nombre de la categoría es obligatorio');
      return;
    }

    if (categorias.includes(nuevaCategoria.trim())) {
      setCategoriaError('Esta categoría ya existe');
      return;
    }

    const nuevasCategorias = [...categorias, nuevaCategoria.trim()];
    setCategorias(nuevasCategorias);
    guardarCategorias(nuevasCategorias);
    
    // Seleccionar la nueva categoría automáticamente
    setFormData(prev => ({
      ...prev,
      categoria: nuevaCategoria.trim()
    }));
    
    setNuevaCategoria('');
    setCategoriaError('');
    setShowCategoriaModal(false);
  };

  useEffect(() => {
    const productosData = cargarProductos();
    const categoriasData = cargarCategorias();
    setProductos(productosData);
    setCategorias(categoriasData);
    setFilteredProductos(productosData);
  }, []);

  useEffect(() => {
    let filtered = productos;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (categoriaFilter !== 'todas') {
      filtered = filtered.filter(producto => producto.categoria === categoriaFilter);
    }

    // Filtro por stock
    if (stockFilter === 'critico') {
      filtered = filtered.filter(producto => 
        producto.stock > 0 && producto.stock <= producto.stockCritico
      );
    } else if (stockFilter === 'sin-stock') {
      filtered = filtered.filter(producto => producto.stock === 0);
    } else if (stockFilter === 'con-stock') {
      filtered = filtered.filter(producto => producto.stock > 0);
    }

    // Ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'precio':
          return b.precio - a.precio;
        case 'stock':
          return a.stock - b.stock;
        case 'categoria':
          return a.categoria.localeCompare(b.categoria);
        case 'codigo':
        default:
          return a.codigo.localeCompare(b.codigo);
      }
    });

    setFilteredProductos(filtered);
  }, [searchTerm, categoriaFilter, stockFilter, sortBy, productos]);

  // Validaciones
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formData.precio || formData.precio <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock || formData.stock < 0) {
      nuevosErrores.stock = 'El stock no puede ser negativo';
    }

    if (!formData.stockCritico || formData.stockCritico <= 0) {
      nuevosErrores.stockCritico = 'El stock crítico debe ser mayor a 0';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleOpenAddModal = () => {
    setFormData({
      categoria: categorias[0] || 'Merchandising de Bandas',
      nombre: '',
      precio: '',
      stock: '',
      stockCritico: '',
      estado: 'activo'
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleOpenEditModal = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      categoria: producto.categoria,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      stockCritico: producto.stockCritico,
      estado: producto.estado
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedProducto(null);
    setErrors({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    if (showAddModal) {
      // Agregar nuevo producto
      const nuevoProducto = {
        codigo: generarCodigo(formData.categoria),
        categoria: formData.categoria,
        nombre: formData.nombre.trim(),
        precio: parseInt(formData.precio),
        moneda: "CLP",
        stock: parseInt(formData.stock),
        stockCritico: parseInt(formData.stockCritico),
        estado: formData.estado
      };

      const updatedProductos = [...productos, nuevoProducto];
      setProductos(updatedProductos);
      guardarProductos(updatedProductos);
    } else if (showEditModal && selectedProducto) {
      // Editar producto existente
      const updatedProductos = productos.map(producto =>
        producto.codigo === selectedProducto.codigo
          ? { 
              ...producto, 
              categoria: formData.categoria,
              nombre: formData.nombre.trim(),
              precio: parseInt(formData.precio),
              stock: parseInt(formData.stock),
              stockCritico: parseInt(formData.stockCritico),
              estado: formData.estado
            }
          : producto
      );
      setProductos(updatedProductos);
      guardarProductos(updatedProductos);
    }

    handleCloseModals();
  };

  const handleDeleteProducto = (codigo) => {
    const producto = productos.find(p => p.codigo === codigo);
    
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`)) {
      const updatedProductos = productos.filter(p => p.codigo !== codigo);
      setProductos(updatedProductos);
      guardarProductos(updatedProductos);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoriaFilter('todas');
    setStockFilter('todos');
    setSortBy('codigo');
  };

  const resetToDefault = () => {
    if (window.confirm('¿Restaurar lista de productos a los valores por defecto?')) {
      setProductos(productosIniciales);
      guardarProductos(productosIniciales);
      const categoriasPorDefecto = ['Merchandising de Bandas', 'Vestimenta Huasa', 'Pañuelos de Cueca', 'Tickets de Consumo', 'Entradas'];
      setCategorias(categoriasPorDefecto);
      guardarCategorias(categoriasPorDefecto);
    }
  };

  // Calcular estadísticas
  const productosSinStock = productos.filter(p => p.stock === 0).length;
  const productosStockCritico = productos.filter(p => p.stock > 0 && p.stock <= p.stockCritico).length;
  const productosActivos = productos.filter(p => p.estado === 'activo').length;

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };
  return (
    <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
      {/* Filtros avanzados */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.95)'
          }}>
            <div className="card-body">
              <div className="row g-3">
                {/* Búsqueda general */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Búsqueda</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre, código o categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Filtro por categoría */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Categoría</label>
                  <select 
                    className="form-select"
                    value={categoriaFilter}
                    onChange={(e) => setCategoriaFilter(e.target.value)}
                  >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por stock */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Estado Stock</label>
                  <select 
                    className="form-select"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="con-stock">Con stock</option>
                    <option value="sin-stock">Sin stock</option>
                    <option value="critico">Stock crítico</option>
                  </select>
                </div>

                {/* Ordenamiento */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Ordenar por</label>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="codigo">Código</option>
                    <option value="nombre">Nombre</option>
                    <option value="precio">Precio</option>
                    <option value="stock">Stock</option>
                    <option value="categoria">Categoría</option>
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="col-md-3 d-flex align-items-end">
                  <div className="d-flex gap-2 w-100">
                    <button 
                      className="btn btn-outline-secondary flex-fill"
                      onClick={clearFilters}
                      title="Limpiar filtros"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                    <button 
                      className="btn btn-primary flex-fill"
                      onClick={handleOpenAddModal}
                      title="Agregar producto"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contador de resultados y botón reset */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Mostrando <strong>{filteredProductos.length}</strong> de <strong>{productos.length}</strong> productos
                      {categoriaFilter !== 'todas' && ` • Categoría: ${categoriaFilter}`}
                      {stockFilter !== 'todos' && ` • Stock: ${stockFilter === 'critico' ? 'Crítico' : stockFilter === 'sin-stock' ? 'Sin stock' : 'Con stock'}`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    <div className="d-flex gap-2">
                      {filteredProductos.length !== productos.length && (
                        <button 
                          className="btn btn-sm btn-link text-muted p-0"
                          onClick={clearFilters}
                        >
                          Limpiar filtros
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-outline-warning"
                        onClick={resetToDefault}
                        title="Restaurar productos por defecto"
                      >
                        <i className="bi bi-arrow-counterclockwise"></i> Restaurar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-danger bg-opacity-10 border-danger">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-danger">{productosSinStock}</h3>
                  <p className="mb-0 text-muted">Productos sin stock</p>
                </div>
                <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning bg-opacity-10 border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-warning">{productosStockCritico}</h3>
                  <p className="mb-0 text-muted">Stock crítico</p>
                </div>
                <i className="bi bi-speedometer2 text-warning" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-success">{productosActivos}</h3>
                  <p className="mb-0 text-muted">Productos activos</p>
                </div>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm" style={{ 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div className="card-header" style={{ 
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              padding: '1rem 1.25rem'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0" style={{ color: '#333', fontSize: '1.25rem' }}>
                  Listado de Productos
                </h3>
                
                {/* Información de filtros activos */}
                <div className="d-flex gap-2">
                  {categoriaFilter !== 'todas' && (
                    <span className="badge bg-primary">
                      Categoría: {categoriaFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setCategoriaFilter('todas')}
                      ></button>
                    </span>
                  )}
                  {stockFilter !== 'todos' && (
                    <span className="badge bg-info text-dark">
                      Stock: {stockFilter === 'critico' ? 'Crítico' : stockFilter === 'sin-stock' ? 'Sin stock' : 'Con stock'}
                      <button 
                        className="btn-close ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setStockFilter('todos')}
                      ></button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="badge bg-secondary">
                      Búsqueda: {searchTerm}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setSearchTerm('')}
                      ></button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="card-body table-responsive p-0" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <table className="table table-hover text-nowrap mb-0">
                <thead style={{ backgroundColor: 'rgba(248,249,250,0.9)' }}>
                  <tr>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Código</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Nombre</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Categoría</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Precio</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Stock</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Estado</th>
                    <th style={{ 
                      width: '120px', 
                      border: 'none', 
                      padding: '12px 16px', 
                      fontWeight: '600', 
                      color: '#333',
                      textAlign: 'center'
                    }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProductos.length > 0 ? (
                    filteredProductos.map(producto => (
                      <tr key={producto.codigo} style={{ 
                        backgroundColor: producto.stock === 0 ? 'rgba(220,53,69,0.05)' : 
                                       producto.stock <= producto.stockCritico ? 'rgba(255,193,7,0.05)' : 'rgba(255,255,255,0.8)',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666', fontWeight: '500' }}>
                          {producto.codigo}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>
                          {producto.nombre}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>
                          {producto.categoria}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666', fontWeight: '500' }}>
                          {formatPrice(producto.precio)}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <div className="d-flex align-items-center">
                            <span className={`badge ${
                              producto.stock === 0 ? 'bg-danger' : 
                              producto.stock <= producto.stockCritico ? 'bg-warning' : 'bg-success'
                            }`}>
                              {producto.stock} unidades
                            </span>
                            {producto.stock > 0 && producto.stock <= producto.stockCritico && (
                              <small className="text-warning ms-2">
                                <i className="bi bi-exclamation-triangle"></i>
                              </small>
                            )}
                          </div>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <span className={`badge ${producto.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
                            {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', textAlign: 'center' }}>
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleOpenEditModal(producto)}
                            title="Editar producto"
                            style={{ 
                              border: '1px solid #007bff',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProducto(producto.codigo)}
                            title="Eliminar producto"
                            style={{ 
                              border: '1px solid #dc3545',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5" style={{ border: 'none' }}>
                        <i className="bi bi-box display-4 text-muted d-block mb-3"></i>
                        <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>No se encontraron productos</p>
                        <small className="text-muted">Intenta ajustar los filtros de búsqueda</small>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Reportes de Productos */}
      <div className="row mt-5">
        <div className="col-12">
          <h4 className="mb-4" style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
            <i className="bi bi-graph-up me-2"></i>
            Reportes y Análisis de Productos
          </h4>
        </div>

        {/* Productos Más Vendidos */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">
                <i className="bi bi-trophy me-2"></i>
                Top 5 - Más Vendidos
              </h6>
            </div>
            <div className="card-body">
              {reportes.productosMasVendidos.map((producto, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{producto.nombre}</h6>
                    <small className="text-muted">{producto.ventas} ventas</small>
                  </div>
                  <div className="text-end">
                    <strong className="text-success">{formatPrice(producto.ingresos)}</strong>
                    <div className="badge bg-success bg-opacity-20 text-success ms-2">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos Menos Vendidos */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">
                <i className="bi bi-arrow-down me-2"></i>
                Menos Vendidos
              </h6>
            </div>
            <div className="card-body">
              {reportes.productosMenosVendidos.map((producto, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{producto.nombre}</h6>
                    <small className="text-muted">{producto.ventas} ventas</small>
                  </div>
                  <div className="text-end">
                    <strong className="text-warning">{formatPrice(producto.ingresos)}</strong>
                    <div className={`badge ${
                      producto.ventas < 10 ? 'bg-danger bg-opacity-20 text-danger' : 'bg-warning bg-opacity-20 text-warning'
                    } ms-2`}>
                      {producto.ventas < 10 ? 'Bajo' : 'Medio'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tendencias por Categoría */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">
                <i className="bi bi-bar-chart me-2"></i>
                Tendencias por Categoría
              </h6>
            </div>
            <div className="card-body">
              {reportes.tendenciasCategorias.map((categoria, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{categoria.categoria}</h6>
                    <div className="progress" style={{ height: '6px', width: '120px' }}>
                      <div 
                        className={`progress-bar ${
                          categoria.tendencia === '↑' ? 'bg-success' : 
                          categoria.tendencia === '↓' ? 'bg-danger' : 'bg-warning'
                        }`} 
                        style={{ width: `${categoria.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-end">
                    <strong>{categoria.porcentaje}%</strong>
                    <span className={`badge ${
                      categoria.tendencia === '↑' ? 'bg-success' : 
                      categoria.tendencia === '↓' ? 'bg-danger' : 'bg-warning'
                    } ms-2`}>
                      {categoria.tendencia}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Modal Agregar Producto */}
        {showAddModal && (
  <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Nuevo Producto
          </h5>
          <button type="button" className="btn-close btn-close-white" onClick={handleCloseModals}></button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Categoría *</label>
                <select
                  className="form-select"
                  value={formData.categoria}
                  onChange={(e) => handleFormChange('categoria', e.target.value)}
                >
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                <div className="form-text">
                  ¿No encuentras la categoría? 
                  <Link to="/admin/categorias" className="ms-1">
                    Crear nueva categoría
                  </Link>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Nombre del Producto *</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  value={formData.nombre}
                  onChange={(e) => handleFormChange('nombre', e.target.value)}
                  placeholder="Ingrese nombre del producto"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Precio (CLP) *</label>
                <input
                  type="number"
                  className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                  value={formData.precio}
                  onChange={(e) => handleFormChange('precio', e.target.value)}
                  placeholder="0"
                  min="1"
                />
                {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Estado</label>
                <select
                  className="form-select"
                  value={formData.estado}
                  onChange={(e) => handleFormChange('estado', e.target.value)}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Stock Inicial *</label>
                <input
                  type="number"
                  className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                  value={formData.stock}
                  onChange={(e) => handleFormChange('stock', e.target.value)}
                  placeholder="0"
                  min="0"
                />
                {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Stock Crítico *</label>
                <input
                  type="number"
                  className={`form-control ${errors.stockCritico ? 'is-invalid' : ''}`}
                  value={formData.stockCritico}
                  onChange={(e) => handleFormChange('stockCritico', e.target.value)}
                  placeholder="0"
                  min="1"
                />
                {errors.stockCritico && <div className="invalid-feedback">{errors.stockCritico}</div>}
                <div className="form-text">Alerta cuando el stock sea menor o igual</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
              <i className="bi bi-x-circle me-1"></i> Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle me-1"></i> Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{/* Modal Editar Producto */}
{showEditModal && selectedProducto && (
  <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header bg-warning text-dark">
          <h5 className="modal-title">
            <i className="bi bi-pencil-square me-2"></i>
            Editar Producto
          </h5>
          <button type="button" className="btn-close" onClick={handleCloseModals}></button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            {/* Información del producto actual */}
            <div className="alert alert-info">
              <div className="row small">
                <div className="col-6">
                  <strong>Código:</strong> {selectedProducto.codigo}
                </div>
                <div className="col-6">
                  <strong>Estado actual:</strong> 
                  <span className={`badge ${selectedProducto.estado === 'activo' ? 'bg-success' : 'bg-secondary'} ms-1`}>
                    {selectedProducto.estado}
                  </span>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Categoría *</label>
                <select
                  className="form-select"
                  value={formData.categoria}
                  onChange={(e) => handleFormChange('categoria', e.target.value)}
                >
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                <div className="form-text">
                  <Link to="/admin/categorias">
                    Gestionar categorías
                  </Link>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Nombre del Producto *</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  value={formData.nombre}
                  onChange={(e) => handleFormChange('nombre', e.target.value)}
                  placeholder="Ingrese nombre del producto"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Precio (CLP) *</label>
                <input
                  type="number"
                  className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                  value={formData.precio}
                  onChange={(e) => handleFormChange('precio', e.target.value)}
                  placeholder="0"
                  min="1"
                />
                {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Estado</label>
                <select
                  className="form-select"
                  value={formData.estado}
                  onChange={(e) => handleFormChange('estado', e.target.value)}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Stock Actual *</label>
                <input
                  type="number"
                  className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                  value={formData.stock}
                  onChange={(e) => handleFormChange('stock', e.target.value)}
                  placeholder="0"
                  min="0"
                />
                {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
              </div>

              <div className="col-6">
                <label className="form-label fw-semibold">Stock Crítico *</label>
                <input
                  type="number"
                  className={`form-control ${errors.stockCritico ? 'is-invalid' : ''}`}
                  value={formData.stockCritico}
                  onChange={(e) => handleFormChange('stockCritico', e.target.value)}
                  placeholder="0"
                  min="1"
                />
                {errors.stockCritico && <div className="invalid-feedback">{errors.stockCritico}</div>}
                <div className="form-text">Alerta cuando el stock sea menor o igual</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
              <i className="bi bi-x-circle me-1"></i> Cancelar
            </button>
            <button type="submit" className="btn btn-warning">
              <i className="bi bi-check-circle me-1"></i> Actualizar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Productos;