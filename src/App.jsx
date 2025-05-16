import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ProductList } from './components/ProductList';
import { InvoiceList } from './components/InvoiceList';
import { NavigationBar } from './components/NavigationBar';
import { ChatBot } from './components/ChatBot';

const theme = createTheme();

function App() {
  
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavigationBar />
        <Routes>
          <Route
            path="/"
            element={
                <ProductList products={products} setProducts={setProducts} />
            }
          />
          <Route
            path="/invoices"
            element={
                <InvoiceList invoices={invoices} setInvoices={setInvoices} />
            }
          />
        </Routes>
        <ChatBot products={products} invoices={invoices} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
