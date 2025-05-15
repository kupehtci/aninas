import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ProductList } from './components/ProductList';
import { InvoiceList } from './components/InvoiceList';
import {NavigationBar} from './components/NavigationBar';

const theme = createTheme();

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavigationBar />
        <Routes>
          <Route
            path="/"
            element={
                <ProductList />
            }
          />
          <Route
            path="/invoices"
            element={
                <InvoiceList />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
