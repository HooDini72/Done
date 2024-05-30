var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var jwt = require('jsonwebtoken');
const WebSocket = require('ws');
/*
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET env var is not defined.');
    process.exit(1);
}
*/
var userRouter = require('./routes/user');
var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get(["/login", "/register"], function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public', '/login.html'));
});

function verifyRequest(req) {
    let token = req.headers['authorization'];
    req.jwtProvided = false;
    req.jwtVerifyError = false;
    req.jwtExpired = false;
    req.jwtPayload = null;

    if (token) {
        console.log(`> Authorization: Token "${token}" provided as Authorization-header`)
        token = token.replace("Bearer ", "")
        req.jwtProvided = true;
        jwt.verify(token, process.env.ACCESS_TOKE_SECRET, (err, decoded) => {
            if (err) {
                req.jwtVerifyError = true;
                // Check if the error is because the JWT has expired
                if (err.name === 'TokenExpiredError') {
                    req.jwtExpired = true; // You can add this line to indicate specifically that the JWT expired
                }
            } else {
                // console.log("JWT: ", decoded)
                req.jwtPayload = decoded;
            }
        });
    } else {
        console.log("> Authorization: No token provided as Authorization-header")
    }
}

function verifyMiddleware(req, res, next) {
    console.log(`Verify token on request to ${req.url}`)
    verifyRequest(req)
    if (!req.jwtProvided) {
        console.log(`>>> Not authorized, no token provided`)
    } else if (req.jwtProvided && !req.jwtVerifyError) {
        console.log(`>>> Authorized`)
    } else if (req.jwtProvided && req.jwtVerifyError && req.jwtExpired) {
        console.log(`>>> Not authorized, token expired`)
    } else {
        console.log(`>>> Not authorized, error during token verification`)
    }
    next()
}

app.use(verifyMiddleware);
app.use('/user_handling', userRouter);
app.use('/api', apiRouter);




module.exports = app;
