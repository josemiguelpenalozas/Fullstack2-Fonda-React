import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [fechaFilter, setFechaFilter] = useState('');
  const [sortBy, setSortBy] = useState('fecha');
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [showBoletaModal, setShowBoletaModal] = useState(false);

  // Datos simulados de órdenes/boletas
  const ordenesIniciales = [
    {
      id: 'B001-2024',
      numero: 'B001',
      fecha: new Date('2024-01-15T14:30:00'),
      cliente: 'Juan Pérez',
      rut: '12.345.678-9',
      email: 'juan.perez@email.com',
      vendedor: 'María González',
      items: [
        { producto: 'Polera Banda "Santaferia"', cantidad: 2, precio: 14990, codigo: 'MB001' },
        { producto: 'Entrada General Zona A', cantidad: 1, precio: 12000, codigo: 'EN001' }
      ],
      subtotal: 41980,
      iva: 7976,
      total: 49956,
      estado: 'completada',
      metodoPago: 'Tarjeta Débito',
      numeroTransaccion: 'TX-789456'
    },
    {
      id: 'B002-2024',
      fecha: new Date('2024-01-14T16:45:00'),
      numero: 'B002',
      cliente: 'Ana Silva',
      rut: '23.456.789-0',
      email: 'ana.silva@email.com',
      vendedor: 'Carlos López',
      items: [
        { producto: 'Vale "Terremoto"', cantidad: 5, precio: 4000, codigo: 'TC001' },
        { producto: 'Pañuelo Bordado', cantidad: 1, precio: 5990, codigo: 'PQ001' },
        { producto: 'Vale "Empanada"', cantidad: 3, precio: 3000, codigo: 'TC002' }
      ],
      subtotal: 35990,
      iva: 6838,
      total: 42828,
      estado: 'completada',
      metodoPago: 'Efectivo',
      numeroTransaccion: 'EF-123456'
    },
    {
      id: 'B003-2024',
      fecha: new Date('2024-01-14T11:20:00'),
      numero: 'B003',
      cliente: 'Roberto Díaz',
      rut: '34.567.890-1',
      email: 'roberto.diaz@email.com',
      vendedor: 'María González',
      items: [
        { producto: 'Entrada VIP', cantidad: 2, precio: 25000, codigo: 'EN002' },
        { producto: 'Polera "Ráfaga"', cantidad: 1, precio: 14990, codigo: 'MB002' }
      ],
      subtotal: 64990,
      iva: 12348,
      total: 77338,
      estado: 'pendiente',
      metodoPago: 'Transferencia',
      numeroTransaccion: 'TR-789123'
    },
    {
      id: 'B004-2024',
      fecha: new Date('2024-01-13T09:15:00'),
      numero: 'B004',
      cliente: 'Sofía Martínez',
      rut: '45.678.901-2',
      email: 'sofia.martinez@email.com',
      vendedor: 'Pedro Sánchez',
      items: [
        { producto: 'Chupalla de Paja', cantidad: 1, precio: 9990, codigo: 'VH001' },
        { producto: 'Vale "Mote con Huesillo"', cantidad: 2, precio: 2500, codigo: 'TC003' }
      ],
      subtotal: 14990,
      iva: 2848,
      total: 17838,
      estado: 'cancelada',
      metodoPago: 'Tarjeta Crédito',
      numeroTransaccion: 'TC-456789'
    },
    {
      id: 'B005-2024',
      fecha: new Date('2024-01-12T18:30:00'),
      numero: 'B005',
      cliente: 'Diego Herrera',
      rut: '56.789.012-3',
      email: 'diego.herrera@email.com',
      vendedor: 'Carlos López',
      items: [
        { producto: 'Poncho Tradicional', cantidad: 1, precio: 39990, codigo: 'VH002' },
        { producto: 'Entrada General Zona A', cantidad: 4, precio: 12000, codigo: 'EN001' }
      ],
      subtotal: 87990,
      iva: 16718,
      total: 104708,
      estado: 'completada',
      metodoPago: 'Efectivo',
      numeroTransaccion: 'EF-789456'
    }
  ];

  // Estados de orden
  const estadosOrden = [
    { valor: 'todos', label: 'Todos los estados', color: 'secondary' },
    { valor: 'completada', label: 'Completada', color: 'success' },
    { valor: 'pendiente', label: 'Pendiente', color: 'warning' },
    { valor: 'cancelada', label: 'Cancelada', color: 'danger' }
  ];

  // Cargar órdenes desde localStorage o datos iniciales
  const cargarOrdenes = () => {
    const ordenesGuardadas = localStorage.getItem('ordenes');
    if (ordenesGuardadas) {
      const ordenesParsed = JSON.parse(ordenesGuardadas);
      return ordenesParsed.map(orden => ({
        ...orden,
        fecha: new Date(orden.fecha)
      }));
    }
    return ordenesIniciales;
  };

  useEffect(() => {
    const ordenesData = cargarOrdenes();
    setOrdenes(ordenesData);
    setFilteredOrdenes(ordenesData);
  }, []);

  useEffect(() => {
    let filtered = ordenes;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(orden => 
        orden.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.rut.includes(searchTerm) ||
        orden.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (estadoFilter !== 'todos') {
      filtered = filtered.filter(orden => orden.estado === estadoFilter);
    }

    // Filtro por fecha
    if (fechaFilter) {
      const filterDate = new Date(fechaFilter);
      filtered = filtered.filter(orden => 
        orden.fecha.toDateString() === filterDate.toDateString()
      );
    }

    // Ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'cliente':
          return a.cliente.localeCompare(b.cliente);
        case 'total':
          return b.total - a.total;
        case 'numero':
          return a.numero.localeCompare(b.numero);
        case 'fecha':
        default:
          return b.fecha - a.fecha; // Más reciente primero
      }
    });

    setFilteredOrdenes(filtered);
  }, [searchTerm, estadoFilter, fechaFilter, sortBy, ordenes]);

  // Formatear fecha
  const formatFecha = (fecha) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  // Obtener color de badge según estado
  const getEstadoColor = (estado) => {
    const estadoObj = estadosOrden.find(e => e.valor === estado);
    return estadoObj ? estadoObj.color : 'secondary';
  };

  // Obtener label legible para el estado
  const getEstadoLabel = (estado) => {
    const estadoObj = estadosOrden.find(e => e.valor === estado);
    return estadoObj ? estadoObj.label : estado;
  };

  // Mostrar boleta
  const handleShowBoleta = (orden) => {
    setSelectedOrden(orden);
    setShowBoletaModal(true);
  };

  // Exportar a PDF (simulado)
  const exportarPDF = (orden) => {
    // En una implementación real, aquí usarías una librería como jsPDF
    alert(`Generando PDF para boleta ${orden.numero}...\n\nEn una implementación real, se descargaría el PDF.`);
    
    // Simulación de descarga
    const blob = new Blob([`Boleta: ${orden.numero}\nCliente: ${orden.cliente}\nTotal: ${formatPrice(orden.total)}`], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleta-${orden.numero}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Exportar todas las órdenes filtradas a CSV
  const exportarCSV = () => {
    if (filteredOrdenes.length === 0) {
      alert('No hay órdenes para exportar');
      return;
    }

    const headers = ['Número', 'Fecha', 'Cliente', 'RUT', 'Total', 'Estado', 'Método Pago'];
    const csvData = filteredOrdenes.map(orden => [
      orden.numero,
      formatFecha(orden.fecha),
      orden.cliente,
      orden.rut,
      orden.total,
      getEstadoLabel(orden.estado),
      orden.metodoPago
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordenes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setEstadoFilter('todos');
    setFechaFilter('');
    setSortBy('fecha');
  };

  // Estadísticas
  const totalVentas = ordenes
    .filter(orden => orden.estado === 'completada')
    .reduce((sum, orden) => sum + orden.total, 0);

  const ordenesHoy = ordenes.filter(orden => 
    orden.fecha.toDateString() === new Date().toDateString()
  ).length;

  const ordenesCompletadas = ordenes.filter(orden => 
    orden.estado === 'completada'
  ).length;

  return (
    <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
      {/* Header y Estadísticas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1" style={{ color: '#333', fontWeight: '600' }}>
                <i className="bi bi-receipt me-2"></i>
                Órdenes y Boletas
              </h1>
              <p className="text-muted mb-0">Gestión y visualización de todas las transacciones</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={exportarCSV}
                disabled={filteredOrdenes.length === 0}
                title="Exportar a CSV"
              >
                <i className="bi bi-file-earmark-spreadsheet me-1"></i> Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="col-md-4">
          <div className="card bg-primary bg-opacity-10 border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-primary">{formatPrice(totalVentas)}</h3>
                  <p className="mb-0 text-muted">Ventas totales</p>
                </div>
                <i className="bi bi-currency-dollar text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-success">{ordenesCompletadas}</h3>
                  <p className="mb-0 text-muted">Órdenes completadas</p>
                </div>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info bg-opacity-10 border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-info">{ordenesHoy}</h3>
                  <p className="mb-0 text-muted">Órdenes hoy</p>
                </div>
                <i className="bi bi-calendar-day text-info" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
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
                      placeholder="Buscar por cliente, número o RUT..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Filtro por estado */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Estado</label>
                  <select 
                    className="form-select"
                    value={estadoFilter}
                    onChange={(e) => setEstadoFilter(e.target.value)}
                  >
                    {estadosOrden.map(estado => (
                      <option key={estado.valor} value={estado.valor}>{estado.label}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por fecha */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFilter}
                    onChange={(e) => setFechaFilter(e.target.value)}
                  />
                </div>

                {/* Ordenamiento */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Ordenar por</label>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="fecha">Fecha (reciente)</option>
                    <option value="numero">Número</option>
                    <option value="cliente">Cliente</option>
                    <option value="total">Total</option>
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
                  </div>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Mostrando <strong>{filteredOrdenes.length}</strong> de <strong>{ordenes.length}</strong> órdenes
                      {estadoFilter !== 'todos' && ` • Estado: ${getEstadoLabel(estadoFilter)}`}
                      {fechaFilter && ` • Fecha: ${new Date(fechaFilter).toLocaleDateString('es-CL')}`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    {filteredOrdenes.length !== ordenes.length && (
                      <button 
                        className="btn btn-sm btn-link text-muted p-0"
                        onClick={clearFilters}
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Órdenes */}
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
              <h3 className="card-title mb-0" style={{ color: '#333', fontSize: '1.25rem' }}>
                Listado de Órdenes
              </h3>
            </div>

            <div className="card-body table-responsive p-0" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <table className="table table-hover text-nowrap mb-0">
                <thead style={{ backgroundColor: 'rgba(248,249,250,0.9)' }}>
                  <tr>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Número</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Fecha</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Cliente</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>RUT</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Items</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Total</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Estado</th>
                    <th style={{ 
                      width: '150px', 
                      border: 'none', 
                      padding: '12px 16px', 
                      fontWeight: '600', 
                      color: '#333',
                      textAlign: 'center'
                    }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrdenes.length > 0 ? (
                    filteredOrdenes.map(orden => (
                      <tr key={orden.id} style={{ 
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666', fontWeight: '500' }}>
                          {orden.numero}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>
                          {formatFecha(orden.fecha)}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>
                          {orden.cliente}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>
                          {orden.rut}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>
                          <small>{orden.items.length} producto(s)</small>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>
                          {formatPrice(orden.total)}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <span className={`badge bg-${getEstadoColor(orden.estado)}`}>
                            {getEstadoLabel(orden.estado)}
                          </span>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', textAlign: 'center' }}>
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleShowBoleta(orden)}
                              title="Ver boleta"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => exportarPDF(orden)}
                              title="Exportar PDF"
                            >
                              <i className="bi bi-file-pdf"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5" style={{ border: 'none' }}>
                        <i className="bi bi-receipt display-4 text-muted d-block mb-3"></i>
                        <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>No se encontraron órdenes</p>
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

      {/* Modal de Boleta */}
      {showBoletaModal && selectedOrden && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-receipt me-2"></i>
                  Boleta {selectedOrden.numero}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowBoletaModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Encabezado de la boleta */}
                <div className="text-center mb-4">
                  <h4 style={{ color: '#333', fontWeight: 'bold' }}>Fonda Duoc</h4>
                  <p className="text-muted mb-1">RUT: 76.123.456-7</p>
                  <p className="text-muted mb-1">Av. Ejemplo 123, Santiago</p>
                  <p className="text-muted">Fono: +56 2 2345 6789</p>
                </div>

                {/* Información de la boleta */}
                <div className="row mb-4">
                  <div className="col-6">
                    <strong>Boleta N°:</strong> {selectedOrden.numero}<br/>
                    <strong>Fecha:</strong> {formatFecha(selectedOrden.fecha)}<br/>
                    <strong>Vendedor:</strong> {selectedOrden.vendedor}
                  </div>
                  <div className="col-6">
                    <strong>Cliente:</strong> {selectedOrden.cliente}<br/>
                    <strong>RUT:</strong> {selectedOrden.rut}<br/>
                    <strong>Email:</strong> {selectedOrden.email}
                  </div>
                </div>

                {/* Items de la boleta */}
                <div className="table-responsive mb-4">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '50%' }}>Producto</th>
                        <th style={{ width: '15%' }}>Cantidad</th>
                        <th style={{ width: '15%' }}>Precio Unit.</th>
                        <th style={{ width: '15%' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrden.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {item.producto}
                            <br/>
                            <small className="text-muted">Código: {item.codigo}</small>
                          </td>
                          <td>{item.cantidad}</td>
                          <td>{formatPrice(item.precio)}</td>
                          <td>{formatPrice(item.cantidad * item.precio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totales */}
                <div className="row justify-content-end">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Subtotal:</strong></td>
                          <td className="text-end">{formatPrice(selectedOrden.subtotal)}</td>
                        </tr>
                        <tr>
                          <td><strong>IVA (19%):</strong></td>
                          <td className="text-end">{formatPrice(selectedOrden.iva)}</td>
                        </tr>
                        <tr className="table-active">
                          <td><strong>Total:</strong></td>
                          <td className="text-end"><strong>{formatPrice(selectedOrden.total)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Información de pago */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <strong>Método de Pago:</strong> {selectedOrden.metodoPago}<br/>
                      <strong>N° Transacción:</strong> {selectedOrden.numeroTransaccion}<br/>
                      <strong>Estado:</strong> <span className={`badge bg-${getEstadoColor(selectedOrden.estado)}`}>
                        {getEstadoLabel(selectedOrden.estado)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowBoletaModal(false)}
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    exportarPDF(selectedOrden);
                    setShowBoletaModal(false);
                  }}
                >
                  <i className="bi bi-file-pdf me-1"></i> Exportar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordenes;