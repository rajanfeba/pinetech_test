const express = require('express');
const apis = new express.Router();
apis.use('/user', require('./user'))

module.exports = apis;