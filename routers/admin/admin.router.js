const { Router } = require("express");
const { test, admin_signup, admin_login } = require("../../controllers/admin/admin.controller");
const adminRouter = Router();

adminRouter.get("/test", test)
adminRouter.post("/signin", admin_signup)
adminRouter.post("/login", admin_login)
module.exports = adminRouter;