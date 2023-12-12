import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    return () => {
      let user = localStorage.getItem('token')
      if (!!user) {
        localStorage.removeItem('token')
      }
    }
  }, []);

  const isValid = () => {
    if (!email) {
      setEmailError('Email is required');
    }
    else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
    }
    else {
      setPasswordError('');
    }
    if (!email || !password) {
      setIsLoading(false)
      return false
    }
    return true

  }

  const handleLogin = async () => {
    setIsLoading(true)
    let isValidate = await isValid()
    if (!isValidate) {
      return false
    }

    const response = await axios.post('https://happy-jay-sweatsuit.cyclic.app/users', { email, password })

    if (response.data.success) {
      localStorage.setItem('token', JSON.stringify({ userLoggedIn: true, email: email, password: password }))
      navigate('/vehicle', { state: { userLoggedIn: true, email: email, password: password } });
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setIsLoading(false)
  };

  return (
    <div style={{ width: "50%", margin: "50px auto" }}>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Login</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                error={Boolean(emailError)}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                error={Boolean(passwordError)}
                helperText={passwordError}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleLogin}>
                {!!isLoading ? "Login..." : "Login"}
              </Button>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
