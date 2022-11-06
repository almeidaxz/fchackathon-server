const express = require("express");
const routes = express.Router();

const {
    SignUp,
    Login,
    UpdateUser,
    SignToTrack,
} = require("./controllers/users");
const {
    AdminSignUp,
    AdminLogin,
    AdminAddTrack,
    AdminAddTrackContent,
} = require("./controllers/admins");
const {
    validateUserData,
    loginRequired,
    loginOptional,
    validateEmailUser,
} = require("./middlewares/users");
const { validateAdminData } = require("./middlewares/admins");
const { userSignUpSchema } = require("./schemas/userSignUpSchema");

routes.post("/signup", validateUserData(userSignUpSchema), SignUp);
routes.post("/login", Login);
routes.post("/user/update", validateEmailUser, UpdateUser);
routes.post("/user/sign_track/:track_id", SignToTrack);
routes.post("/admin/signup", validateAdminData(userSignUpSchema), AdminSignUp); //DEVELOPMENT ONLY
routes.post("/admin/login", AdminLogin);
routes.post("/admin/add_track", AdminAddTrack);
routes.post("/admin/add_content", AdminAddTrackContent);

module.exports = routes;
