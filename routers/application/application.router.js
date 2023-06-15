const { Router } = require("express");
const { test } = require("../../controllers/application/application.controller");

const applicationRouter = Router();

applicationRouter.get("test", test);


module.exports = applicationRouter