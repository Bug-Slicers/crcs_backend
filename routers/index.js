const { Router } = require("express");
const societyRouter = require("./society/society.router");
const adminRouter = require("./admin/admin.router");
const applicationRouter = require("./application/application.router")

const router = Router();

router.get("/", (req, res) => {
    res.status(202).json({
        success: true,
        message: "Welcome to the backend of CRCS Dashboard",
        team: ["Rohit , Manas"],
        organization: "Bug-Slicers"
    });
});

router.use("/societies", societyRouter);
router.use("/admin", adminRouter);
router.use("/applications", applicationRouter);
module.exports = router