const express = require('express');
const routes = express.Router();

const { SignUp } = require('./controllers/users');

routes.post('/signup', SignUp);

module.exports = routes;