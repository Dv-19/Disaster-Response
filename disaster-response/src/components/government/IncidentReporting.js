// frontend/src/components/government/IncidentReporting.js

import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { AuthContext } from '../../contexts/AuthContext';

// Fix Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Component to handle map clicks and set marker position
 */
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

function IncidentReporting() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const { auth } = useContext(AuthContext); // Access authentication state

  // Predefined list of departments/agencies to assign incidents
  const departments = [
    'Emergency Services',
    'Public Works',
    'Environmental Agency',
    'Health Department',
    'Law Enforcement',
    // Add more departments/agencies as needed
  ];

  /**
   * Handle form submission
   * @param {object} data - Form data
   */
  const onSubmit = async (data) => {
    if (!position) {
      setSnackbar({
        open: true,
        message: 'Please select a location on the map.',
        severity: 'error',
      });
      return;
    }

    if (attachments.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please attach at least one supporting document or image.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    // Prepare form data for multipart/form-data
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('severity', data.severity);
    formData.append('description', data.description);
    data.assignTo.forEach((dept) => formData.append('assignTo', dept));
    formData.append('location.latitude', position.lat);
    formData.append('location.longitude', position.lng);
    attachments.forEach((file) => formData.append('attachments', file));

    try {
      const response = await fetch('/api/incidents', { // Using proxy
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Incident reported successfully.',
          severity: 'success',
        });
        reset();
        setPosition(null);
        setAttachments([]);
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.errors?.map((err) => err.msg).join(', ') ||
          errorData.message ||
          'Failed to report incident.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error reporting incident:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Snackbar close event
   */
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Report an Incident
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 2 }}
        >
          {/* Incident Category */}
          <Controller
            name="category"
            control={control}
            defaultValue=""
            rules={{ required: 'Category is required.' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Category"
                fullWidth
                margin="normal"
                error={!!errors.category}
                helperText={errors.category ? errors.category.message : ''}
              >
                <MenuItem value="Flood">Flood</MenuItem>
                <MenuItem value="Earthquake">Earthquake</MenuItem>
                <MenuItem value="Fire">Fire</MenuItem>
                <MenuItem value="Storm">Storm</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            )}
          />

          {/* Incident Severity */}
          <Controller
            name="severity"
            control={control}
            defaultValue=""
            rules={{ required: 'Severity is required.' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Severity"
                fullWidth
                margin="normal"
                error={!!errors.severity}
                helperText={errors.severity ? errors.severity.message : ''}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            )}
          />

          {/* Assign To */}
          <Controller
            name="assignTo"
            control={control}
            defaultValue={[]}
            rules={{ required: 'At least one department/agency must be selected.' }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.assignTo}>
                <InputLabel id="assign-to-label">Assign To</InputLabel>
                <Select
                  {...field}
                  labelId="assign-to-label"
                  multiple
                  input={<OutlinedInput label="Assign To" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
                {errors.assignTo && (
                  <Typography variant="caption" color="error">
                    {errors.assignTo.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {/* Incident Description */}
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{
              required: 'Description is required.',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters long.',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                error={!!errors.description}
                helperText={
                  errors.description ? errors.description.message : ''
                }
              />
            )}
          />

          {/* Attachments */}
          <Controller
            name="attachments"
            control={control}
            defaultValue={[]}
            rules={{
              validate: (files) =>
                files.length > 0 || 'At least one attachment is required.',
            }}
            render={({ field }) => (
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" component="label">
                  Upload Attachments
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleFileChange(e);
                    }}
                  />
                </Button>
                {errors.attachments && (
                  <Typography variant="caption" color="error" display="block">
                    {errors.attachments.message}
                  </Typography>
                )}
                {attachments.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {attachments.length} file(s) selected
                  </Typography>
                )}
              </Box>
            )}
          />

          {/* Location Selection */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Select Location on Map
          </Typography>
          <Box sx={{ height: '300px', width: '100%', mb: 2 }}>
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </Box>
          {position && (
            <Typography variant="body2" gutterBottom>
              Selected Location: Latitude {position.lat.toFixed(4)}, Longitude{' '}
              {position.lng.toFixed(4)}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddLocationIcon />}
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Report Incident'}
          </Button>
        </Box>
      </CardContent>

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
    </Card>
  );
}

export default IncidentReporting;
