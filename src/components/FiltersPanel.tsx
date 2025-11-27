// src/components/FiltersPanel.tsx - CORREGIDO
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Typography } from "@mui/material"; // 🔥 Agregar Typography
import { useState, useEffect, useMemo } from "react";

interface FiltersPanelProps {
  allData: any[];
  onFiltered: (data: any[]) => void;
}

const FiltersPanel = ({ allData, onFiltered }: FiltersPanelProps) => {
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  // 🔥 DEBUG: Ver datos de entrada
  console.log("🎯 FiltersPanel - allData recibido:", allData?.length);

  // 🔥 Mapeo de payment_type
  const paymentMapping: { [key: string]: string } = {
    '1': 'Credit Card',
    '2': 'Cash', 
    '3': 'No Charge',
    '4': 'Dispute'
  };

  // 🔥 Obtener AÑOS
  const availableYears = useMemo(() => {
    if (!allData || allData.length === 0) {
      console.log("❌ No hay datos para calcular años");
      return [];
    }
    
    const years = allData.map(d => {
      try {
        const dateStr = d.tpep_pickup_datetime;
        const year = new Date(dateStr).getFullYear();
        return isNaN(year) ? null : year;
      } catch (error) {
        console.error("❌ Error parseando fecha:", d.tpep_pickup_datetime);
        return null;
      }
    }).filter(y => y !== null);
    
    const uniqueYears = Array.from(new Set(years)).sort();
    console.log("📅 Años encontrados:", uniqueYears);
    return uniqueYears;
  }, [allData]);

  // 🔥 Obtener UBICACIONES
  const locations = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    
    const locs = allData.map(item => item.pulocationid)
      .filter(loc => loc && loc !== "");
    
    const uniqueLocs = Array.from(new Set(locs)).slice(0, 15);
    console.log("📍 Ubicaciones encontradas:", uniqueLocs);
    return uniqueLocs;
  }, [allData]);

  // 🔥 Obtener MÉTODOS DE PAGO
  const payments = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    
    const paymentNumbers = allData.map(item => item.payment_type)
      .filter(payment => payment && payment !== "");
    
    const uniquePayments = Array.from(new Set(paymentNumbers)).sort();
    console.log("💳 Payments encontrados:", uniquePayments);
    return uniquePayments;
  }, [allData]);

  // 🔥 Aplicar filtros
  useEffect(() => {
    console.log("🔄 EJECUTANDO FILTROS...", {
      selectedYear,
      selectedLocation, 
      selectedPayment,
      totalDatos: allData?.length
    });

    if (!allData || allData.length === 0) {
      console.log("📭 No hay datos para filtrar");
      onFiltered([]);
      return;
    }

    let filtered = [...allData];

    // 📅 Filtro por AÑO
    if (selectedYear) {
      const before = filtered.length;
      filtered = filtered.filter(d => {
        try {
          const tripYear = new Date(d.tpep_pickup_datetime).getFullYear();
          return tripYear === selectedYear;
        } catch (error) {
          console.error("❌ Error en filtro año:", d.tpep_pickup_datetime);
          return false;
        }
      });
      console.log(`📅 Filtro año ${selectedYear}: ${before} → ${filtered.length}`);
    }

    // 📍 Filtro por UBICACIÓN
    if (selectedLocation) {
      const before = filtered.length;
      filtered = filtered.filter(d => d.pulocationid === selectedLocation);
      console.log(`📍 Filtro ubicación ${selectedLocation}: ${before} → ${filtered.length}`);
    }

    // 💳 Filtro por PAGO
    if (selectedPayment) {
      const before = filtered.length;
      filtered = filtered.filter(d => d.payment_type === selectedPayment);
      console.log(`💳 Filtro pago ${selectedPayment}: ${before} → ${filtered.length}`);
    }

    console.log("✅ FILTRADO COMPLETADO - Enviando:", filtered.length, "registros");
    onFiltered(filtered);
  }, [selectedYear, selectedLocation, selectedPayment, allData, onFiltered]);

  const handleReset = () => {
    console.log("🔄 Reseteando todos los filtros");
    setSelectedYear("");
    setSelectedLocation("");
    setSelectedPayment("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      {/* 📅 Selector de Año */}
      <FormControl fullWidth>
        <InputLabel>Año</InputLabel>
        <Select 
          value={selectedYear} 
          onChange={(e) => {
            const year = e.target.value as number;
            console.log("🎯 Seleccionado año:", year);
            setSelectedYear(year);
          }} 
          label="Año"
        >
          <MenuItem value="">Todos los años</MenuItem>
          {availableYears.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 📍 Selector de Ubicación */}
      <FormControl fullWidth>
        <InputLabel>Ubicación de Recogida</InputLabel>
        <Select 
          value={selectedLocation} 
          onChange={(e) => {
            const location = e.target.value;
            console.log("🎯 Seleccionada ubicación:", location);
            setSelectedLocation(location);
          }} 
          label="Ubicación"
        >
          <MenuItem value="">Todas las ubicaciones</MenuItem>
          {locations.map(location => (
            <MenuItem key={location} value={location}>
              Zona {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 💳 Selector de Método de Pago */}
      <FormControl fullWidth>
        <InputLabel>Método de Pago</InputLabel>
        <Select 
          value={selectedPayment} 
          onChange={(e) => {
            const payment = e.target.value;
            console.log("🎯 Seleccionado pago:", payment);
            setSelectedPayment(payment);
          }} 
          label="Pago"
        >
          <MenuItem value="">Todos los métodos</MenuItem>
          {payments.map(payment => (
            <MenuItem key={payment} value={payment}>
              {paymentMapping[payment] || `Método ${payment}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={handleReset}>
        Limpiar filtros
      </Button>

      {/* 🔥 DEBUG INFO */}
      <Box mt={2} p={1} bgcolor="grey.100" borderRadius={1}>
        <Typography variant="body2" color="text.secondary">
          <strong>Debug Info:</strong><br/>
          Datos recibidos: {allData?.length || 0}<br/>
          Año seleccionado: {selectedYear || "Ninguno"}<br/>
          Ubicación: {selectedLocation || "Ninguna"}<br/>
          Pago: {selectedPayment || "Ninguno"}
        </Typography>
      </Box>
    </Box>
  );
};

export default FiltersPanel;