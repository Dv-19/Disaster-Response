// frontend/src/components/government/GovernmentDashboard.js

import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  Snackbar,
  Alert,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Map as MapIcon,
  Notifications as NotificationsIcon,
  Report as ReportIcon,
} from '@mui/icons-material';
import LogoutButton from '../common/LogoutButton';
import DistressSignalsMap from './DistressSignalsMap';
import ResourceRequestsList from './ResourceRequestsList';
import VolunteersList from './VolunteersList';
import IncidentReporting from './IncidentReporting';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/Dashboard.css';

const drawerWidth = 240;

// Define the sections for the Drawer
const sections = [
  { text: 'Distress Signals', icon: <MapIcon /> },
  { text: 'Resource Requests', icon: <AssignmentIcon /> },
  { text: 'Volunteers', icon: <PeopleIcon /> },
  { text: 'Incident Reporting', icon: <ReportIcon /> },
  // Add more sections as needed
];

function GovernmentDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Distress Signals');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const { auth } = useContext(AuthContext); // Access authentication state

  // Toggle the Drawer open state
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle section selection from the Drawer
  const handleSectionSelect = (section) => {
    // Role-based access control (example: only Admin can access Incident Reporting)
    if (section === 'Incident Reporting' && auth.role !== 'Admin') {
      setSnackbar({
        open: true,
        message: 'You do not have permission to access this section.',
        severity: 'error',
      });
      return;
    }
    setSelectedSection(section);
    if (!isSmUp) {
      setMobileOpen(false); // Close Drawer on mobile after selection
    }
  };

  // Handle Snackbar close event
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Define the Drawer content
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Government Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {sections.map((item) => (
          <ListItemButton
            key={item.text}
            selected={selectedSection === item.text}
            onClick={() => handleSectionSelect(item.text)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tooltip title={item.text} placement="right" arrow>
              <ListItemIcon>{item.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      {/* Additional sections or links can be added here */}
    </div>
  );

  // Function to render the selected section's component
  const renderSection = () => {
    switch (selectedSection) {
      case 'Distress Signals':
        return <DistressSignalsMap setSnackbar={setSnackbar} />;
      case 'Resource Requests':
        return <ResourceRequestsList setSnackbar={setSnackbar} />;
      case 'Volunteers':
        return <VolunteersList setSnackbar={setSnackbar} />;
      case 'Incident Reporting':
        return <IncidentReporting setSnackbar={setSnackbar} />;
      // Add more cases as needed
      default:
        return <DistressSignalsMap setSnackbar={setSnackbar} />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.primary.main, // Use theme's primary color
          boxShadow: 3, // Add a subtle shadow for depth
        }}
      >
        <Toolbar>
          {/* Menu button for mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} // Hide on larger screens
          >
            <MenuIcon />
          </IconButton>
          {/* Dashboard Title */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Government Dashboard
          </Typography>
          {/* Notifications Icon with Badge */}
          <Tooltip title="Notifications" arrow>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* Logout Button */}
          <LogoutButton />
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="dashboard sections"
      >
        {/* Temporary Drawer for Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Improve performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          aria-label="mobile navigation drawer"
        >
          {drawer}
        </Drawer>
        {/* Permanent Drawer for Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
          aria-label="permanent navigation drawer"
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // Adjust for AppBar height
          backgroundColor: theme.palette.background.default, // Use theme's background color
          minHeight: '100vh', // Ensure it covers the full viewport height
        }}
      >
        {renderSection()}
      </Box>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GovernmentDashboard;
