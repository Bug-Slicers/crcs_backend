const { Router } = require("express");
const { test, society_signup, getRegisteredSocieties, society_login } = require("../../controllers/society/society.controller");
const { createApplication, deleteFile, updateApplication } = require("../../controllers/society/application/application.society.controller");
const { requireSocietyAuth } = require("../../middlewares/societies.middleware");
const { getApplicationById } = require("../../controllers/application/application.controller");
const uploadSupportingDocuments = require("../../middlewares/upload_middlewares/uploadSupporting.middleware");
const updateSupportingDocs = require("../../middlewares/upload_middlewares/updateSupporting.middleware");
const societyRouter = Router();

societyRouter.get("/test", test)
societyRouter.get("/registered-societies", getRegisteredSocieties);
societyRouter.get("/get-application/:id", requireSocietyAuth, getApplicationById)

societyRouter.post("/create-application", requireSocietyAuth, uploadSupportingDocuments, createApplication);
societyRouter.post("/update-application/:id", updateSupportingDocs, updateApplication)
societyRouter.post("/signup", society_signup);
societyRouter.post("/login", society_login)
societyRouter.post("/deletefile/:id/:filename", deleteFile)

module.exports = societyRouter;