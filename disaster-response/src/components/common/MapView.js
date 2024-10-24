// src/components/common/MapView.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function MapView({ location, markers }) {
  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const defaultCenter = {
    lat: location.latitude,
    lng: location.longitude,
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
        {markers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.latitude, lng: marker.longitude }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapView;
