const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use('/', require('./routes/users'));
app.use('/books', require('./routes/books'));
app.use('/categories', require('./routes/categories'));

app.listen(process.env.PORT);