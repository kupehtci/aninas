import { useState, useEffect } from 'react';
import { 
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { holdedService } from '../services/holdedService';

export const ProductList = ({ products, setProducts }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await holdedService.getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            await holdedService.downloadInvoice(orderId);
        } catch (err) {
            setError('Failed to download invoice. Please try again later.');
        }
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
                <Typography variant="h4" component="h1" gutterBottom>
                    Available Products
                </Typography>
                <Button 
                    component={Link} 
                    to="/invoices" 
                    variant="contained" 
                    color="primary"
                >
                    View Invoices
                </Button>
            </Box>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card>
                            {/* {product.image_url && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image_url}
                                    alt={product.name}
                                />
                            )} */}
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="h2">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {product.description}
                                </Typography>
                                {
                                    product.stock > 0 && (
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Stock: {product.stock || 'Not available'}
                                        </Typography>
                                    ) || (
                                        <Typography variant="body2" color="red" gutterBottom>
                                            Stock: Out of stock
                                        </Typography>
                                    )
                                }
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Base Price: €{product.price?.toFixed(2) || 'N/A'}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Total Price (with taxes): €{product.total?.toFixed(2) || 'N/A'}
                                </Typography>
                                {
                                    product.warehouseId && (
                                        <Typography variant="body2" color="primary" gutterBottom>
                                            Warehouse ID: {product.warehouseId}
                                        </Typography>
                                    ) || (
                                        <Typography variant="body2" color="primary" gutterBottom>
                                            Warehouse ID: Not available
                                        </Typography>
                                    )
                                }
                                {product.order_id && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDownloadInvoice(product.order_id)}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Download Invoice
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};