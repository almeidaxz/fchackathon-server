const express = require("express");
const routes = express.Router();

const {
    SignUp,
    Login,
    UpdateUser,
    SignToTrack,
    GetUserTracks,
    DeleteUser,
    GetTracks,
    GetContentsToTrack,
    CheckContentAsComplete,
    GetUserProgress,
    GetUserContents
} = require("./controllers/users");
const {
    AdminSignUp,
    AdminLogin,
    AdminAddTrack,
    AdminAddTrackContent,
    DeleteContent,
    DeleteTrack,
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
routes.post("/user/sign_track/:track_id", SignToTrack);
routes.post("/user/:user_id/contents", GetUserContents);
routes.put("/user/:id/update", UpdateUser);
routes.put("/user/content/complete", CheckContentAsComplete);
routes.delete("/user/delete/:id", DeleteUser);
routes.get("/user/tracks/:id", GetUserTracks);
routes.get("/user/all_tracks", GetTracks);
routes.get("/user/:track_id/contents", GetContentsToTrack);
routes.get("/user/:user_id/:track_id/progress", GetUserProgress);
routes.post("/admin/signup", validateAdminData(userSignUpSchema), AdminSignUp); //DEVELOPMENT ONLY
routes.post("/admin/login", AdminLogin);
routes.post("/admin/add_track", AdminAddTrack);
routes.post("/admin/add_content", AdminAddTrackContent);
routes.delete("/admin/del_track/:id", DeleteTrack);
routes.delete("/admin/del_content/:id", DeleteContent);

module.exports = routes;
