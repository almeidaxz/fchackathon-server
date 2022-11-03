const express = require("express");
const routes = express.Router();

const { SignUp, Login } = require("./controllers/users");
const { validateUserData } = require("./middlewares/users");
const { userSignUpSchema } = require("./schemas/userSignUpSchema");

routes.post("/signup", validateUserData(userSignUpSchema), SignUp);
routes.post("/login", Login);

module.exports = routes;
