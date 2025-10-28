import { Bar } from 'react-chartjs-2';
import "../../chartjs-setup";
import { rankingProductos } from '../../data/admin/metricas';


const data = {
  labels: rankingProductos.map(p => p.nombre),
  datasets: [{
    label: 'Vendidos',
    data: rankingProductos.map(p => p.vendidos),
    backgroundColor: '#0D47A1',
  }],
};

const options = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 3.2, 
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Ranking de Productos Más Vendidos' },
  },
  scales: { x: { beginAtZero: true } },
};

export default function RankingProductosBar() {
  return (
    <div className="card-dashboard card-large">
      <Bar data={data} options={options} height={340}/>
    </div>
  );
}