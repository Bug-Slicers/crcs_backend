const { Router } = require("express");
const { test, society_signup, getRegisteredSocieties } = require("../../controllers/society/society.controller");
const societyRouter = Router();

societyRouter.get("/test", test)
societyRouter.get("/registered-societies", getRegisteredSocieties);
societyRouter.post("/signup", society_signup);

module.exports = societyRouter;