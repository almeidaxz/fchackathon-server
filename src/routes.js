const express = require("express");
const routes = express.Router();

const { SignUp, Login } = require("./controllers/users");
const { AdminSignUp, AdminLogin } = require("./controllers/admins");
const {
    validateUserData,
    loginRequired,
    loginOptional,
} = require("./middlewares/users");
const { userSignUpSchema } = require("./schemas/userSignUpSchema");

routes.post("/signup", validateUserData(userSignUpSchema), SignUp);
routes.post("/login", Login);
routes.post("/admin/signup", AdminSignUp);
routes.post("/admin/login", AdminLogin);

module.exports = routes;
