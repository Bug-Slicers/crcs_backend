const { Router } = require("express");
const { test, society_signup } = require("../../controllers/society/society.controller");
const societyRouter = Router();

societyRouter.get("/test", test)
societyRouter.post("/signup", society_signup);

module.exports = societyRouter;