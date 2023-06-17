const { Router } = require("express");
const { test, admin_signup, admin_login } = require("../../controllers/admin/admin.controller");
const { approveApplication, declineApplication, getApplicationForApproval } = require('../../controllers/admin/application/application.admin.controller')
const adminRouter = Router();
const uploadcontroller = require('../../middlewares/upload_middlewares/uploadFile.middleware');
const { requireAdminAuth } = require("../../middlewares/admin.middleware");
adminRouter.get("/test", test)
adminRouter.get("/get-unapproved-applications", getApplicationForApproval);

adminRouter.post("/signin", requireAdminAuth, admin_signup)
adminRouter.post("/login", admin_login)
adminRouter.post("/approve-application/:id", requireAdminAuth, uploadcontroller.uploadFiles, approveApplication);
adminRouter.post("/decline-application/:id", requireAdminAuth, uploadcontroller.uploadFiles, declineApplication)

module.exports = adminRouter;