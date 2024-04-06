import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button } from '@mui/material';
import { useAuth } from '../AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api-token-auth/', credentials);
      localStorage.setItem('token', response.data.token);
      
      const userName = credentials.username;
      localStorage.setItem('userName', userName);
      
      console.log(userName)
      await login(userName);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          onChange={handleChange}
          value={credentials.username}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={handleChange}
          value={credentials.password}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
      </form>
    </Container>
  );
}

export default Login;
