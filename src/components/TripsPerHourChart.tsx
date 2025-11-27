// src/components/TripsPerHourChart.tsx - CORREGIDO
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 🔥 AGREGAR INTERFACE PARA PROPS
interface TripsPerHourChartProps {
  data: any[];
}

// 🔥 RECIBIR DATOS POR PROPS EN LUGAR DEL HOOK
function TripsPerHourChart({ data }: TripsPerHourChartProps) {
  // 🔥 DEBUG: Verificar datos recibidos
  console.log("📊 TripsPerHourChart - Datos filtrados recibidos:", data?.length);

  const counts: Record<number, number> = {};
  
  // 🔥 USAR los datos que vienen por props
  data.forEach((trip) => {
    if (trip.tpep_pickup_datetime) {
      const h = new Date(trip.tpep_pickup_datetime).getHours();
      counts[h] = (counts[h] || 0) + 1;
    }
  });

  // Asegurar orden de horas 0..23
  const labels = Array.from({ length: 24 }, (_, i) => i.toString());
  const series = labels.map((label) => counts[Number(label)] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: `Viajes por hora (Total: ${data.length})`, // 🔥 Mostrar total filtrado
        data: series,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.25,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Viajes por Hora del Día'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Viajes'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Hora del Día'
        }
      }
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
      {/* 🔥 DEBUG INFO */}
      <div style={{ marginTop: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
        <small>
          <strong>Datos mostrados:</strong> {data?.length || 0} viajes | 
          <strong> Última actualización:</strong> {new Date().toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
}

export default TripsPerHourChart;