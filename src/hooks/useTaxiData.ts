// src/hooks/useTaxiData.ts
import axios from "axios";
import { useEffect, useState } from "react";
import type { TaxiTrip } from "../types/TaxiTrip";

export function useTaxiData() {
  const [data, setData] = useState<TaxiTrip[]>([]);

  useEffect(() => {
    axios
      .get<TaxiTrip[]>("https://data.cityofnewyork.us/resource/t29m-gskq.json?$limit=1000")
      .then((res) => setData(res.data));
  }, []);

  return data;
}


