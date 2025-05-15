import axios from 'axios';
import { HOLDED_CONFIG, ENDPOINTS } from '../config/holded_config';

const api = axios.create({
    baseURL: HOLDED_CONFIG.baseURL,
    headers: HOLDED_CONFIG.headers
});

export const holdedService = {
    async login(username, password) {
        if(username === 'admin' && password === 'admin') {
            return true;
        }
        return false;
    },

    async getProducts() {
        try {
            const response = await api.get(ENDPOINTS.products);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products from Holded');
        }
    },

    async getInvoices() {
        try {
            const response = await api.get(ENDPOINTS.invoices);
            
            console.log("ENPDPOINTS invoices", ENDPOINTS.invoices); 
            console.log('Invoices response:', response.data);

            // Ensure we return an array of invoices
            if (response.data) {
                if (Array.isArray(response.data)) {
                    return response.data;
                } else if (typeof response.data === 'object') {
                    // Check common API response patterns
                    if (response.data.items && Array.isArray(response.data.items)) {
                        return response.data.items;
                    } else if (response.data.invoices && Array.isArray(response.data.invoices)) {
                        return response.data.invoices;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        return response.data.data;
                    }
                }
            }
            
            // If we couldn't find an array in the response, return an empty array
            console.warn('Unexpected API response format:', response.data);
            return [];
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw new Error('Failed to fetch invoices from Holded');
        }
    },

    async downloadInvoice(orderId) {
        try {
            const response = await api.get(`${ENDPOINTS.invoice}/${orderId}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw new Error('Failed to download invoice');
        }
    }
};