const conn = require("../db");
const { StatusCodes } = require('http-status-codes');

function categories (req, res) {
    const sql = 'SELECT * FROM categories';

    conn.connect(() => {
        conn.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(result.rows);
        })
    })
}

module.exports = {
    categories
}