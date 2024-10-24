// frontend/src/components/public/NewsFeed.js

import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import ArticleIcon from '@mui/icons-material/Article';

function NewsFeed() {
  const { auth } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [locality, setLocality] = useState('');
  const [locationError, setLocationError] = useState('');

  // Function to perform reverse geocoding using Nominatim API
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'Disaster-Response-App', // Nominatim requires a valid User-Agent
            'Accept-Language': 'en', // Optional: specify language
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reverse geocode location.');
      }

      const data = await response.json();

      // Extract state or zone
      const state =
        data.address.state ||
        data.address.region || // Some responses might use 'region' instead of 'state'
        data.address.state_district ||
        data.address.county ||
        data.address.municipality ||
        data.address.city_district ||
        'global'; // Fallback to 'global' if state is not found

      return state;
    } catch (err) {
      console.error('Reverse Geocoding Error:', err);
      return 'global'; // Fallback to 'global' on error
    }
  };

  // Function to fetch news based on locality
  const fetchNews = async (currentLocality) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/news?locality=${encodeURIComponent(currentLocality)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching news articles:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to obtain user's location on component mount
  useEffect(() => {
    // Check if Geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Perform reverse geocoding to get state or zone
          const currentLocality = await reverseGeocode(latitude, longitude);
          setLocality(currentLocality);

          // Fetch news based on the obtained locality
          fetchNews(currentLocality);
        },
        (error) => {
          console.error('Geolocation Error:', error);
          setLocationError('Unable to retrieve location. Displaying global news.');
          // Fetch global news as a fallback
          fetchNews('global');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationError('Geolocation is not supported. Displaying global news.');
      // Fetch global news as a fallback
      fetchNews('global');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Latest News {locality && ` - ${locality}`}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {locationError && (
              <Typography variant="body2" color="error" gutterBottom>
                {locationError}
              </Typography>
            )}
            {error ? (
              <Box display="flex" alignItems="center" my={2}>
                <ArticleIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2" color="error">
                  Unable to fetch news articles.
                </Typography>
              </Box>
            ) : articles.length > 0 ? (
              <List>
                {articles.map((article, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ArticleIcon color="primary" sx={{ mr: 2 }} />
                    <ListItemText
                      primary={
                        <MuiLink
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          {article.title}
                        </MuiLink>
                      }
                      secondary={article.description}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No news articles available.
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default NewsFeed;
