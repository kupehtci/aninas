import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom'; 

export const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <AppBar position="static" sx={{ mb: 4 }} >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Aninas Store
          </Typography>
          <Button 
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ 
              backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Products
          </Button>
          <Button 
            color="inherit"
            onClick={() => navigate('/invoices')}
            sx={{ 
              ml: 2,
              backgroundColor: location.pathname === '/invoices' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Invoices
          </Button>
        </Toolbar>
      </AppBar>
    );
  };