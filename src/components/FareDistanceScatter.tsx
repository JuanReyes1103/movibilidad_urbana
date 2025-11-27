// src/components/FareDistanceScatter.tsx - CORREGIDO
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
} from "chart.js";

// 🔥 REGISTRAR TODOS LOS ELEMENTOS NECESARIOS
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale
);

// 🔥 AGREGAR INTERFACE PARA PROPS
interface FareDistanceScatterProps {
  data: any[];
}

function FareDistanceScatter({ data }: FareDistanceScatterProps) {
  // 🔥 DEBUG: Verificar datos recibidos
  console.log("📊 FareDistanceScatter - Datos filtrados recibidos:", data?.length);

  // 🔥 USAR data de props en lugar de useTaxiData()
  const points = data
    .map((trip) => {
      const distance = parseFloat(trip.trip_distance || "0");
      const fare = parseFloat(trip.fare_amount || "0");
      
      // 🔥 FILTRAR VALORES VÁLIDOS
      if (!isFinite(distance) || !isFinite(fare) || distance <= 0 || fare <= 0) {
        return null;
      }
      
      // 🔥 LIMITAR RANGO PARA MEJOR VISUALIZACIÓN
      if (distance > 50 || fare > 200) {
        return null;
      }
      
      return { x: distance, y: fare };
    })
    .filter(Boolean) as { x: number; y: number }[];

  console.log("📈 Puntos válidos para scatter:", points.length);

  const chartData = {
    datasets: [
      {
        label: `Tarifa vs Distancia (${points.length} puntos)`,
        data: points,
        backgroundColor: "rgba(255,99,132,0.6)",
        borderColor: "rgba(255,99,132,1)",
        pointRadius: 4,
        pointHoverRadius: 6,
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
        text: 'Relación: Tarifa vs Distancia de Viaje'
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const point = context.raw;
            return `Distancia: ${point.x.toFixed(2)} mi, Tarifa: $${point.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Distancia (millas)'
        },
        min: 0,
        max: 20
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Tarifa ($)'
        },
        min: 0,
        max: 100
      }
    },
  };

  return (
    <div>
      <Scatter data={chartData} options={options} />
      {/* 🔥 DEBUG INFO */}
      <div style={{ marginTop: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
        <small>
          <strong>Datos mostrados:</strong> {data?.length || 0} viajes | 
          <strong> Puntos válidos:</strong> {points.length} |
          <strong> Rango:</strong> 0-20 mi, $0-100
        </small>
      </div>
    </div>
  );
}

export default FareDistanceScatter;