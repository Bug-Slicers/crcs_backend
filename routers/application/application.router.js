const { Router } = require("express");
const { test, createApplication, getApplicationForApproval, downloadFile, getApprovedApplication, getAllApplication } = require("../../controllers/application/application.controller");

const applicationRouter = Router();

applicationRouter.get("/test", test);
applicationRouter.get("/get-unapproved-applications", getApplicationForApproval);
applicationRouter.get("/get-approved-applicatations", getApprovedApplication);
applicationRouter.get("/get-all-applications", getAllApplication);
applicationRouter.get('/download/:folder/:filename', downloadFile);

applicationRouter.post("/create-application", createApplication);


module.exports = applicationRouter