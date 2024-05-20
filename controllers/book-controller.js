const conn = require('../db');
const {StatusCodes} = require("http-status-codes");

function getBooks(req, res) {
    const categoryId = Number.parseInt(req.query.category_id);
    const isNew = req.query.is_new === 'true';
    const currentPage = req.query.page || 1;
    const perPage = req.query.pageSize || 10;

    let sql = 'SELECT * FROM books WHERE 1=1';
    const values = [];
    if (categoryId) {
        sql += ` AND books.category_id=$${values.length + 1}`;
        values.push(categoryId);
    }

    if (isNew) {
        sql += " AND books.pub_date >= CURRENT_DATE - INTERVAL '1 month'"
    }

    sql += ` LIMIT $${values.length + 1}`;
    values.push(perPage);
    sql += ` OFFSET $${values.length + 1}`;
    values.push(perPage * currentPage);

    console.log(sql);
    conn.connect(() => {
        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (result.rows.length > 0) {
                return res.status(StatusCodes.OK).json(result.rows);
            }

            res.status(StatusCodes.NOT_FOUND).end();
        })
    })
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