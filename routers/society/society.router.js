const { Router } = require("express");
const { test, society_signup, getRegisteredSocieties, society_login } = require("../../controllers/society/society.controller");
const { requireSocietyAuth } = require("../../middlewares/societies.middleware");
const { createApplication } = require("../../controllers/society/application/application.society.controller");
const uploadSupportingDocuments = require("../../middlewares/upload_middlewares/uploadSupporting.middlware");
const societyRouter = Router();
societyRouter.get("/test", test)
societyRouter.get("/registered-societies", getRegisteredSocieties);

societyRouter.post("/create-application", requireSocietyAuth, uploadSupportingDocuments, createApplication);
societyRouter.post("/signup", society_signup);
societyRouter.post("/login", society_login)

module.exports = societyRouter;