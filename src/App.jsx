import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Login } from './components/Login';
import { ProductList } from './components/ProductList';

const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
                <ProductList />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
