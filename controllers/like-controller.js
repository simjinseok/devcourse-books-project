const conn = require('../db');
const { StatusCodes } = require('http-status-codes');

function like(req, res) {
    const { book_id } = req.params;
    const { user_id } = req.body;

    const sql = 'INSERT INTO likes (user_id, book_id) VALUES ($1, $2)';
    const values = [book_id, user_id];

    conn.connect(() => {
        conn.query(sql, values, (err, result) => {
            if (result.rowCount > 0) {
                return res.status(StatusCodes.CREATED).json(result.rows);
            }

            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        })
    })
}

function unlike(req, res) {
    const { book_id } = req.params;
    const { user_id } = req.body;

    const sql = 'DELETE FROM likes WHERE user_id = $1 AND book_id = $2';
    const values = [user_id, book_id];
    conn.connect(() => {
        conn.query(sql, values, (err, result) => {
            console.log('result', result)
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.NO_CONTENT).end();
        })
    })
}

module.exports = {
  like,
  unlike,
};