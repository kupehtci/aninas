import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    Fab,
    Collapse
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

// products and invoices are passed as props from the parent component, ChatBot in this case
// products needs to be an array of objects 
// invoices are the list of objects
export const ChatBot = ({ products, invoices }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // Process the query and generate response
        const response = processQuery(input, products, invoices);
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);

        setInput('');
    };

    const processQuery = (query, products, invoices) => {
        const lowerQuery = query.toLowerCase();

        // Handle product-related queries
        if (lowerQuery.includes('product') || lowerQuery.includes('item')) {
            if (lowerQuery.includes('how many') || lowerQuery.includes('count')) {
                return `There are ${products?.length || 0} products in the system.`;
            }
            // Add more product-related query handling
        }

        // Handle invoice-related queries
        if (lowerQuery.includes('invoice') || lowerQuery.includes('bill')) {
            if (lowerQuery.includes('how many') || lowerQuery.includes('count')) {
                return `There are ${invoices?.length || 0} invoices in the system.`;
            }
            // Add more invoice-related query handling
        }

        return "I'm sorry, I don't understand that query. You can ask me about products or invoices.";
    };

    return (
        <>
            {/* Floating chat button */}
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {/* Chat window */}
            <Collapse in={isOpen} sx={{ position: 'fixed', bottom: 80, right: 16, zIndex: 1000 }}>
                <Paper
                    elevation={3}
                    sx={{
                        width: 320,
                        height: 400,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Chat header */}
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h6">AI Assistant</Typography>
                    </Box>

                    {/* Messages area */}
                    <List
                        sx={{
                            flex: 1,
                            overflow: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {messages.map((message, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    flexDirection: 'column',
                                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1,
                                        bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                                        color: message.sender === 'user' ? 'white' : 'text.primary',
                                        maxWidth: '80%'
                                    }}
                                >
                                    <ListItemText primary={message.text} />
                                </Paper>
                            </ListItem>
                        ))}
                    </List>

                    {/* Input area */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Ask about products or invoices..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <IconButton color="primary" onClick={handleSend}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            </Collapse>
        </>
    );
};