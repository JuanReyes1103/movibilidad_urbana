// src/types/TaxiTrip.ts
export interface TaxiTrip {
  tpep_pickup_datetime: string;
  tpep_dropoff_datetime?: string;
  fare_amount?: string;
  trip_distance?: string;
  passenger_count?: string;
  tip_amount?: string; // añade si quieres calcular propinas
}
