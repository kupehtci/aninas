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

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // Process the query and generate response
        const response = await processQuery(input, products, invoices);
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);

        setInput('');
    };

    const processQuery = async (query, products, invoices) => {
        const lowerQuery = query.toLowerCase();

        // Handle product-related queries
        if (lowerQuery.includes('product') || lowerQuery.includes('item')) {
            
            const response =  await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": "Bearer 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",
                  "HTTP-Referer": "www.aninas-shop.com", // Optional. Site URL for rankings on openrouter.ai.
                  "X-Title": "www.aninas-shop.com", // Optional. Site title for rankings on openrouter.ai.
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  "model": "meta-llama/llama-3.3-8b-instruct:free",
                  "messages": [
                    {
                      "role": "user",
                      "content": lowerQuery + " and take into account that i have this products: " + JSON.stringify(products)
                    }
                  ]
                })
              });

              const data = await response.json();
              console.log(data);
              return data.choices[0].message.content;

              
        }

        // Handle invoice-related queries
        if (lowerQuery.includes('invoice') || lowerQuery.includes('bill')) {
            
        const response =  await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "HTTP-Referer": "www.aninas-shop.com", 
                "X-Title": "www.aninas-shop.com",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.3-8b-instruct:free",
                "messages": [
                {
                    "role": "user",
                    "content": lowerQuery + " and take into account that i have this invoices: " + JSON.stringify(invoices) + "But dont show this information on  chat, only answer the question i ask you"
                }
                ]
            })
            });

            const data = await response.json();
            console.log(data);
            return data.choices[0].message.content;
            
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