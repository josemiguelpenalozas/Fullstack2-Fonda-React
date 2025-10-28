import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export const registrarActividad = (tipo, descripcion, usuario, detalles = {}) => {
  const nuevaActividad = {
    id: Date.now(),
    tipo,
    descripcion,
    usuario,
    fecha: new Date(),
    detalles
  };

  
  const actividadesGuardadas = localStorage.getItem('actividades');
  let actividadesActuales = [];
  
  if (actividadesGuardadas) {
    const actividadesParsed = JSON.parse(actividadesGuardadas);
    actividadesActuales = actividadesParsed.map(act => ({
      ...act,
      fecha: new Date(act.fecha)
    }));
  } else {
    
    actividadesActuales = [
      {
        id: 1,
        tipo: 'producto_creado',
        descripcion: 'Producto "Polera Banda Santaferia" creado',
        usuario: 'admin@fondaduoc.cl',
        fecha: new Date('2024-01-15T10:30:00'),
        detalles: { codigo: 'MB001', categoria: 'Merchandising de Bandas' }
      },
      {
        id: 2,
        tipo: 'producto_editado',
        descripcion: 'Producto "Entrada General Zona A" modificado',
        usuario: 'admin@fondaduoc.cl',
        fecha: new Date('2024-01-15T11:15:00'),
        detalles: { cambios: ['precio', 'stock'], codigo: 'EN001' }
      },
      {
        id: 3,
        tipo: 'producto_eliminado',
        descripcion: 'Producto "Poncho Tradicional" eliminado',
        usuario: 'admin@fondaduoc.cl',
        fecha: new Date('2024-01-14T16:45:00'),
        detalles: { codigo: 'VH003', motivo: 'Baja rotación' }
      },
      {
        id: 4,
        tipo: 'usuario_creado',
        descripcion: 'Usuario "vendedor1@fondala.com" creado',
        usuario: 'admin@fondaduoc.cl',
        fecha: new Date('2024-01-14T14:20:00'),
        detalles: { rol: 'vendedor', permisos: ['ventas', 'consulta'] }
      },
      {
        id: 5,
        tipo: 'stock_ajustado',
        descripcion: 'Stock crítico en producto "Vale Terremoto"',
        usuario: 'sistema',
        fecha: new Date('2024-01-14T09:10:00'),
        detalles: { codigo: 'TC002', stock_actual: 5, stock_critico: 10 }
      }
    ];
  }

  const nuevasActividades = [nuevaActividad, ...actividadesActuales];
  
  
  localStorage.setItem('actividades', JSON.stringify(nuevasActividades));
  
  return nuevaActividad;
};

