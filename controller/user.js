const express = require('express');
const bodyParser = require('body-parser');
const router = new express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/user')
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
require('dotenv').config();

/* ====================== USER REGISTRATION ===================== */
router.post('/signup', (req, res) => {
    let user = new User({
        email: req.body.email,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        password: req.body.password,
        date_of_birth: req.body.date_of_birth
    });
    user.save(function (error, userData) {
        if (error) responseSend(res, 500, error)
           else if (!userData || userData === undefined)
            responseSend(res, 400, 'Failed to register')
            else responseSend(res, 200, { result: 'Registration success', details: userData })
    });
});

/* ====================== USER LOGIN ===================== */
router.post('/signin', (req, res) => {
    (req.body.email == '' || req.body.password == '')
        ? responseSend(res, 403, 'Please fill empty fields')
        : User.findOne({ email: req.body.email }, (err, user) => {
            (err) ? responseSend(res, 500, err)
                : (!user) ? responseSend(res, 403, 'Authentication Failed')
                    : user.comparePassword(req.body.password, (err, isMatch) => {
                        if (isMatch && !err) {
                            let jwtpayload = {};
                            jwtpayload.email = user.email;
                            const token = jwt.sign(jwtpayload, process.env.SECRET, { expiresIn: 1000000 });
                            let username = user.first_name;
                            let email = user.email
                            responseSend(res, 200, { result: 'login success', token, username, email })
                        } else
                            responseSend(res, 403, 'Authenticate Failed.Wrong Password');
                    });
        });
});

/* ========== for testing =========== */
router.get('/', (req, res) => {
    responseSend(res, 200, "Call accepted")
})

/**
 * common response
 * @param {Object} res
 * @param {Object} status
 * @param {Object} message
 */
function responseSend(res, status, message) { 
    res.status(status)
        .send({
            status: status,
            output: message
        })
}
module.exports = router;