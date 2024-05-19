const conn = require("../db");
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');


function join (req, res) {
    const {email, password} = req.body;

    const sql = "INSERT INTO users (email, password) VALUES ($1, $2)";
    conn.connect(() => {
        conn.query(sql, [email, password], (err, result) => {
            console.log("ddd", err, result);
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            res.status(StatusCodes.CREATED).json(result);
        });
    });
}

function login(req, res) {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = $1';
    conn.connect(() => {
        conn.query(sql, [email], (err, result) => {
            console.log("ddd", err, result);
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = result.rows[0];
            if (user && user.password === password) {
                const token = jwt.sign({
                    email: user.email,
                }, process.env.SECRET_KEY_BASE, {
                    expiresIn: '5m',
                    issuer: 'js',
                });

                res.cookie('token', token, { httpOnly: true });
                res.status(StatusCodes.CREATED).json(result);
            } else {
                res.status(StatusCodes.UNAUTHORIZED).end();
            }
        });
    });

}

function requestPasswordReset(req, res) {
    const { email } = req.body;

    const sql = 'SELECT * FROM users WHERE email = $1';
    conn.connect(() => {
       conn.query(sql, [email], (err, result) => {
          const user = result.rows[0];
          if (user) {
              res.status(StatusCodes.CREATED).end();
          } else {
              res.status(StatusCodes.NOT_FOUND).end();
          }
       });
    });
}

function passwordReset(req, res) {
    const { email, password } = req.body;

    const sql = 'UPDATE users SET password=$1 WHERE email=$2';
    conn.connect(() => {
        conn.query(sql, [password, email], (err, result) => {
            if (result.rowCount > 0) {
                res.status(StatusCodes.OK).end();
            } else {
                res.status(StatusCodes.BAD_REQUEST).end();
            }
        });
    });
}

module.exports = {
    join,
    login,
    requestPasswordReset,
    passwordReset,
};