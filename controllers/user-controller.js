const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const conn = require("../db");
const { StatusCodes } = require('http-status-codes');

function join (req, res) {
    const {email, password} = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = getHashedPassword(password, salt);

    const sql = "INSERT INTO users (email, password, salt) VALUES ($1, $2, $3)";
    conn.connect(() => {
        conn.query(sql, [email, hashPassword, salt], (err, result) => {
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
            if (user) {
                const hashPassword = getHashedPassword(password, user.salt);
                if (user.password === hashPassword) {
                    const token = jwt.sign({
                        id: user.id,
                        email: user.email,
                    }, process.env.SECRET_KEY_BASE, {
                        expiresIn: '5m',
                        issuer: 'js',
                    });

                    res.cookie('token', token, { httpOnly: true });
                    return res.status(StatusCodes.CREATED).json(result);
                }
            }

            res.status(StatusCodes.UNAUTHORIZED).end();
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

    const salt = crypto.randomBytes(10).toString("base64");
    const hashPassword = getHashedPassword(password, salt);
    const sql = 'UPDATE users SET password=$1, salt=$2 WHERE email=$3';
    conn.connect(() => {
        conn.query(sql, [hashPassword, salt, email], (err, result) => {
            if (result.rowCount > 0) {
                res.status(StatusCodes.OK).end();
            } else {
                res.status(StatusCodes.BAD_REQUEST).end();
            }
        });
    });
}

function getHashedPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
}

module.exports = {
    join,
    login,
    requestPasswordReset,
    passwordReset,
};