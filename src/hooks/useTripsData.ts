import { useState, useEffect } from "react";
import Papa from "papaparse";

interface Trip {
  date: string;
  zone: string;
  distance_km: number;
  duration_min: number;
  payment_type: string;
  [key: string]: any; // permite más columnas
}

export default function useTripsData() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    Papa.parse<Trip>("/src/data/trips.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setTrips(result.data);
      }
    });
  }, []);

  return trips;
}
