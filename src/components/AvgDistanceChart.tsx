// src/components/AvgDistanceChart.tsx
import { Bar } from "react-chartjs-2";
import { useTaxiData } from "../hooks/useTaxiData";
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

function AvgDistanceChart() {
  const data = useTaxiData();

  const total = data.reduce(
    (acc, trip) => acc + parseFloat(trip.trip_distance || "0"),
    0
  );
  const avgDistance = data.length ? total / data.length : 0;

  const chartData = {
    labels: ["Distancia promedio"],
    datasets: [
      {
        label: "Km",
        data: [avgDistance],
        backgroundColor: "rgba(54,162,235,0.6)",
      },
    ],
  };

  return <Bar data={chartData} />;
}

export default AvgDistanceChart;
