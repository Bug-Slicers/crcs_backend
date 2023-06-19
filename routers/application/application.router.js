const { Router } = require("express");
const { test, getApprovedApplication, getAllApplication } = require("../../controllers/application/application.controller");

const applicationRouter = Router();

applicationRouter.get("/test", test);
applicationRouter.get("/get-approved-applicatations", getApprovedApplication);
applicationRouter.get("/get-all-applications", getAllApplication);




module.exports = applicationRouter