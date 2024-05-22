import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, TablePagination, TextField, Button } from '@mui/material';

const columns = [
    { id: 'ratings_average', label: 'Ratings Average' },
    { id: 'author_name', label: 'Author Name' },
    { id: 'title', label: 'Title' },
    { id: 'first_publish_year', label: 'First Publish Year' },
    { id: 'subject', label: 'Subject' },
    { id: 'author_birth_date', label: 'Author Birth Date' },
    { id: 'author_top_work', label: 'Author Top Work' },
];

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [page, rowsPerPage, order, orderBy, searchQuery]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`https://openlibrary.org/search.json?q=${searchQuery}&limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
            const booksData = response.data.docs.map(book => ({
                ratings_average: book.ratings_average || 'N/A',
                author_name: book.author_name ? book.author_name.join(', ') : 'N/A',
                title: book.title,
                first_publish_year: book.first_publish_year,
                subject: book.subject ? book.subject.join(', ') : 'N/A',
                author_birth_date: book.author_birth_date || 'N/A',
                author_top_work: book.author_top_work || 'N/A',
            }));
            setBooks(booksData);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper>
            <TextField
                label="Search by Author"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    sortDirection={orderBy === column.id ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={orderBy === column.id ? order : 'asc'}
                                        onClick={() => handleRequestSort(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {book[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 50, 100]}
                component="div"
                count={10000} // You might want to set this to the total count from the API response
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default BookTable;
