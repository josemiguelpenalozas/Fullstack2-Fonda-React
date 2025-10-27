import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usuarios as usuariosIniciales } from '../../data/admin/usuarios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('id');
  
  // Estados para modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rut: '',
    rol: 'usuario'
  });
  const [errors, setErrors] = useState({});

  const historialClientes = {
    1: [ // ID del usuario
      {
        id: 1,
        tipo: 'compra',
        descripcion: 'Compra realizada - Boleta B001',
        fecha: new Date('2024-01-15T14:30:00'),
        monto: 49956,
        items: ['Polera Banda "Santaferia"', 'Entrada General Zona A'],
        estado: 'completada'
      },
      {
        id: 2,
        tipo: 'consulta',
        descripcion: 'Consulta sobre productos',
        fecha: new Date('2024-01-10T11:20:00'),
        monto: 0,
        items: [],
        estado: 'atendida'
      }
    ],
    2: [
      {
        id: 1,
        tipo: 'compra',
        descripcion: 'Compra realizada - Boleta B002',
        fecha: new Date('2024-01-14T16:45:00'),
        monto: 42828,
        items: ['Vale "Terremoto"', 'Pañuelo Bordado', 'Vale "Empanada"'],
        estado: 'completada'
      },
      {
        id: 2,
        tipo: 'devolucion',
        descripcion: 'Devolución parcial - Vale "Empanada"',
        fecha: new Date('2024-01-13T09:15:00'),
        monto: -3000,
        items: ['Vale "Empanada"'],
        estado: 'procesada'
      }
    ],
    3: [
      {
        id: 1,
        tipo: 'compra',
        descripcion: 'Compra realizada - Boleta B003',
        fecha: new Date('2024-01-14T11:20:00'),
        monto: 77338,
        items: ['Entrada VIP', 'Polera "Ráfaga"'],
        estado: 'pendiente'
      }
    ]
  };

  // Cargar usuarios desde localStorage o JSON inicial
  const cargarUsuarios = () => {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      return JSON.parse(usuariosGuardados);
    }
    return usuariosIniciales;
  };

  // Guardar usuarios en localStorage
  const guardarUsuarios = (usuarios) => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  };

  useEffect(() => {
    const usuarios = cargarUsuarios();
    setUsers(usuarios);
    setFilteredUsers(usuarios);
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rut.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, roleFilter, sortBy, users]);

  // Validaciones
  const validarRUT = (rut) => {
    if (!rut) return false;
    
    // Limpiar RUT
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length < 2) return false;

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    // Calcular DV esperado
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dvCalculado === dv;
  };

  const validarEmail = (email) => {
    const dominiosPermitidos = ['@duocuc.cl', '@fondaduoc.cl'];
    return dominiosPermitidos.some(dominio => email.endsWith(dominio));
  };

  const validarFormulario = () => {
  const nuevosErrores = {};

  if (!formData.nombre.trim()) {
    nuevosErrores.nombre = 'El nombre es obligatorio';
  } else if (formData.nombre.trim().length < 3) {
    nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!formData.email.trim()) {
    nuevosErrores.email = 'El email es obligatorio';
  } else if (!validarEmail(formData.email)) {
    nuevosErrores.email = 'El email debe terminar en @duocuc.cl o @fondaduoc.cl';
  }

  // Solo validar RUT cuando se está agregando un nuevo usuario
  if (showAddModal && !formData.rut.trim()) {
    nuevosErrores.rut = 'El RUT es obligatorio';
  } else if (showAddModal && !validarRUT(formData.rut)) {
    nuevosErrores.rut = 'El RUT no es válido';
  }

  setErrors(nuevosErrores);
  return Object.keys(nuevosErrores).length === 0;
};

  // Handlers de modales
  const handleOpenAddModal = () => {
    setFormData({
      nombre: '',
      email: '',
      rut: '',
      rol: 'usuario'
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      rut: user.rut,
      rol: user.rol
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleOpenHistorialModal = (user) => {
    setSelectedUser(user);
    setShowHistorialModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowHistorialModal(false);
    setSelectedUser(null);
    setErrors({});
  };

  const getHistorialUsuario = () => {
    if (!selectedUser) return [];
    return historialClientes[selectedUser.id_usuario] || [];
  };

  const formatFecha = (fecha) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const getIconoHistorial = (tipo) => {
    switch (tipo) {
      case 'compra':
        return 'bi-cart-check text-success';
      case 'consulta':
        return 'bi-chat-dots text-info';
      case 'devolucion':
        return 'bi-arrow-return-left text-warning';
      default:
        return 'bi-activity text-muted';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada':
      case 'atendida':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'procesada':
        return 'info';
      case 'cancelada':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
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
    // Agregar nuevo usuario
    const nuevoUsuario = {
      id_usuario: Math.max(...users.map(u => u.id_usuario), 0) + 1,
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      rut: formData.rut,
      rol: formData.rol
    };

    const updatedUsers = [...users, nuevoUsuario];
    setUsers(updatedUsers);
    guardarUsuarios(updatedUsers);
  } else if (showEditModal && selectedUser) {
    // Editar usuario existente - NO modificar el RUT
    const updatedUsers = users.map(user =>
      user.id_usuario === selectedUser.id_usuario
        ? { 
            ...user, 
            nombre: formData.nombre.trim(),
            email: formData.email.trim().toLowerCase(),
            rol: formData.rol 
          }
        : user
    );
    setUsers(updatedUsers);
    guardarUsuarios(updatedUsers);
  }

  handleCloseModals();
};

  const handleDeleteUser = (id) => {
    const user = users.find(u => u.id_usuario === id);
    if (user.rol === 'admin') {
      alert('No se puede eliminar al administrador principal');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.nombre}"?`)) {
      const updatedUsers = users.filter(user => user.id_usuario !== id);
      setUsers(updatedUsers);
      guardarUsuarios(updatedUsers);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('todos');
    setSortBy('id');
  };

  const resetToDefault = () => {
    if (window.confirm('¿Restaurar lista de usuarios a los valores por defecto?')) {
      setUsers(usuariosIniciales);
      guardarUsuarios(usuariosIniciales);
    }
  };

  // Formatear RUT mientras se escribe
  const formatearRUT = (rut) => {
    // Remover todo excepto números y K
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    
    if (rutLimpio.length === 0) return '';
    
    // Separar cuerpo y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    // Formatear cuerpo con puntos
    let cuerpoFormateado = cuerpo
      .split('')
      .reverse()
      .join('')
      .replace(/(\d{3})/g, '$1.')
      .split('')
      .reverse()
      .join('')
      .replace(/^\./, '');
    
    return cuerpoFormateado + '-' + dv;
  };

  const handleRUTChange = (value) => {
    const rutFormateado = formatearRUT(value);
    handleFormChange('rut', rutFormateado);
  };

  useEffect(() => {
  let filtered = users;

  // Filtro por búsqueda
  if (searchTerm) {
    filtered = filtered.filter(user => 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rut.includes(searchTerm)
    );
  }

  // Filtro por rol
  if (roleFilter !== 'todos') {
    filtered = filtered.filter(user => user.rol === roleFilter);
  }

  // Ordenamiento
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'nombre':
        return a.nombre.localeCompare(b.nombre);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'rol':
        return a.rol.localeCompare(b.rol);
      case 'id':
      default:
        return a.id_usuario - b.id_usuario;
    }
  });

  setFilteredUsers(filtered);
}, [searchTerm, roleFilter, sortBy, users]);

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
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted">Búsqueda</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre, email o RUT..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Filtro por rol */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Filtrar por Rol</label>
                  <select 
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="todos">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                  </select>
                </div>

                {/* Ordenamiento */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Ordenar por</label>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="id">ID</option>
                    <option value="nombre">Nombre</option>
                    <option value="email">Email</option>
                    <option value="rol">Rol</option>
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="col-md-2 d-flex align-items-end">
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
                      title="Agregar usuario"
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
                      Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios
                      {roleFilter !== 'todos' && ` • Filtrado por: ${roleFilter}`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    <div className="d-flex gap-2">
                      {filteredUsers.length !== users.length && (
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
                        title="Restaurar usuarios por defecto"
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

      {/* Tabla de usuarios */}
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
                  Listado de Usuarios
                </h3>
                
                {/* Información de filtros activos */}
                <div className="d-flex gap-2">
                  {roleFilter !== 'todos' && (
                    <span className="badge bg-primary">
                      Rol: {roleFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setRoleFilter('todos')}
                      ></button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="badge bg-info text-dark">
                      Búsqueda: {searchTerm}
                      <button 
                        className="btn-close ms-1"
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
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>ID</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Nombre</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Email</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>RUT</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Rol</th>
                    <th style={{ 
                      width: '180px', 
                      border: 'none', 
                      padding: '12px 16px', 
                      fontWeight: '600', 
                      color: '#333',
                      textAlign: 'center'
                    }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id_usuario} style={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>{user.id_usuario}</td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>{user.nombre}</td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>{user.email}</td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>{user.rut}</td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <span className={`badge ${user.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`} style={{ 
                            fontSize: '0.75em',
                            padding: '0.4em 0.8em',
                            fontWeight: '500'
                          }}>
                            {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                          </span>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', textAlign: 'center' }}>
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleOpenHistorialModal(user)}
                              title="Ver historial"
                              style={{ 
                                border: '1px solid #0dcaf0',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem'
                              }}
                            >
                              <i className="bi bi-clock-history"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleOpenEditModal(user)}
                              title="Editar usuario"
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
                              onClick={() => handleDeleteUser(user.id_usuario)}
                              disabled={user.rol === 'admin'}
                              title={user.rol === 'admin' ? 'No se puede eliminar al administrador principal' : 'Eliminar usuario'}
                              style={{ 
                                border: '1px solid #dc3545',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                opacity: user.rol === 'admin' ? 0.5 : 1
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5" style={{ border: 'none' }}>
                        <i className="bi bi-people display-4 text-muted d-block mb-3"></i>
                        <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>No se encontraron usuarios</p>
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

      {/* Modal de Historial del Cliente */}
      {showHistorialModal && selectedUser && (
        <>
          {/* Backdrop */}
          <div 
            className="modal-backdrop show" 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1050
            }}
          ></div>
          
          {/* Modal */}
          <div 
            className="modal show d-block" 
            tabIndex="-1" 
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1060,
              overflow: 'hidden'
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-clock-history me-2"></i>
                    Historial del Cliente: {selectedUser.nombre}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseModals}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Información del cliente */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Información del Cliente</h6>
                          <p className="mb-1"><strong>Nombre:</strong> {selectedUser.nombre}</p>
                          <p className="mb-1"><strong>Email:</strong> {selectedUser.email}</p>
                          <p className="mb-1"><strong>RUT:</strong> {selectedUser.rut}</p>
                          <p className="mb-0"><strong>Rol:</strong> <span className={`badge ${selectedUser.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {selectedUser.rol === 'admin' ? 'Administrador' : 'Usuario'}
                          </span></p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Resumen de Actividad</h6>
                          <p className="mb-1"><strong>Total de transacciones:</strong> {getHistorialUsuario().length}</p>
                          <p className="mb-1"><strong>Compras realizadas:</strong> {getHistorialUsuario().filter(h => h.tipo === 'compra').length}</p>
                          <p className="mb-0"><strong>Consultas:</strong> {getHistorialUsuario().filter(h => h.tipo === 'consulta').length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de historial */}
                  <h6 className="mb-3">Historial de Actividades</h6>
                  {getHistorialUsuario().length > 0 ? (
                    <div className="list-group">
                      {getHistorialUsuario().map(historial => (
                        <div key={historial.id} className="list-group-item">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 me-3">
                              <i className={`bi ${getIconoHistorial(historial.tipo)}`} style={{ fontSize: '1.5rem' }}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1" style={{ color: '#333', fontWeight: '500' }}>
                                    {historial.descripcion}
                                  </h6>
                                  <div className="d-flex align-items-center gap-2">
                                    <span className={`badge bg-${getEstadoColor(historial.estado)}`}>
                                      {historial.estado}
                                    </span>
                                    {historial.monto !== 0 && (
                                      <span className={`badge ${historial.monto > 0 ? 'bg-success' : 'bg-warning'}`}>
                                        {formatPrice(historial.monto)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <small className="text-muted text-nowrap">
                                  {formatFecha(historial.fecha)}
                                </small>
                              </div>
                              
                              {/* Items del historial */}
                              {historial.items && historial.items.length > 0 && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    <strong>Productos:</strong> {historial.items.join(', ')}
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-2">No hay historial registrado</p>
                      <small className="text-muted">Este usuario no tiene actividades registradas en el sistema</small>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModals}
                  >
                    <i className="bi bi-x-circle me-1"></i> Cerrar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={() => {
                      // todavia no se agrega esto
                      alert(`Exportando historial de ${selectedUser.nombre}...`);
                    }}
                  >
                    <i className="bi bi-download me-1"></i> Exportar Historial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Agregar Usuario */}
{showAddModal && (
  <>
    {/* Backdrop con animación */}
    <div 
      className="modal-backdrop show modal-backdrop-animation" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050
      }}
    ></div>
    
    {/* Modal con animación */}
    <div 
      className="modal show d-block modal-show" 
      tabIndex="-1" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1060,
        overflow: 'hidden'
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-animation">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-plus me-2"></i>
              Agregar Nuevo Usuario
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleCloseModals}
              style={{ transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            ></button>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Nombre Completo *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={formData.nombre}
                    onChange={(e) => handleFormChange('nombre', e.target.value)}
                    placeholder="Ingrese nombre completo"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback animate__animated animate__fadeIn">
                      {errors.nombre}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    placeholder="usuario@duocuc.cl"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback animate__animated animate__fadeIn">
                      {errors.email}
                    </div>
                  )}
                  <div className="form-text">Debe terminar en @duocuc.cl o @fondaduoc.cl</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">RUT *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                    value={formData.rut}
                    onChange={(e) => handleRUTChange(e.target.value)}
                    placeholder="12.345.678-9"
                    maxLength="12"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {errors.rut && (
                    <div className="invalid-feedback animate__animated animate__fadeIn">
                      {errors.rut}
                    </div>
                  )}
                  <div className="form-text">Formato: 12.345.678-9</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Rol *</label>
                  <select
                    className="form-select"
                    value={formData.rol}
                    onChange={(e) => handleFormChange('rol', e.target.value)}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <div className="form-text">Los administradores tienen acceso completo al sistema</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary btn-pulse" 
                onClick={handleCloseModals}
                style={{ transition: 'all 0.3s ease' }}
              >
                <i className="bi bi-x-circle me-1"></i> Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-pulse"
                style={{ transition: 'all 0.3s ease' }}
              >
                <i className="bi bi-check-circle me-1"></i> Crear Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
)}

{/* Modal Editar Usuario con Animaciones */}
{showEditModal && selectedUser && (
  <>
    {/* Backdrop con animación */}
    <div 
      className="modal-backdrop show modal-backdrop-animation" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050
      }}
    ></div>
    
    {/* Modal con animación */}
    <div 
      className="modal show d-block modal-show" 
      tabIndex="-1" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1060,
        overflow: 'hidden'
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-animation">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              <i className="bi bi-person-gear me-2"></i>
              Editar Usuario: {selectedUser.nombre}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCloseModals}
              style={{ transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            ></button>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="modal-body">
              {/* Información del usuario actual */}
              <div className="alert alert-info" style={{ animation: 'slideDown 0.4s ease-out' }}>
                <div className="row small">
                  <div className="col-6">
                    <strong>ID Usuario:</strong> {selectedUser.id_usuario}
                  </div>
                  <div className="col-6">
                    <strong>Rol actual:</strong> 
                    <span className={`badge ${selectedUser.rol === 'admin' ? 'bg-danger' : 'bg-primary'} ms-1`}>
                      {selectedUser.rol === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </div>
                </div>
                <div className="row small mt-2">
                  <div className="col-12">
                    <strong>RUT:</strong> {selectedUser.rut}
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Nombre Completo *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={formData.nombre}
                    onChange={(e) => handleFormChange('nombre', e.target.value)}
                    placeholder="Ingrese nombre completo"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback animate__animated animate__fadeIn">
                      {errors.nombre}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    placeholder="usuario@duocuc.cl"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback animate__animated animate__fadeIn">
                      {errors.email}
                    </div>
                  )}
                  <div className="form-text">Debe terminar en @duocuc.cl o @fondaduoc.cl</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">RUT (No editable)</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={selectedUser.rut}
                    disabled
                    style={{ cursor: 'not-allowed', opacity: 0.7 }}
                  />
                  <div className="form-text text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    El RUT no puede ser modificado por seguridad
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Rol *</label>
                  <select
                    className="form-select"
                    value={formData.rol}
                    onChange={(e) => handleFormChange('rol', e.target.value)}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <div className="form-text">
                    {selectedUser.rol !== formData.rol && (
                      <span className="text-warning animate__animated animate__pulse">
                        <i className="bi bi-exclamation-triangle me-1"></i> 
                        Se cambiará el rol del usuario de "{selectedUser.rol}" a "{formData.rol}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary btn-pulse" 
                onClick={handleCloseModals}
                style={{ transition: 'all 0.3s ease' }}
              >
                <i className="bi bi-x-circle me-1"></i> Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-warning btn-pulse"
                style={{ transition: 'all 0.3s ease' }}
              >
                <i className="bi bi-check-circle me-1"></i> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default Users;