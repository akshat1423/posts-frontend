import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from './AuthContext';

const NavigationBar = () => {
    const { currentUser, logout } = useAuth();
    console.log(currentUser);
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}><Link to="/" style={{textDecoration:"None", color:"White"}}>AxePosts</Link></Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                {currentUser ? (
                    <>
                        <Typography color="inherit" sx={{ margin: '0 10px' }}>
                            Hello, {currentUser}
                        </Typography>
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    </>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
