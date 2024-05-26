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
    const userId = Number.parseInt(req.query.user_id);
    const id = Number.parseInt(req.params.id);

    const sql = 'SELECT ' +
        'books.id AS id, title, img, form, isbn, summary, detail, author, pages, contents, price, pub_date, categories.name as category_name, ' +
        '(SELECT count(*) FROM likes WHERE book_id=books.id) AS likes, ' +
        '(SELECT EXISTS (SELECT * FROM likes WHERE user_id = $1 AND book_id = $2)) AS liked ' +
        'FROM books LEFT JOIN categories ON books.category_id = categories.id WHERE books.id = $2';
    const values = [userId, id];
    conn.connect(() => {
        conn.query(sql, values, (err, result) => {
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