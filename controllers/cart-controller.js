const conn = require('../db');
const { StatusCodes } = require('http-status-codes');

function addToCart(req, res) {
    const { book_id, quantity, user_id } = req.body;

    const sql = 'INSERT INTO cart (book_id, quantity, user_id) VALUES ($1, $2, $3)';
    const values = [book_id, quantity, user_id];

    conn.connect(() => {
        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(result);
        })
    })
}

function getCartItems(req, res) {
    const { user_id } = req.query;
    const sql = `SELECT 
                        cart.id, 
                        cart.book_id,
                        books.title, 
                        books.summary,
                        books.price,
                        cart.quantity
                       FROM cart
                       LEFT JOIN books ON cart.book_id = books.id
                       WHERE user_id = $1`;
    conn.connect(() => {
        conn.query(sql, [Number.parseInt(user_id) ], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(result.rows);
        })
    })
}

function removeCartItem(req, res) {
    const { id } = req.params;

    const sql = 'DELETE FROM cart WHERE id = $1';
    conn.connect(() => {
        conn.query(sql, [Number.parseInt(id)], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.NO_CONTENT).end();
        })
    })
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem,
}
