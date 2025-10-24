import React, { useState, useEffect } from 'react';
import VentasPorMesLine from '../../components/charts/VentasPorMesLine';
import UsuariosActivosBar from '../../components/charts/UsuariosActivosBar';
import VentasMerchandisingBar from '../../components/charts/VentasMerchandisingBar';
import ProporcionCategoriaPie from '../../components/charts/ProporcionCategoriaPie';
import RankingProductosBar from '../../components/charts/RankingProductosBar';
import { productos } from '../../data/admin/productos';
import { usuarios } from '../../data/admin/usuarios';

const cardStyle = { background: "#fff", padding: "1rem", borderRadius: "10px", boxShadow: "0 5px 18px 0 rgba(0, 0, 0, 0.51)" };

export default function Dashboard() {
  const [metricas, setMetricas] = useState({
    productosSinStock: 0,
    productosStockCritico: 0,
    usuariosRegistrados: 0,
    totalProductos: 0,
    administradoresCount: 0, // ✅ Nuevo campo agregado
    ventasHoy: 42,
    ingresosMes: 12543000
  });

  useEffect(() => {
    // Cargar usuarios desde localStorage o JSON inicial
    const cargarUsuarios = () => {
      const usuariosGuardados = localStorage.getItem('usuarios');
      if (usuariosGuardados) {
        return JSON.parse(usuariosGuardados);
      }
      return usuarios;
    };

    const usuariosActuales = cargarUsuarios();
    
    // Calcular métricas basadas en los datos actuales
    const productosSinStock = productos.filter(producto => producto.stock === 0).length;
    const productosStockCritico = productos.filter(producto => 
      producto.stock > 0 && producto.stock <= producto.stockCritico
    ).length;
    const usuariosRegistrados = usuariosActuales.length;
    const totalProductos = productos.length;
    const administradoresCount = usuariosActuales.filter(u => u.rol === 'admin').length; // ✅ Usar usuarios actuales

    setMetricas({
      productosSinStock,
      productosStockCritico,
      usuariosRegistrados,
      totalProductos,
      administradoresCount, // ✅ Incluir en el estado
      ventasHoy: 42,
      ingresosMes: 12543000
    });
  }, [productos]);

  return (
    <div className="dashboard-admin" style={{ padding: '1rem', position: 'relative', zIndex: 5 }}>
      
      {/* Tarjetas de Métricas */}
      <div className="metricas-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px',
        position: 'relative', 
        zIndex: 5 
      }}>
        
        {/* Tarjeta Amarilla - Productos sin stock */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.productosSinStock}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Productos sin stock</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            De {metricas.totalProductos} productos totales
          </div>
        </div>

        {/* Tarjeta Roja - Stock crítico */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.productosStockCritico}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Stock crítico</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-speedometer2" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            Necesitan reposición urgente
          </div>
        </div>

        {/* Tarjeta Azul - Usuarios registrados ACTUALIZADA */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #4D96FF, #6BC5FF)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(77, 150, 255, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.usuariosRegistrados}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Usuarios registrados</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-people-fill" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            {metricas.administradoresCount} administradores {/* ✅ Usar el estado actualizado */}
          </div>
        </div>

        {/* Tarjeta Verde - Total productos */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #2ED573, #7BED9F)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(46, 213, 115, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.totalProductos}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Total productos</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-box-seam" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            {new Set(productos.map(p => p.categoria)).size} categorías
          </div>
        </div>

      </div>

      {/* Gráficos existentes */}
      <div className="dashboard-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '16px', 
        position: 'relative', 
        zIndex: 5 
      }}>
        <div className="card-dashboard" style={cardStyle}><VentasPorMesLine /></div>
        <div className="card-dashboard" style={cardStyle}><UsuariosActivosBar /></div>
        <div className="card-dashboard" style={cardStyle}><VentasMerchandisingBar /></div>
        <RankingProductosBar />
        <ProporcionCategoriaPie />
      </div>
    </div>
  );
}