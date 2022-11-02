const express = require('express');
const routes = express.Router();

const { SignUp } = require('./controllers/users');
const { validateUserData } = require('./middlewares/users');
const { userSignUpSchema } = require('./schemas/userSignUpSchema');

routes.post('/signup', validateUserData(userSignUpSchema), SignUp);

module.exports = routes;