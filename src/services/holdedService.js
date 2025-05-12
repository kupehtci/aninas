import axios from 'axios';
import { HOLDED_CONFIG, ENDPOINTS } from '../config/odoo';

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