import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Enable CORS for the React application
app.use(cors({
  origin: '*', // http://localhost:5173 or http://localhost:5174 react dev server URL
  credentials: true
}));

// Proxy middleware configuration
app.use('/api', createProxyMiddleware({
  target: 'https://api.holded.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/invoicing/v1' // Rewrite path
  },

  // Add API Key to the request headers
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('key', '87abe867da54d8240d912424b7ca567b');
  }
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});