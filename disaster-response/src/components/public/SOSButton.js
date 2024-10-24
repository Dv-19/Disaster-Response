import React, { useState, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import EmergencyIcon from '@mui/icons-material/Emergency';
import { AuthContext } from '../../contexts/AuthContext';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

function SOSButton() {
  const { auth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleOpen = () => {
    setOpen(true);
    setFeedback('');
  };

  const handleClose = () => {
    if (!sending) {
      setOpen(false);
      setMessage('');
      setFeedback('');
    }
  };

  const handleSendSOS = async () => {
    setSending(true);
    setFeedback('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/sos`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
              },
              body: JSON.stringify({
                message: message.trim() || 'No message provided', // Optional message handling
                location: {
                  latitude,
                  longitude,
                },
              }),
            }
          );

          const data = await response.json();
          if (response.ok) {
            setFeedback('SOS signal sent successfully.');
            setMessage('');
          } else {
            setFeedback(data.message || 'Failed to send SOS signal.');
          }
        } catch (error) {
          console.error('Error sending SOS signal:', error);
          setFeedback('An error occurred. Please try again.');
        } finally {
          setSending(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setFeedback('Unable to retrieve location. Please allow location access.');
        setSending(false);
      }
    );
  };

  return (
    <>
      <Tooltip title="Send SOS Signal">
        <Button
          variant="contained"
          color="error"
          startIcon={<EmergencyIcon />}
          onClick={handleOpen}
          size="large"
          sx={{
            padding: '12px 24px',
            fontSize: '1.2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
          }}
        >
          Activate SOS Signal
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Send SOS Signal
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Your current location will be shared along with your message.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Message (optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            minRows={3}
            sx={{
              backgroundColor: 'background.paper',
            }}
          />
          {feedback && (
            <Typography
              variant="body2"
              color={feedback.includes('successfully') ? 'success.main' : 'error'}
              mt={2}
            >
              {feedback}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={handleSendSOS}
            color="error"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={sending}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : 'Send SOS'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SOSButton;
