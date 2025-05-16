import React, { useState, useEffect } from 'react';
import { 
    Container,
    Typography,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link } from 'react-router-dom';
import { holdedService } from '../services/holdedService';

export const InvoiceList = ({ invoices, setInvoices }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await holdedService.getInvoices();
            // Ensure data is an array before setting it
            if (Array.isArray(data)) {
                setInvoices(data);
            } else if (data && typeof data === 'object') {
                // If data is an object but not an array, it might contain invoices in a property
                // Check common API response patterns
                if (data.items && Array.isArray(data.items)) {
                    setInvoices(data.items);
                } else if (data.invoices && Array.isArray(data.invoices)) {
                    setInvoices(data.invoices);
                } else if (data.data && Array.isArray(data.data)) {
                    setInvoices(data.data);
                } else {
                    // If we can't find an array in the response, set an empty array
                    console.error('Unexpected API response format:', data);
                    setInvoices([]);
                }
                console.log('Invoices:', data);
            } else {
                // If data is null, undefined, or a primitive, set an empty array
                console.error('Invalid API response:', data);
                setInvoices([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError('Failed to load invoices. Please try again later.');
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (invoiceId) => {
        try {
            await holdedService.downloadInvoice(invoiceId);
        } catch (err) {
            setError('Failed to download invoice. Please try again later.Error: ' + err);
        }
    };

    const handleReturnInvoice = async (invoiceId) => {
        try{

        }
        catch(err){
            setError('Failed to download invoice. Please try again later.');
        }
    }
    
    const toggleProductList = (invoiceId) => {
        setExpandedRows(prev => ({
            ...prev,
            [invoiceId]: !prev[invoiceId]
        }));    
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ padding: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Invoices
                </Typography>
                <Button 
                    component={Link} 
                    to="/" 
                    variant="contained" 
                    color="primary"
                >
                    View Products
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(invoices) && invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <React.Fragment key={invoice.id}>
                                    <TableRow>
                                        <TableCell>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => toggleProductList(invoice.id)}
                                            >
                                                {expandedRows[invoice.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                            {invoice.id}
                                        </TableCell>
                                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{invoice.customer?.name || invoice.contactName || 'N/A'}</TableCell>
                                        <TableCell>€{invoice.total?.toFixed(2) || 'N/A'}</TableCell>
                                        <TableCell>{invoice.status || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="contained" 
                                                size="small"
                                                // color=
                                                onClick={() => handleDownloadInvoice(invoice.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Download
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleReturnInvoice(invoice.id)}
                                            >
                                                Return
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={expandedRows[invoice.id]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Products
                                                    </Typography>
                                                    {invoice.products && invoice.products.length > 0 ? (
                                                        <List>
                                                            {invoice.products.map((product, index) => (
                                                                <React.Fragment key={index}>
                                                                    <ListItem>
                                                                        <ListItemText
                                                                            primary={product.name}
                                                                            secondary={
                                                                                <>
                                                                                    <Typography component="span" variant="body2" color="text.primary">
                                                                                        Description: {product.desc || 'No description'}
                                                                                    </Typography>
                                                                                    <br />
                                                                                    <Typography component="span" variant="body2">
                                                                                        Price: €{product.price?.toFixed(2) || 'N/A'} | Units: {product.units} | Tax: {product.tax}%
                                                                                    </Typography>
                                                                                </>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                    {index < invoice.products.length - 1 && <Divider />}
                                                                </React.Fragment>
                                                            ))}
                                                        </List>
                                                    ) : (
                                                        <Typography variant="body2">No products found for this invoice</Typography>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No invoices found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};