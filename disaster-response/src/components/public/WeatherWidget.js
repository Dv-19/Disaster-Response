// frontend/src/components/public/WeatherWidget.js

import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  CardHeader,
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import ErrorIcon from '@mui/icons-material/Error';

// Styled component for weather icons
const WeatherIcon = styled('div')(({ theme }) => ({
  fontSize: '48px',
  color: theme.palette.primary.main,
}));

function WeatherWidget() {
  const { auth } = useContext(AuthContext);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Function to select appropriate icon based on weather condition
  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <WbSunnyIcon fontSize="inherit" />;
      case 'Clouds':
        return <CloudIcon fontSize="inherit" />;
      case 'Rain':
      case 'Drizzle':
        return <GrainIcon fontSize="inherit" />;
      case 'Snow':
        return <AcUnitIcon fontSize="inherit" />;
      case 'Thunderstorm':
        return <ThunderstormIcon fontSize="inherit" />;
      default:
        return <CloudIcon fontSize="inherit" />;
    }
  };

  useEffect(() => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_BASE_URL}/weather?latitude=${latitude}&longitude=${longitude}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${auth.token}`,
                },
              }
            );

            if (response.ok) {
              const weatherData = await response.json();
              setWeather(weatherData);
            } else {
              setError(true);
            }
          } catch (err) {
            console.error('Error fetching weather data:', err);
            setError(true);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError(true);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError(true);
      setLoading(false);
    }
  }, [auth.token]);

  return (
    <Card sx={{ maxWidth: 345, margin: 'auto' }}>
      <CardHeader title="Current Weather" />
      <CardContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="150px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="150px"
          >
            <ErrorIcon color="error" sx={{ fontSize: 48 }} />
            <Typography variant="body1" color="error" align="center">
              Unable to fetch weather data.
            </Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <WeatherIcon>{getWeatherIcon(weather.weather[0].main)}</WeatherIcon>
            <Typography variant="h5" component="div" gutterBottom>
              {weather.name}
            </Typography>
            <Typography variant="h4" component="div">
              {Math.round(weather.main.temp)}°C
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {weather.weather[0].description.charAt(0).toUpperCase() +
                weather.weather[0].description.slice(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Humidity: {weather.main.humidity}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Wind Speed: {weather.wind.speed} m/s
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default WeatherWidget;
