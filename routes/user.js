require('dotenv').config();
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../database');

const saltRounds = 10; //how often should be something encrypted

const pwT = bcrypt.hash("testPW", saltRounds);
const testUser1 = { mail: "test@mail.com", pw: pwT };
const userListTesting = [testUser1];


router.post('/login', async function (req, res, next) {
    const { mail, pw } = req.body;

    // Check if data is missing
    if (!mail && !pw) {
        return res.status(400).send({ status: 'fail', message: 'Missing email and password' }); // 400 = bad request
    } else if (!mail) {
        return res.status(400).send({ status: 'fail', message: 'Missing email' }); // 400 = bad request
    } else if (!pw) {
        return res.status(400).send({ status: 'fail', message: 'Missing password' }); // 400 = bad request
    }

    const user = await db.user.findUser(mail);
    console.log(user);
    if (user) {
        const checkPW = await bcrypt.compare(pw, (await user.pw).toString()); //ToDo: ask hwo i can fix this toString!
        if (checkPW) {
            const dataForToken = { mail: user.mail }; //No private secret information within the token!!
            const token = jwt.sign(dataForToken, process.env.ACCESS_TOKE_SECRET, { expiresIn: '1h' });
            res.send({ status: 'success', message: 'Login successful', token: token });
        } else {
            res.status(401).send({ status: 'fail', message: 'Invalid credentials' }); //401 = unauthorized
        }
    } else {
        res.status(401).send({ status: 'fail', message: 'Invalid credentials' }); //401 = unauthorized
    }

});

router.post('/register', async function (req, res, next) {
    const { mail, pw } = req.body

    // Check if data is missing
    if (!mail && !pw) {
        return res.status(400).send({ status: 'fail', message: 'Missing email and password' }); // 400 = bad request
    } else if (!mail) {
        return res.status(400).send({ status: 'fail', message: 'Missing email' }); // 400 = bad request
    } else if (!pw) {
        return res.status(400).send({ status: 'fail', message: 'Missing password' }); // 400 = bad request
    }

    const existingUser = userListTesting.some(user => user.mail === mail);
    if (existingUser) {
        res.status(409).send({ status: 'fail', message: 'User already exists' }); // 409 conflict
    } else {
        const hashedPw = await bcrypt.hash(pw, saltRounds);
        let newUser = await db.user.addUser({ mail, pw: hashedPw });
        console.log(newUser);
        res.send({ status: 'success', message: 'Registration successful', id: newUser.insertedId });
    }
});

module.exports = router;
