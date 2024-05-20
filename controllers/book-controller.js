const conn = require('../db');
const {StatusCodes} = require("http-status-codes");

function getBooks(req, res) {

}

function getBook(req, res) {
    const id = Number.parseInt(req.params.id);

    const sql = 'SELECT * FROM books WHERE id = $1';
    conn.connect(() => {
        conn.query(sql, [id], (err, result) => {
            console.log(result);
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (result.rows[0]) {
                return res.status(StatusCodes.OK).json(result.rows[0]);
            }

            res.status(StatusCodes.NOT_FOUND).end();
        });
    });
}


module.exports = {
    getBooks,
    getBook,
}