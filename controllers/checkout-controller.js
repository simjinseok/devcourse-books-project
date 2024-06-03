const conn = require('../db');
const { StatusCodes } = require('http-status-codes');

async function checkout(req, res) {
    const { cartItems, books, address, totalQuantity, totalPrice, firstBookTitle, userId } = req.body;

    await conn.connect();
    const sql = 'INSERT INTO addresses (address, receiver, contact) VALUES ($1, $2, $3) RETURNING id';
    const values = [address.address, address.receiver, address.contact];
    const addressResult = await conn.query(sql, values);
    const addressId = addressResult.rows[0].id;

    const sql2 = 'INSERT INTO orders (book_title, total_quantity, total_price, user_id, address_id) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const values2 = [firstBookTitle, totalQuantity, totalPrice, userId, addressId];
    const ordersResult = await conn.query(sql2, values2);
    const orderId = ordersResult.rows[0].id;

    const sql3 = 'INSERT INTO ordered_books (order_id, book_id, quantity) VALUES ';
    const values3 = [];
    for (const book of books) {
        values3.push(`(${orderId}, ${book.book_id}, ${book.quantity})`);
    }
    const booksResult = await conn.query(sql3 + values3.join(', '));

    const sql4 = 'DELETE FROM cart WHERE id = ANY($1::integer[])';
    const values4 = [cartItems];
    const cartResult = await conn.query(sql4, values4);

    return res.status(StatusCodes.OK).end();
}

module.exports = {
    checkout,
}