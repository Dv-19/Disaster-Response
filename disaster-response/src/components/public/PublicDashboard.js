// frontend/src/components/public/PublicDashboard.js

import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import LogoutButton from '../common/LogoutButton';
import WeatherWidget from './WeatherWidget';
import ResourceRequestForm from './ResourceRequestForm';
import NewsFeed from './NewsFeed';
import SOSButton from './SOSButton';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

// Styled component for the dashboard header
const DashboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

function PublicDashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ padding: theme.spacing(4) }}>
      {/* Header */}
      <DashboardHeader>
        <Typography variant="h4" component="h1">
          Public Dashboard
        </Typography>
        <LogoutButton />
      </DashboardHeader>

      {/* SOS Button */}
      <Box sx={{ textAlign: 'center', marginBottom: theme.spacing(4) }}>
        <SOSButton />
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Weather Widget */}
        <Grid item xs={12} md={6} lg={4}>
          <WeatherWidget />
        </Grid>

        {/* Resource Request Form */}
        <Grid item xs={12} md={6} lg={4}>
          <ResourceRequestForm />
        </Grid>

        {/* News Feed */}
        <Grid item xs={12} md={12} lg={4}>
          <NewsFeed />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PublicDashboard;
