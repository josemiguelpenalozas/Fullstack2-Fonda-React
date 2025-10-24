import VentasPorMesLine from '../../components/charts/VentasPorMesLine';
import UsuariosActivosBar from '../../components/charts/UsuariosActivosBar';
import VentasMerchandisingBar from '../../components/charts/VentasMerchandisingBar';
import ProporcionCategoriaPie from '../../components/charts/ProporcionCategoriaPie';
import RankingProductosBar from '../../components/charts/RankingProductosBar';



const cardStyle = { background: "#fff", padding: "1rem", borderRadius: "10px", boxShadow: "0 1px 6px #0001" };

export default function Dashboard() {
  return (
    <div className="dashboard-admin" style={{ padding: '1rem',  position: 'relative', zIndex: 5}}>
      <h2 style={{ fontWeight: "bold", marginBottom: "16px", color: "#515153ff", fontFamily: "Montserrat, sans-serif" }}>
        Panel de Administración - Métricas y Estadísticas
      </h2>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', position: 'relative', zIndex: 5 }}>
        <div className="card-dashboard" style={cardStyle}><VentasPorMesLine /></div>
        <div className="card-dashboard" style={cardStyle}><UsuariosActivosBar /></div>
        <div className="card-dashboard" style={cardStyle}><VentasMerchandisingBar /></div>
        <RankingProductosBar />
        <ProporcionCategoriaPie />
      </div>
    </div>
  );
}