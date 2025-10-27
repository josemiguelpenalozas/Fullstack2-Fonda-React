import Sidebar from './Sidebar';
import { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import logo from '../../assets/admin/logoPNG.png'

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePopover, setActivePopover] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Datos del administrador
  const [adminProfile, setAdminProfile] = useState({
    nombres: 'Huaso',
    apellidos: 'Arellano',
    correo: 'admin@fondaduoc.cl',
    direccion: 'Av. Principal 123, Santiago, Chile',
    rut: '12.345.678-9',
    rol: 'Administrador Principal'
  });

  // Referencias para los popovers
  const notificationsRef = useRef(null);
  const chatRef = useRef(null);
  const profileRef = useRef(null);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const togglePopover = (popoverName) => {
    setActivePopover(activePopover === popoverName ? null : popoverName);
  };

  // Cerrar popovers al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current && !notificationsRef.current.contains(event.target) &&
        chatRef.current && !chatRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setActivePopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Datos de ejemplo para notificaciones
  const notifications = [
    { id: 1, type: 'success', title: 'Pedido completado', message: 'El pedido #12345 ha sido entregado', time: 'Hace 5 min', unread: true },
    { id: 2, type: 'warning', title: 'Stock bajo', message: 'Quedan 3 unidades de Polera Santaferia', time: 'Hace 1 hora', unread: true },
    { id: 3, type: 'info', title: 'Nuevo usuario', message: 'Juan Pérez se ha registrado', time: 'Hace 2 horas', unread: false },
    { id: 4, type: 'error', title: 'Problema de pago', message: 'Error en el pago del pedido #12346', time: 'Hace 3 horas', unread: false }
  ];

  // Datos de ejemplo para el chat
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'user', message: 'Hola, tengo un problema con mi envío', time: '10:30 AM', user: 'María González' },
    { id: 2, sender: 'admin', message: '¡Hola María! ¿En qué puedo ayudarte?', time: '10:31 AM', user: 'Soporte' },
    { id: 3, sender: 'user', message: 'Mi pedido #12345 debería haber llegado ayer pero aún no lo recibo', time: '10:32 AM', user: 'María González' },
    { id: 4, sender: 'admin', message: 'Déjame verificar el estado de tu envío...', time: '10:33 AM', user: 'Soporte' }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        sender: 'admin',
        message: newMessage,
        time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        user: 'Soporte'
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage('');
    }
  };

  // Función para abrir la modal de perfil
  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
    setActivePopover(null); // Cerrar el popover
  };

  // Función para cerrar la modal
  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setIsEditing(false);
  };

  // Función para manejar cambios en el formulario
  const handleProfileChange = (field, value) => {
    setAdminProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para guardar los cambios
  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar en la base de datos
    console.log('Perfil guardado:', adminProfile);
    setIsEditing(false);
    // Podrías agregar aquí una notificación de éxito
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    // Podrías resetear los datos aquí si es necesario
    setIsEditing(false);
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <div className="admin-layout d-flex">
      {/* Barra lateral */}
      <Sidebar collapsed={collapsed} />
      {/* Contenedor principal: NAV arriba y espacio para las paginas */}
      <div className={`flex-grow-1 main-content d-flex flex-column ${collapsed ? 'collapsed' : ''}`} style={{ minHeight: '100vh' }}>
        {/* Navbar superior */}
        <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${collapsed ? 'collapsed' : ''}`}>
          <div className="container-fluid d-flex align-items-center">
            {/* Bloque izquierdo: hamburguesa, logo y saludo */}
            <div className="d-flex align-items-center">
              {/* Botón hamburguesa */}
              <a
                className="nav-link"
                data-widget="pushmenu"
                href="#"
                role="button"
                onClick={e => { e.preventDefault(); toggleSidebar(); }}
                style={{ paddingRight: '0.6rem' }}
              >
                <i className="bi bi-list" style={{ fontSize: '2.1em' }}></i>
              </a>
              <img
                src={logo}
                alt="Logo Fonda Duoc"
                style={{ width: '80px', height: '60px', marginLeft: '0.5rem', marginRight: '0.8rem', objectFit: 'contain', borderRadius: '50px' }}
              />
              <span style={{
                fontWeight: 900,
                fontSize: '1.25rem',
                fontFamily: "'Montserrat', sans-serif",
                color: '#d32f2f',
                letterSpacing: '1.5px'
              }}>
                👋 ¡Buenos días, pariente <span style={{ color: '#0D47A1' }}>Arellano</span>! 🎉
              </span>
            </div>
            {/* Bloque derecho: notificación, chat soporte y usuario */}
            <div className="d-flex align-items-center ms-auto">
              
              {/* Notificaciones con popover */}
              <div className="position-relative" ref={notificationsRef}>
                <a 
                  className="nav-link position-relative" 
                  href="#" 
                  style={{ padding: '0 0.8rem' }}
                  onClick={(e) => { e.preventDefault(); togglePopover('notifications'); }}
                >
                  <i className="bi bi-bell-fill" style={{ fontSize: '1.5em', color: "#007bff" }}></i>
                  {unreadNotifications > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{
                      fontSize: '0.6em',
                      padding: '4px 6px',
                      minWidth: '18px'
                    }}>
                      {unreadNotifications}
                    </span>
                  )}
                </a>
                
                {/* Popover de Notificaciones */}
                {activePopover === 'notifications' && (
                  <div className="popover-container show" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '380px',
                    zIndex: 1060,
                    marginTop: '10px'
                  }}>
                    <div className="card shadow-lg border border-secondary" style={{ borderWidth: '2px' }}>
                      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">
                          <i className="bi bi-bell-fill me-2"></i>
                          Notificaciones
                        </h6>
                        <span className="badge bg-light text-primary">{notifications.length}</span>
                      </div>
                      <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item p-3 border-bottom ${notification.unread ? 'bg-light bg-opacity-50' : ''}`}
                          style={{ 
                            cursor: 'pointer', 
                            borderColor: '#e9ecef',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          <div className="d-flex align-items-start">
                            <div className={`badge bg-${notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : notification.type === 'error' ? 'danger' : 'info'} me-3`} style={{ 
                              minWidth: '32px',
                              flexShrink: 0
                            }}>
                              <i className={`bi bi-${notification.type === 'success' ? 'check-circle' : notification.type === 'warning' ? 'exclamation-triangle' : notification.type === 'error' ? 'x-circle' : 'info-circle'}`}></i>
                            </div>
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h6 className="mb-0 text-dark text-truncate">{notification.title}</h6>
                                {notification.unread && (
                                  <span className="badge bg-primary ms-2 flex-shrink-0">Nuevo</span>
                                )}
                              </div>
                              <p className="mb-1 text-muted small text-break">{notification.message}</p>
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                {notification.time}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                      <div className="card-footer text-center bg-light">
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-list-ul me-1"></i>
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Soporte con popover */}
              <div className="position-relative" ref={chatRef}>
                <a 
                  className="nav-link position-relative" 
                  href="#" 
                  style={{ padding: '0 0.8rem' }}
                  onClick={(e) => { e.preventDefault(); togglePopover('chat'); }}
                >
                  <i className="bi bi-chat-dots-fill" style={{ fontSize: '1.5em', color: "#28a745" }}></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{
                    fontSize: '0.6em',
                    padding: '4px 6px',
                    minWidth: '18px'
                  }}>
                    {chatMessages.filter(msg => msg.sender === 'user').length}
                  </span>
                </a>
                
                {/* Popover de Chat Mejorado */}
                {activePopover === 'chat' && (
                  <div className="popover-container show" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '360px',
                    zIndex: 1060,
                    marginTop: '10px'
                  }}>
                    <div className="card shadow-lg border border-success" style={{ borderWidth: '2px' }}>
                      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="bg-white bg-opacity-20 rounded-circle p-1 me-2">
                            <i className="bi bi-headset"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">Soporte al Cliente</h6>
                            <small className="opacity-75">Conversación con María González</small>
                          </div>
                        </div>
                        <span className="badge bg-light text-success">
                          <i className="bi bi-circle-fill me-1" style={{ fontSize: '6px' }}></i>
                          En línea
                        </span>
                      </div>
                      
                      <div className="card-body p-3 bg-light bg-opacity-25" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {chatMessages.map(msg => (
                          <div key={msg.id} className={`mb-3 ${msg.sender === 'admin' ? 'text-end' : ''}`}>
                            <div className="d-flex align-items-start">
                              {msg.sender === 'user' && (
                                <div className="me-2">
                                  <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-person text-white" style={{ fontSize: '14px' }}></i>
                                  </div>
                                </div>
                              )}
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-1">
                                  <small className="text-muted fw-bold">{msg.user}</small>
                                  <small className="text-muted ms-2">{msg.time}</small>
                                </div>
                                <div 
                                  className={`p-3 rounded-3 ${
                                    msg.sender === 'admin' 
                                      ? 'bg-primary text-white' 
                                      : 'bg-white border border-secondary'
                                  }`}
                                  style={{ 
                                    maxWidth: '85%',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <div className="small">{msg.message}</div>
                                </div>
                              </div>
                              {msg.sender === 'admin' && (
                                <div className="ms-2">
                                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-person-check text-white" style={{ fontSize: '14px' }}></i>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="card-footer border-top border-secondary">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control border-secondary" 
                            placeholder="Escribe tu respuesta..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <button 
                            className="btn btn-success"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <i className="bi bi-send"></i>
                          </button>
                        </div>
                        <small className="text-muted mt-2 d-block">
                          <i className="bi bi-info-circle me-1"></i>
                          Responde al problema de envío del pedido #12345
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Perfil de Usuario con popover */}
              <div className="position-relative" ref={profileRef}>
                <a 
                  className="nav-link" 
                  href="#" 
                  style={{ padding: '0 0.8rem' }}
                  onClick={(e) => { e.preventDefault(); togglePopover('profile'); }}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: '1.5em', color: "#374850" }}></i>
                </a>
                
                {/* Popover de Perfil */}
                {activePopover === 'profile' && (
                  <div className="popover-container show" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '240px',
                    zIndex: 1060,
                    marginTop: '10px'
                  }}>
                    <div className="card shadow-lg border border-dark" style={{ borderWidth: '2px' }}>
                      <div className="card-body text-center p-4">
                        <img 
                          src="https://pbs.twimg.com/profile_images/378800000162907418/3227125f0f2eade72449e2204da234d4_200x200.jpeg" 
                          alt="Admin" 
                          className="rounded-circle mb-3 border border-3 border-primary"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <h6 className="mb-1 fw-bold text-dark">Huaso Arellano</h6>
                        <p className="text-muted small mb-3">
                          <i className="bi bi-shield-check text-primary me-1"></i>
                          Administrador Principal
                        </p>
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleOpenProfileModal}
                          >
                            <i className="bi bi-person-gear me-2"></i>
                            Mi cuenta
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-grow-1 p-3 contenido-admin" style={{ minHeight: 0 }}>
          <Outlet />
        </div>
      </div>

      {/* Modal de Mi Cuenta */}
      {showProfileModal && (
        <>
          <div 
            className="modal-backdrop show modal-backdrop-animation" 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1070
            }}
          ></div>
          
          <div 
            className="modal show d-block modal-show" 
            tabIndex="-1" 
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1080,
              overflow: 'hidden'
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg modal-animation">
              <div className="modal-content border border-2 border-primary">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-person-gear me-2"></i>
                    {isEditing ? 'Editar Perfil' : 'Mi Cuenta'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseProfileModal}
                  ></button>
                </div>
                
                <div className="modal-body">
                  {/* Información del perfil */}
                  <div className="row">
                    <div className="col-md-4 text-center mb-4">
                      <img 
                        src="https://pbs.twimg.com/profile_images/378800000162907418/3227125f0f2eade72449e2204da234d4_200x200.jpeg" 
                        alt="Admin" 
                        className="rounded-circle border border-4 border-primary mb-3"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                      {isEditing && (
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-camera me-1"></i>
                          Cambiar foto
                        </button>
                      )}
                    </div>
                    
                    <div className="col-md-8">
                      <div className="row g-3">
                        {/* Nombres */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Nombres</label>
                          <input
                            type="text"
                            className="form-control"
                            value={adminProfile.nombres}
                            onChange={(e) => handleProfileChange('nombres', e.target.value)}
                            disabled={!isEditing}
                            style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                          />
                        </div>
                        
                        {/* Apellidos */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Apellidos</label>
                          <input
                            type="text"
                            className="form-control"
                            value={adminProfile.apellidos}
                            onChange={(e) => handleProfileChange('apellidos', e.target.value)}
                            disabled={!isEditing}
                            style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                          />
                        </div>
                        
                        {/* Correo */}
                        <div className="col-12">
                          <label className="form-label fw-semibold">Correo Electrónico</label>
                          <input
                            type="email"
                            className="form-control"
                            value={adminProfile.correo}
                            onChange={(e) => handleProfileChange('correo', e.target.value)}
                            disabled={!isEditing}
                            style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                          />
                          <div className="form-text">
                            <i className="bi bi-info-circle me-1"></i>
                            Debe terminar en @duocuc.cl o @fondaduoc.cl
                          </div>
                        </div>
                        
                        {/* Dirección */}
                        <div className="col-12">
                          <label className="form-label fw-semibold">Dirección</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={adminProfile.direccion}
                            onChange={(e) => handleProfileChange('direccion', e.target.value)}
                            disabled={!isEditing}
                            style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                          />
                        </div>
                        
                        {/* RUT (Siempre deshabilitado) */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">RUT</label>
                          <input
                            type="text"
                            className="form-control bg-light"
                            value={adminProfile.rut}
                            disabled
                            style={{ cursor: 'not-allowed', opacity: 0.7 }}
                          />
                          <div className="form-text text-muted">
                            <i className="bi bi-lock me-1"></i>
                            El RUT no puede ser modificado
                          </div>
                        </div>
                        
                        {/* Rol (Siempre deshabilitado) */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Rol</label>
                          <input
                            type="text"
                            className="form-control bg-light"
                            value={adminProfile.rol}
                            disabled
                            style={{ cursor: 'not-allowed', opacity: 0.7 }}
                          />
                          <div className="form-text text-muted">
                            <i className="bi bi-shield-check me-1"></i>
                            Rol del sistema
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  {!isEditing ? (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleCloseProfileModal}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Cerrar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Editar Perfil
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={handleCancelEdit}
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={handleSaveProfile}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Guardar Cambios
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLayout;