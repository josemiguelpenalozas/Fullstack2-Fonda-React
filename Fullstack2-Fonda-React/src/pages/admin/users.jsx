import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usuarios } from '../../data/admin/usuarios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Cargar datos de usuarios
    setUsers(usuarios);
    setFilteredUsers(usuarios);
  }, []);

  useEffect(() => {
    // Filtrar usuarios según término de búsqueda
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
  }, [searchTerm, users]);

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

  return (
    <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
      {/* Encabezado de página */}
      <div className="row mb-3">
        <div className="col-sm-6">
          <h1 className="m-0" style={{ color: '#333', fontWeight: 'bold' }}>Gestión de Usuarios</h1>
        </div>
      </div>

      {/* Contenido principal */}
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
                  Listado de Usuarios Registrados
                </h3>
                
                <div className="card-tools">
                  <div className="input-group input-group-sm" style={{ width: '250px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar usuario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ 
                        border: '1px solid #ddd',
                        borderRadius: '4px 0 0 4px'
                      }}
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-default" style={{ 
                        border: '1px solid #ddd',
                        borderLeft: 'none',
                        borderRadius: '0 4px 4px 0'
                      }}>
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
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
                        <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>No se encontraron usuarios</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-footer clearfix" style={{ 
              backgroundColor: 'rgba(248,249,250,0.9)',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              padding: '1rem 1.25rem'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios
                </div>
                <button className="btn btn-primary" style={{
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontWeight: '500'
                }}>
                  <i className="bi bi-plus-circle me-2"></i> Agregar Nuevo Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;