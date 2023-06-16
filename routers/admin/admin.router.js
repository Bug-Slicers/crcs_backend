const { Router } = require("express");
const { test, admin_signup, admin_login, approveApplication, declineApplication } = require("../../controllers/admin/admin.controller");
const adminRouter = Router();
const uploadcontroller = require('../../middlewares/upload_middlewares/uploadFile.middleware');
adminRouter.get("/test", test)

adminRouter.post("/signin", admin_signup)
adminRouter.post("/login", admin_login)
adminRouter.post("/approve-application/:id", uploadcontroller.uploadFiles, approveApplication);
adminRouter.post("/decline-application/:id", uploadcontroller.uploadFiles, declineApplication)

module.exports = adminRouter;