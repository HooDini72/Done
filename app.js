var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var jwt = require('jsonwebtoken');
/*
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET env var is not defined.');
    process.exit(1);
}
*/
var userRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get(["/login", "/register"], function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public', '/login.html'));
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    req.jwtProvided = false;
    req.jwtVerifyError = false;
    req.jwtExpired = false;
    req.jwtPayload = null;

    if (token) {
        req.jwtProvided = true;
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                req.jwtVerifyError = true;
                if (err.name === 'TokenExpiredError') {
                    req.jwtExpired = true;
                }
            } else {
                req.jwtPayload = decoded;
            }
            next();
        });
    } else {
        next();
    }
}

app.use(verifyToken);
app.use('/user_handling', userRouter);

module.exports = app;
