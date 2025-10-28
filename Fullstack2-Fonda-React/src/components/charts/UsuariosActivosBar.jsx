import { Bar } from 'react-chartjs-2';
import { labelsMeses, usuariosActivosPorMes } from '../../data/admin/metricas';
import "../../chartjs-setup";

const data = {
  labels: labelsMeses,
  datasets: [{
    label: 'Usuarios activos',
    data: usuariosActivosPorMes,
    backgroundColor: '#d32f2f',
  }],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Usuarios Activos por Mes' },
  },
  scales: { y: { beginAtZero: true } },
};

export default function UsuariosActivosBar() {
  return <Bar data={data} options={options} />;
}