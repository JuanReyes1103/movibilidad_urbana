// src/components/AvgDurationChart.tsx - CORREGIDO
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 🔥 AGREGAR INTERFACE PARA PROPS
interface AvgDurationChartProps {
  data: any[];
}

function AvgDurationChart({ data }: AvgDurationChartProps) {
  // 🔥 DEBUG: Verificar datos recibidos
  console.log("📊 AvgDurationChart - Datos filtrados recibidos:", data?.length);

  // Franja horaria por bloques (ej. 0-3, 4-7, ..., 20-23)
  const ranges = [
    [0, 3],
    [4, 7],
    [8, 11],
    [12, 15],
    [16, 19],
    [20, 23],
  ];
  const labels = ["0–3", "4–7", "8–11", "12–15", "16–19", "20–23"];

  const sums = Array(ranges.length).fill(0);
  const counts = Array(ranges.length).fill(0);

  // 🔥 USAR data de props en lugar de useTaxiData()
  data.forEach((trip) => {
    if (trip.tpep_pickup_datetime && trip.tpep_dropoff_datetime) {
      const start = new Date(trip.tpep_pickup_datetime);
      const end = new Date(trip.tpep_dropoff_datetime);
      const minutes = (end.getTime() - start.getTime()) / 60000;
      const hour = start.getHours();
      const idx = ranges.findIndex(([a, b]) => hour >= a && hour <= b);
      if (idx >= 0 && minutes >= 0 && isFinite(minutes)) {
        sums[idx] += minutes;
        counts[idx] += 1;
      }
    }
  });

  const avgs = sums.map((s, i) => (counts[i] ? s / counts[i] : 0));

  const chartData = {
    labels,
    datasets: [
      {
        label: `Duración promedio por franja (${data.length} viajes)`,
        data: avgs,
        backgroundColor: "rgba(153,102,255,0.6)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
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
        text: 'Duración Promedio por Franja Horaria'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutos'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Franja Horaria'
        }
      }
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
      {/* 🔥 DEBUG INFO */}
      <div style={{ marginTop: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
        <small>
          <strong>Datos mostrados:</strong> {data?.length || 0} viajes | 
          <strong> Viajes por franja:</strong> {counts.join(', ')}
        </small>
      </div>
    </div>
  );
}

export default AvgDurationChart;