const { Router } = require("express");
const societyRouter = require("./society/society.router");
const adminRouter = require("./admin/admin.router");
const applicationRouter = require("./application/application.router");
const { downloadFile, deleteFile } = require("../controllers/file/file.controller");
const router = Router();

router.get("/", (req, res) => {
    res.status(202).json({
        success: true,
        message: "Welcome to the backend of CRCS Dashboard",
        team: ["Rohit , Manas"],
        organization: "Bug-Slicers"
    });
});

router.post("/logout", (req, res) => {
    res
        .clearCookie("jwt")
        .status(204)
        .json({ message: "Logged out successfully" });
})

router.get('/download/:folder/:filename', downloadFile);
router.post("/deletefile/:id/:filename", deleteFile)

router.use("/societies", societyRouter);
router.use("/admin", adminRouter);
router.use("/applications", applicationRouter);
module.exports = router