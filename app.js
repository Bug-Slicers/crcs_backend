const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const Router = require("./routers/index");
const app = express();

const dbURI = process.env.DATABASE;
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
    })
    .then((result) => {
        app.listen(port);
        console.log("connected to mongodb and listening at port 5000");
    })
    .catch((err) => console.error(err));

app.use(Router);


// if (process.env.NODE_ENV == "production") {
//     app.use(express.static("client/build"));
//     const path = require("path");
//     app.get("*", function (req, res) {
//         res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//     });
// }