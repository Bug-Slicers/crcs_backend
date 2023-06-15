const { Router } = require("express");
const { test, admin_signup, admin_login, approve_societies } = require("../../controllers/admin/admin.controller");
const adminRouter = Router();
const uploadController = require("../../utilities/uploadCertificate")

adminRouter.get("/test", test)
adminRouter.post("/signin", admin_signup)
adminRouter.post("/login", admin_login)

adminRouter.post("/approve-registration/:id", uploadController.uploadCertificate, approve_societies)
module.exports = adminRouter;