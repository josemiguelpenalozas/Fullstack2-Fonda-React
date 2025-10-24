import { Line } from 'react-chartjs-2';
import { labelsMeses, ventasPorMes } from '../../data/admin/metricas';
import "../../chartjs-setup";

const data = {
    labels: labelsMeses,
    datasets: [{
        label: 'Ventas por mes',
        data: ventasPorMes,
        fill: false,
        borderColor: '#0D47A1',
        backgroundColor: '#0D47A1',
        tension: 0.25,
        pointRadius: 3,
    }],
};
const options = {
    responsive: true,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Ventas por Mes (Cantidad)' },
    },
    scales: { y: { beginAtZero: true } },
};

export default function VentasPorMesLine() {
    return <Line data={data} options={options} />;
}