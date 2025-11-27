// src/components/RouteMap.tsx
import { Card, CardContent, Typography } from "@mui/material";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  data: { 
    pickup_latitude: number; 
    pickup_longitude: number; 
    dropoff_latitude: number; 
    dropoff_longitude: number 
  }[];
}

export default function RouteMap({ data }: RouteMapProps) {
  // Agrupar rutas por origen-destino
  const routeCounts: { [key: string]: { from: [number, number], to: [number, number], count: number } } = {};

  data.forEach(d => {
    if (d.pickup_latitude && d.pickup_longitude && d.dropoff_latitude && d.dropoff_longitude) {
      const key = `${d.pickup_latitude},${d.pickup_longitude}-${d.dropoff_latitude},${d.dropoff_longitude}`;
      if (!routeCounts[key]) {
        routeCounts[key] = {
          from: [d.pickup_latitude, d.pickup_longitude],
          to: [d.dropoff_latitude, d.dropoff_longitude],
          count: 1
        };
      } else {
        routeCounts[key].count += 1;
      }
    }
  });

  const routes = Object.values(routeCounts);

  const center: [number, number] = [40.73061, -73.935242]; // Centro de Nueva York

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Rutas más usadas</Typography>
        <MapContainer center={center} zoom={12} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {routes.map((r, i) => (
            <Polyline
              key={i}
              positions={[r.from, r.to]}
              color="red"
              weight={Math.min(10, r.count)} // Más veces = línea más gruesa
              opacity={0.6}
            />
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
