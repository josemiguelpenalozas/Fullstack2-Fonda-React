import { Pie } from 'react-chartjs-2';
import { ventasPorCategoria } from '../../data/admin/metricas';
import "../../chartjs-setup";

const data = {
  labels: ventasPorCategoria.map(v => v.categoria),
  datasets: [{
    data: ventasPorCategoria.map(v => v.ventas),
    backgroundColor: [
      '#0D47A1', '#d32f2f', '#2e7d32', '#f9a825', '#90a4ae'
    ],
  }],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: 'Proporción de Ventas por Categoría' },
  },
};

export default function ProporcionCategoriaPie() {
  return (
    <div className="card-dashboard card-large">
      <Pie data={data} options={options} />
    </div>
  );
}
