const conn = require('../db');
const { StatusCodes } = require('http-status-codes');
const jwt = require("jsonwebtoken");

function addToCart(req, res) {
    const { book_id, quantity } = req.body;
    const user = ensureAuthorization(req);

    if (user instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요.'
        });
    }

    if (user instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: '잘못된 토큰입니다.',
        })
    }

    const sql = 'INSERT INTO cart (book_id, quantity, user_id) VALUES ($1, $2, $3)';
    const values = [book_id, quantity, user.id];

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
    const user = ensureAuthorization(req, res);
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
        conn.query(sql, [user.id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(result.rows);
        })
    })
}

function removeCartItem(req, res) {
    const { bookId } = req.params;

    const user = ensureAuthorization(req);
    const sql = 'DELETE FROM cart WHERE book_id = $1 AND user_id = $2';
    conn.connect(() => {
        conn.query(sql, [Number.parseInt(bookId), user.id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.NO_CONTENT).end();
        })
    })
}

function ensureAuthorization(req) {
    const token = req.headers.authorization;
    try {
        return jwt.verify(token, process.env.SECRET_KEY_BASE);
    } catch(e) {
        return e;
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem,
}
