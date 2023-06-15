module.exports.test = (req, res) => {
    res.status(200).json({
        message: "Test Route for application",
        success: true,
    })
}