const Actividad = () => {
  const [actividades, setActividades] = useState([]);
  const [filteredActividades, setFilteredActividades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [usuarioFilter, setUsuarioFilter] = useState('todos');
  const [fechaFilter, setFechaFilter] = useState('');
  const [sortBy, setSortBy] = useState('fecha');

  
  const actividadesIniciales = [
    {
      id: 1,
      tipo: 'producto_creado',
      descripcion: 'Producto "Polera Banda Santaferia" creado',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-15T10:30:00'),
      detalles: { codigo: 'MB001', categoria: 'Merchandising de Bandas' }
    },
    {
      id: 2,
      tipo: 'producto_editado',
      descripcion: 'Producto "Entrada General Zona A" modificado',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-15T11:15:00'),
      detalles: { cambios: ['precio', 'stock'], codigo: 'EN001' }
    },
    {
      id: 3,
      tipo: 'producto_eliminado',
      descripcion: 'Producto "Poncho Tradicional" eliminado',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-14T16:45:00'),
      detalles: { codigo: 'VH003', motivo: 'Baja rotación' }
    },
    {
      id: 4,
      tipo: 'usuario_creado',
      descripcion: 'Usuario "vendedor1@fondala.com" creado',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-14T14:20:00'),
      detalles: { rol: 'vendedor', permisos: ['ventas', 'consulta'] }
    },
    {
      id: 5,
      tipo: 'stock_ajustado',
      descripcion: 'Stock crítico en producto "Vale Terremoto"',
      usuario: 'sistema',
      fecha: new Date('2024-01-14T09:10:00'),
      detalles: { codigo: 'TC002', stock_actual: 5, stock_critico: 10 }
    },
    {
      id: 6,
      tipo: 'producto_creado',
      descripcion: 'Producto "Pañuelo Bordado" creado',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-13T15:30:00'),
      detalles: { codigo: 'PQ001', categoria: 'Pañuelos de Cueca' }
    },
    {
      id: 7,
      tipo: 'usuario_editado',
      descripcion: 'Permisos de usuario "vendedor2@fondala.com" actualizados',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-13T11:45:00'),
      detalles: { permisos_agregados: ['reportes'], permisos_eliminados: ['configuracion'] }
    },
    {
      id: 8,
      tipo: 'stock_ajustado',
      descripcion: 'Reabastecimiento de producto "Polera Ráfaga"',
      usuario: 'admin@fondaduoc.cl',
      fecha: new Date('2024-01-12T17:20:00'),
      detalles: { codigo: 'MB002', stock_anterior: 8, stock_nuevo: 50 }
    }
  ];

  
  const tiposActividad = [
    { valor: 'todos', label: 'Todos los tipos' },
    { valor: 'producto_creado', label: 'Producto creado' },
    { valor: 'producto_editado', label: 'Producto editado' },
    { valor: 'producto_eliminado', label: 'Producto eliminado' },
    { valor: 'usuario_creado', label: 'Usuario creado' },
    { valor: 'usuario_editado', label: 'Usuario editado' },
    { valor: 'usuario_eliminado', label: 'Usuario eliminado' },
    { valor: 'stock_ajustado', label: 'Stock ajustado' },
    { valor: 'sesion_iniciada', label: 'Sesión iniciada' },
    { valor: 'sesion_cerrada', label: 'Sesión cerrada' }
  ];

  
  const usuariosUnicos = [...new Set(actividadesIniciales.map(a => a.usuario))];

  
  const cargarActividades = () => {
    const actividadesGuardadas = localStorage.getItem('actividades');
    if (actividadesGuardadas) {
      const actividadesParsed = JSON.parse(actividadesGuardadas);
      
      return actividadesParsed.map(act => ({
        ...act,
        fecha: new Date(act.fecha)
      }));
    }
    return actividadesIniciales;
  };

  
  const guardarActividades = (actividadesData) => {
    localStorage.setItem('actividades', JSON.stringify(actividadesData));
  };

  useEffect(() => {
    const actividadesData = cargarActividades();
    setActividades(actividadesData);
    setFilteredActividades(actividadesData);
  }, []);

  useEffect(() => {
    let filtered = actividades;

    
    if (searchTerm) {
      filtered = filtered.filter(actividad => 
        actividad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (actividad.detalles.codigo && actividad.detalles.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    
    if (tipoFilter !== 'todos') {
      filtered = filtered.filter(actividad => actividad.tipo === tipoFilter);
    }

    
    if (usuarioFilter !== 'todos') {
      filtered = filtered.filter(actividad => actividad.usuario === usuarioFilter);
    }

    
    if (fechaFilter) {
      const filterDate = new Date(fechaFilter);
      filtered = filtered.filter(actividad => 
        actividad.fecha.toDateString() === filterDate.toDateString()
      );
    }

    
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'tipo':
          return a.tipo.localeCompare(b.tipo);
        case 'usuario':
          return a.usuario.localeCompare(b.usuario);
        case 'fecha':
        default:
          return b.fecha - a.fecha; 
      }
    });

    setFilteredActividades(filtered);
  }, [searchTerm, tipoFilter, usuarioFilter, fechaFilter, sortBy, actividades]);

  
  const formatFecha = (fecha) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  
  const formatFechaRelativa = (fecha) => {
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace unos segundos';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return formatFecha(fecha);
  };

  
  const getIcono = (tipo) => {
    switch (tipo) {
      case 'producto_creado':
        return 'bi-plus-circle-fill text-success';
      case 'producto_editado':
        return 'bi-pencil-fill text-warning';
      case 'producto_eliminado':
        return 'bi-trash-fill text-danger';
      case 'usuario_creado':
        return 'bi-person-plus-fill text-info';
      case 'usuario_editado':
        return 'bi-person-gear text-primary';
      case 'usuario_eliminado':
        return 'bi-person-dash-fill text-danger';
      case 'stock_ajustado':
        return 'bi-box-arrow-in-down text-warning';
      case 'sesion_iniciada':
        return 'bi-box-arrow-in-right text-success';
      case 'sesion_cerrada':
        return 'bi-box-arrow-right text-secondary';
      default:
        return 'bi-activity text-muted';
    }
  };

  
  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'producto_creado':
      case 'usuario_creado':
      case 'sesion_iniciada':
        return 'success';
      case 'producto_editado':
      case 'usuario_editado':
      case 'stock_ajustado':
        return 'warning';
      case 'producto_eliminado':
      case 'usuario_eliminado':
        return 'danger';
      case 'sesion_cerrada':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  
  const getTipoLabel = (tipo) => {
    const tipoObj = tiposActividad.find(t => t.valor === tipo);
    return tipoObj ? tipoObj.label : tipo;
  };

  
  const clearFilters = () => {
    setSearchTerm('');
    setTipoFilter('todos');
    setUsuarioFilter('todos');
    setFechaFilter('');
    setSortBy('fecha');
  };

  
  const limpiarHistorial = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar el historial de actividades? Se mantendrán solo los últimos 100 registros.')) {
      const actividadesLimitadas = actividades.slice(0, 100);
      setActividades(actividadesLimitadas);
      guardarActividades(actividadesLimitadas);
    }
  };

  
  const exportarActividades = () => {
    const datosExportar = actividades.map(act => ({
      ...act,
      fecha: formatFecha(act.fecha)
    }));
    
    const blob = new Blob([JSON.stringify(datosExportar, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `actividades-fondala-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  
  const actividadesHoy = actividades.filter(act => 
    act.fecha.toDateString() === new Date().toDateString()
  ).length;

  const actividadesUsuario = actividades.filter(act => 
    act.usuario === 'admin@fondaduoc.cl'
  ).length;

  const actividadesProductos = actividades.filter(act => 
    act.tipo.includes('producto')
  ).length;

  return (
    <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
      {/* Header y Estadísticas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={exportarActividades}
                title="Exportar actividades"
              >
                <i className="bi bi-download me-1"></i> Exportar
              </button>
              <button 
                className="btn btn-outline-danger"
                onClick={limpiarHistorial}
                title="Limpiar historial"
              >
                <i className="bi bi-trash me-1"></i> Limpiar
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
                  <h3 className="text-primary">{actividadesHoy}</h3>
                  <p className="mb-0 text-muted">Actividades hoy</p>
                </div>
                <i className="bi bi-calendar-day text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-success">{actividadesProductos}</h3>
                  <p className="mb-0 text-muted">Acciones productos</p>
                </div>
                <i className="bi bi-box-seam text-success" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info bg-opacity-10 border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-info">{actividadesUsuario}</h3>
                  <p className="mb-0 text-muted">Mis acciones</p>
                </div>
                <i className="bi bi-person-check text-info" style={{ fontSize: '2rem' }}></i>
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
                      placeholder="Buscar en actividades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Filtro por tipo */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Tipo</label>
                  <select 
                    className="form-select"
                    value={tipoFilter}
                    onChange={(e) => setTipoFilter(e.target.value)}
                  >
                    {tiposActividad.map(tipo => (
                      <option key={tipo.valor} value={tipo.valor}>{tipo.label}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por usuario */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Usuario</label>
                  <select 
                    className="form-select"
                    value={usuarioFilter}
                    onChange={(e) => setUsuarioFilter(e.target.value)}
                  >
                    <option value="todos">Todos los usuarios</option>
                    {usuariosUnicos.map(usuario => (
                      <option key={usuario} value={usuario}>{usuario}</option>
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
                    <option value="tipo">Tipo</option>
                    <option value="usuario">Usuario</option>
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="col-md-1 d-flex align-items-end">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                    title="Limpiar filtros"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Mostrando <strong>{filteredActividades.length}</strong> de <strong>{actividades.length}</strong> actividades
                      {tipoFilter !== 'todos' && ` • Tipo: ${getTipoLabel(tipoFilter)}`}
                      {usuarioFilter !== 'todos' && ` • Usuario: ${usuarioFilter}`}
                      {fechaFilter && ` • Fecha: ${new Date(fechaFilter).toLocaleDateString('es-CL')}`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    {filteredActividades.length !== actividades.length && (
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

      {/* Lista de Actividades */}
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
                Historial de Actividades
              </h3>
            </div>

            <div className="card-body p-0" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
              {filteredActividades.length > 0 ? (
                <div className="list-group list-group-flush">
                  {filteredActividades.map(actividad => (
                    <div key={actividad.id} className="list-group-item border-0" style={{ 
                      padding: '1.25rem',
                      borderBottom: '1px solid rgba(0,0,0,0.05) !important',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <div className="d-flex align-items-start">
                        {/* Icono */}
                        <div className="flex-shrink-0 me-3">
                          <i className={`bi ${getIcono(actividad.tipo)}`} style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        
                        {/* Contenido */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-1" style={{ color: '#333', fontWeight: '500' }}>
                                {actividad.descripcion}
                              </h6>
                              <div className="d-flex align-items-center gap-2">
                                <span className={`badge bg-${getBadgeColor(actividad.tipo)}`}>
                                  {getTipoLabel(actividad.tipo)}
                                </span>
                                <small className="text-muted">por {actividad.usuario}</small>
                              </div>
                            </div>
                            <small className="text-muted text-nowrap">
                              {formatFechaRelativa(actividad.fecha)}
                            </small>
                          </div>
                          
                          {/* Detalles adicionales */}
                          {Object.keys(actividad.detalles).length > 0 && (
                            <div className="mt-2">
                              <small className="text-muted">
                                {actividad.detalles.codigo && `Código: ${actividad.detalles.codigo} • `}
                                {actividad.detalles.categoria && `Categoría: ${actividad.detalles.categoria} • `}
                                {actividad.detalles.cambios && `Cambios: ${actividad.detalles.cambios.join(', ')}`}
                                {actividad.detalles.motivo && `Motivo: ${actividad.detalles.motivo}`}
                                {actividad.detalles.rol && `Rol: ${actividad.detalles.rol}`}
                                {actividad.detalles.stock_actual && `Stock actual: ${actividad.detalles.stock_actual}`}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-activity display-4 text-muted d-block mb-3"></i>
                  <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>No se encontraron actividades</p>
                  <small className="text-muted">Intenta ajustar los filtros de búsqueda</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actividad;