import { Bar } from 'react-chartjs-2';
import { ventasMerchandising } from '../../data/admin/metricas';
import "../../chartjs-setup";

const data = {
  labels: ventasMerchandising.map(v => v.nombre),
  datasets: [{
    label: 'Unidades vendidas',
    data: ventasMerchandising.map(v => v.cantidad),
    backgroundColor: '#2e7d32',
  }],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Ventas de Merchandising (Bandas)' },
  },
  scales: { y: { beginAtZero: true } },
};

export default function VentasMerchandisingBar() {
  return <Bar data={data} options={options} />;
}