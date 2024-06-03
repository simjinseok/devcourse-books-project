const conn = require('../db');
const { StatusCodes } = require('http-status-codes');

async function getOrders(req, res) {
    await conn.connect();

    const sql = `
    SELECT
        orders.id,
        orders.book_title,
        orders.total_quantity,
        orders.total_price,
        orders.created_at,
        addresses.address,
        addresses.receiver,
        addresses.contact
    FROM orders
    LEFT JOIN addresses ON addresses.id = orders.address_id 
    `;
    const result = await conn.query(sql);
    res.status(StatusCodes.OK).json(result.rows);
}

async function getOrder(req, res) {
    const id = Number.parseInt(req.params.orderId);
    await conn.connect();

    const sql = `
        SELECT
            ordered_books.book_id,
            books.title,
            books.author,
            books.price,
            ordered_books.quantity
        FROM ordered_books
        LEFT JOIN books ON ordered_books.book_id = books.id
        WHERE ordered_books.order_id = $1
    `;
    const result = await conn.query(sql, [id]);
    console.log(result);
    res.status(StatusCodes.OK).json(result.rows);
}

module.exports = {
    getOrders,
    getOrder,
}