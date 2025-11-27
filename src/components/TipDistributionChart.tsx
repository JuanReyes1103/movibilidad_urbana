// src/components/TipDistributionChart.tsx
import { Doughnut } from "react-chartjs-2";
import { useTaxiData } from "../hooks/useTaxiData";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function TipDistributionChart() {
  const data = useTaxiData();

  // Clasificar propinas en rangos
  const ranges = ["0–1$", "1–3$", "3–5$", "5$+"];
  const counts = [0, 0, 0, 0];

  data.forEach((trip) => {
    const tip = parseFloat(trip.tip_amount || "0");
    if (tip <= 1) counts[0]++;
    else if (tip <= 3) counts[1]++;
    else if (tip <= 5) counts[2]++;
    else counts[3]++;
  });

  const chartData = {
    labels: ranges,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(75,192,192,0.6)",
        ],
      },
    ],
  };

  return <Doughnut data={chartData} />;
}

export default TipDistributionChart;
