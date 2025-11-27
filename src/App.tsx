// src/App.tsx - CORREGIDO
import { Container, Grid, Typography, Box, Button, CssBaseline, ThemeProvider, createTheme, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import KpiCard from "./components/KpiCard";
import TripsPerHourChart from "./components/TripsPerHourChart";
import AvgDurationChart from "./components/AvgDurationChart";
import FareDistanceScatter from "./components/FareDistanceScatter";
import FiltersPanel from "./components/FiltersPanel";
import { useTaxiData } from "./hooks/useTaxiData";
import { getAvgDuration, getAvgFare } from "./utils/kpiCalculations";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function App() {
  const allData = useTaxiData();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (allData && allData.length > 0) {
      setFilteredData(allData);
    }
  }, [allData]);

  const data = filteredData || [];

  // KPIs
  const totalTrips = data.length;
  const avgDuration = data.length ? getAvgDuration(data).toFixed(2) : "0.00";
  const avgFare = data.length ? getAvgFare(data).toFixed(2) : "0.00";

  const theme = createTheme({ 
    palette: { 
      mode: darkMode ? "dark" : "light",
    } 
  });

  const handleReset = () => {
    setFilteredData(allData || []);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Box mt={3} mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" gutterBottom>
            🚕 Dashboard de Taxis NYC
          </Typography>
          <Box>
            <Button variant="contained" onClick={handleReset} sx={{ mr: 1 }}>
              Reset Filtros
            </Button>
            <Button variant="contained" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Modo Light" : "🌙 Modo Dark"}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Panel de filtros */}
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <FiltersPanel allData={allData || []} onFiltered={setFilteredData} />
            </LocalizationProvider>
          </Grid>

          {/* Contenido principal */}
          <Grid item xs={12} md={9}>
            {/* KPIs */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <KpiCard 
                  title="Total de Viajes" 
                  value={totalTrips.toString()} 
                  subtitle={
                    data.length === (allData?.length || 0) 
                      ? "todos los registros" 
                      : `${data.length} de ${allData?.length || 0}`
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <KpiCard 
                  title="Duración Promedio" 
                  value={`${avgDuration} min`} 
                  subtitle="por viaje"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <KpiCard 
                  title="Tarifa Promedio" 
                  value={`$${avgFare}`} 
                  subtitle="por viaje"
                />
              </Grid>
            </Grid>

            {/* Gráficos */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    📊 Viajes por Hora del Día
                  </Typography>
                  <TripsPerHourChart data={data} />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    ⏱️ Duración Promedio
                  </Typography>
                  <AvgDurationChart data={data} />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    💰 Tarifa vs Distancia
                  </Typography>
                  <FareDistanceScatter data={data} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;