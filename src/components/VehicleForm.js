import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const VehicleForm = () => {
  const [carModel, setCarModel] = useState('');
  const [price, setPrice] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [maxPictures, setMaxPictures] = useState(1);
  const [pictures, setPictures] = useState([]);
  const [previewPictures, setPreviewPictures] = useState([]);
  const [modelError, setModelError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [phError, setPhError] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location?.state && !localStorage.getItem('token')) {
      navigate('/')
    }
  }, []);


  const handlePictureChange = (e) => {
    if (previewPictures.length >= maxPictures) {
      setInfoMessage('Pictures max limit exceed')
      setSeverity('warning')
      setIsSnackbarOpen(true)
      return
    }
    const selectedPictures = Array.from(e.target.files);
    const previews = selectedPictures.map((picture) => URL.createObjectURL(picture));
    setPreviewPictures([...previewPictures, previews]);
    setPictures(selectedPictures);
  };

  const handleValidation = () => {
    if (!carModel) {
      setModelError('Model is Required')
    }
    else {
      setModelError('')
    }
    if (!price) {
      setPriceError('Price is Required')
    }
    else {
      setPriceError('')
    }
    if (!phoneNumber) {
      setPhError('Phone Number is Required')
    }
    else {
      setPhError('')
    }
    if (!carModel || !price || !phoneNumber) {
      setIsLoading(false)
      return false
    }
    return true
  }

  const makeStatesEmpty = () => {
    setCarModel('')
    setPrice('')
    setPhoneNumber('')
    setMaxPictures(1)
    setPreviewPictures([])
    setPictures([])
  }

  const handleSubmit = async () => {

    setIsLoading(true)
    let isValid = await handleValidation()
    if (!isValid) {
      return false
    }

    let data = {
      model: carModel,
      price: price,
      phno: phoneNumber,
    }

    axios.post('https://happy-jay-sweatsuit.cyclic.app/users/vehicles', data)
      .then((response) => {
        if (response.data.success) {
          setInfoMessage('Vehicle Created Successfully')
          setSeverity('success')
          setIsSnackbarOpen(true)
          makeStatesEmpty()
          setIsLoading(false)
        } else {
          setInfoMessage('Error occurred while creating vehicle')
          setSeverity('error')
          setIsSnackbarOpen(true)
          setIsLoading(false)
        }
      })
      .catch(err => {
        console.log("Error: ", err)
        setInfoMessage('Error occurred while creating vehicle')
        setSeverity('error')
        setIsSnackbarOpen(true)
        setIsLoading(false)
      })
  };

  return (
    <div style={{ width: "50%", margin: "50px auto" }}>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Vehicle Form</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Car Model *"
                variant="outlined"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                fullWidth
                error={Boolean(modelError)}
                helperText={modelError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price *"
                variant="outlined"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                error={Boolean(priceError)}
                helperText={priceError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number *"
                variant="outlined"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                error={Boolean(phError)}
                helperText={phError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Max Number of Pictures"
                variant="outlined"
                type="number"
                value={maxPictures}
                onChange={(e) => setMaxPictures(e.target.value)}
                inputProps={{ min: 1, max: 10 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <input id='fileInput' type="file" multiple onChange={handlePictureChange} />
              <div>
                {previewPictures.map((url, index) => (
                  <>
                    <img
                      key={index}
                      src={url}
                      alt={`preview-${index}`}
                      style={{ width: '100px', height: '100px', margin: '5px' }}
                    />
                  </>
                ))}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {isLoading ? "Submit..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isSnackbarOpen}
            autoHideDuration={6000}
            onClose={() => {
              setIsSnackbarOpen(false)
              setInfoMessage('')
            }}
            message={infoMessage ? infoMessage : "Done!"}
          >
            <Alert
              onClose={() => {
                setIsSnackbarOpen(false)
                setInfoMessage('')
              }}
              severity={severity}
              sx={{ width: '100%' }}
            >
              {infoMessage}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleForm;