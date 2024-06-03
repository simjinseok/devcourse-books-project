const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use('/', require('./routes/users'));
app.use('/books', require('./routes/books'));
app.use('/likes', require('./routes/likes'));
app.use('/categories', require('./routes/categories'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/orders', require('./routes/orders'));

app.listen(process.env.PORT);