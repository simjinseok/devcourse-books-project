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

}

function requestPasswordReset(req, res) {

}

function passwordReset(req, res) {

}

module.exports = {
    join,
    login,
    requestPasswordReset,
    passwordReset,
};