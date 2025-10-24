import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usuarios } from '../../data/admin/usuarios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('id');

  useEffect(() => {
    // Cargar datos de usuarios
    setUsers(usuarios);
    setFilteredUsers(usuarios);
  }, []);

  useEffect(() => {
    // Aplicar filtros y ordenamiento
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

  const handleDeleteUser = (id) => {
    // Confirmar eliminación
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const updatedUsers = users.filter(user => user.id_usuario !== id);
      setUsers(updatedUsers);
    }
  };

  const handleEditUser = (user) => {
    // Aquí implementarías la lógica para editar el usuario
    alert(`Editar usuario: ${user.nombre}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('todos');
    setSortBy('id');
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
                      title="Agregar usuario"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios
                      {roleFilter !== 'todos' && ` • Filtrado por: ${roleFilter}`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    {filteredUsers.length !== users.length && (
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
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleEditUser(user)}
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
    </div>
  );
};

export default Users;