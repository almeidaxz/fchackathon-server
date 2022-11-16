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
    AdminLogin,
    AdminAddTrack,
    AdminAddTrackContent,
    DeleteContent,
    DeleteTrack,
    AdminSignUp,
    UpdateTrack,
    UpdateContent,
    GetAllContent
} = require("./controllers/admins");
const {
    validateUserData,
} = require("./middlewares/users");
const { userLoginSchema } = require("./schemas/userLoginSchema");
const { userSignUpSchema } = require("./schemas/userSignUpSchema");

routes.post("/signup", validateUserData(userSignUpSchema), SignUp);
routes.post("/admin", AdminSignUp);
routes.post("/login", validateUserData(userLoginSchema), Login);
routes.post("/user/sign_track/:track_id", SignToTrack);
routes.get("/user/:user_id/contents", GetUserContents);
routes.put("/user/:id/update", UpdateUser);
routes.put("/user/content/complete", CheckContentAsComplete);
routes.delete("/user/delete/:id", DeleteUser);
routes.get("/user/tracks/:id", GetUserTracks);
routes.get("/user/all_tracks", GetTracks);
routes.get("/track/:track_id/contents", GetContentsToTrack);
routes.get("/track/all_contents", GetAllContent);
routes.get("/user/:user_id/:track_id/progress", GetUserProgress);
routes.post("/admin/login", AdminLogin);
routes.post("/admin/add_track", AdminAddTrack);
routes.post("/admin/add_content", AdminAddTrackContent);
routes.put("/admin/update_track/:id", UpdateTrack);
routes.put("/admin/update_content/:id", UpdateContent);
routes.delete("/admin/del_track/:id", DeleteTrack);
routes.delete("/admin/del_content/:id", DeleteContent);

module.exports = routes;
