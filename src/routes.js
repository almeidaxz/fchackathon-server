const express = require("express");
const routes = express.Router();

const {
    SignUp,
    Login,
    UpdateUser,
    SignToTrack,
    GetUserTracks,
    DeleteUser,
} = require("./controllers/users");
const {
    AdminSignUp,
    AdminLogin,
    AdminAddTrack,
    AdminAddTrackContent,
    DeleteContent,
} = require("./controllers/admins");
const {
    validateUserData,
    loginRequired,
    loginOptional,
    validateEmailUser,
} = require("./middlewares/users");
const { validateAdminData } = require("./middlewares/admins");
const {
    GetTracks,
    GetContentsToTrack,
    DeleteTrack,
} = require("./controllers/tracks");
const { userSignUpSchema } = require("./schemas/userSignUpSchema");

routes.post("/signup", validateUserData(userSignUpSchema), SignUp);
routes.post("/login", Login);
routes.put("/user/update", validateEmailUser, UpdateUser);
routes.delete("/user/delete/:id", DeleteUser);
routes.post("/user/sign_track/:track_id", SignToTrack);
routes.get("/user/tracks/:id", GetUserTracks);
routes.get("/tracks", GetTracks);
routes.delete("/tracks/delete/:id", DeleteTrack);
routes.get("/:id/contents", GetContentsToTrack);
routes.post("/admin/signup", validateAdminData(userSignUpSchema), AdminSignUp); //DEVELOPMENT ONLY
routes.post("/admin/login", AdminLogin);
routes.post("/admin/add_track", AdminAddTrack);
routes.post("/admin/add_content", AdminAddTrackContent);
routes.delete("/admin/del_content/:id", DeleteContent);

module.exports = routes;
