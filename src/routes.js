const express = require("express");
const routes = express.Router();

const { SignUp, Login, UpdateUser, SignToTrack } = require("./controllers/users");
const { AdminSignUp, AdminLogin, AdminAddTrack } = require("./controllers/admins");
const {
    validateUserData,
    loginRequired,
    loginOptional,
} = require("./middlewares/users");
const { userSignUpSchema } = require("./schemas/userSignUpSchema");

routes.post("/signup", validateUserData(userSignUpSchema), SignUp);
routes.post("/login", Login);
routes.post("/user/update", UpdateUser);
routes.post("/user/sign_track/:track_id", SignToTrack);
routes.post("/admin/signup", AdminSignUp); //DEVELOPMENT ONLY
routes.post("/admin/login", AdminLogin);
routes.post("/admin/add_track", AdminAddTrack);

module.exports = routes;
