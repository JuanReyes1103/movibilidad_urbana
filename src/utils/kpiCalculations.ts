// src/utils/kpiCalculations.ts
import type { TaxiTrip } from "../types/TaxiTrip";

export function getTripsPerHour(data: TaxiTrip[]) {
  const counts: Record<number, number> = {};
  data.forEach((trip) => {
    if (trip.tpep_pickup_datetime) {
      const hour = new Date(trip.tpep_pickup_datetime).getHours();
      counts[hour] = (counts[hour] || 0) + 1;
    }
  });
  return {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Viajes por hora",
        data: Object.values(counts),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };
}

export function getAvgDuration(data: TaxiTrip[]) {
  const total = data.reduce((acc, trip) => {
    if (trip.tpep_dropoff_datetime && trip.tpep_pickup_datetime) {
      const duration =
        (new Date(trip.tpep_dropoff_datetime).getTime() -
          new Date(trip.tpep_pickup_datetime).getTime()) /
        60000;
      return acc + duration;
    }
    return acc;
  }, 0);
  return total / data.length;
}

export function getAvgDistance(data: TaxiTrip[]) {
  const total = data.reduce(
    (acc, trip) => acc + parseFloat(trip.trip_distance || "0"),
    0
  );
  return total / data.length;
}

export function getAvgFare(data: TaxiTrip[]) {
  const total = data.reduce(
    (acc, trip) => acc + parseFloat(trip.fare_amount || "0"),
    0
  );
  return total / data.length;
}

export function getAvgTip(data: TaxiTrip[]) {
  const total = data.reduce(
    (acc, trip) => acc + parseFloat(trip.tip_amount || "0"),
    0
  );
  return total / data.length;
}

