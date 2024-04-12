require('dotenv').config();
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var jwt = require('jsonwebtoken');

const saltRounds = 10; //how often should be something encrypted

const pwT =  bcrypt.hash("testPW", saltRounds);
const testUser1 = { mail: "test@mail.com", pw: pwT};
const userListTesting = [testUser1];

/* GET users listing. */
router.get('/login', async function (req, res, next) {
  const { mail, pw } = req.query;
  
  if (!mail && !pw) {
    return res.status(400).send({ status: 'fail', message: 'Missing email and password' });
  } else if (!mail) {
    return res.status(400).send({ status: 'fail', message: 'Missing email' });
  } else if (!pw) {
    return res.status(400).send({ status: 'fail', message: 'Missing password' });
  }
 
  const user = userListTesting.find(user => user.mail === mail)
  if (user) {
    const checkPW = await bcrypt.compare(pw, (await user.pw).toString()); //ToDo: ask hwo i can fix this toString!
    if (checkPW) {
      const dataForToken = { mail: user.mail }; //No private secret information within the token!!
      const token = jwt.sign(dataForToken, process.env.ACCESS_TOKE_SECRET, { expiresIn: '1h' });
      res.send({ status: 'success', message: 'Login successful', token: token });
    } else {
      res.status(401).send({ status: 'fail', message: 'Invalid credentials' })
    }
  } else {
    res.status(401).send({ status: 'fail', message: 'Invalid credentials' })
  }

});

module.exports = router;
