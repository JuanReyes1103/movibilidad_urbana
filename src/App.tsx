// src/App.tsx - CON MAPA TEMPORAL INLINE
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

// 🔥 COMPONENTE MAPA TEMPORAL INLINE
const TempMap = ({ data }: { data: any[] }) => {
  return (
    <div style={{ 
      height: '400px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '60px',
        height: '60px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        border: '2px solid white'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '25%',
        width: '40px',
        height: '40px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '50%',
        border: '2px solid white'
      }}></div>

      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Mapa de NYC</h2>
        <p style={{ margin: '0 0 16px 0', opacity: 0.9 }}>
          Visualización de rutas de taxis
        </p>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '12px 24px', 
          borderRadius: '25px',
          backdropFilter: 'blur(10px)'
        }}>
          <strong>{data?.length || 0}</strong> viajes mostrados
        </div>
      </div>
    </div>
  );
};

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