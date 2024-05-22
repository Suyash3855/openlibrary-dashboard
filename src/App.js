import React from 'react';
import { Container, Typography } from '@mui/material';
import BookTable from './Components/BookTable';
import './App.css';

function App() {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                OpenLibrary Books Dashboard
            </Typography>
            <BookTable />
        </Container>
    );
}

export default App;
