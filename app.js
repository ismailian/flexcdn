require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const auth = require("./core/middlewares/auth");
const active = require("./core/middlewares/active");

/**
 * setup express app
 */
const app = express();

/**
 * configure express app
 *
 * TODO:
 *      - add cache
 *      - add rate-limit
 *      - add cors
 */
app.use(express.urlencoded({ extended: true }));
app.use(auth);
app.use(active);
app.use(
  fileUpload({
    safeFileNames: true,
    useTempFiles: true,
    preserveExtension: true,
    abortOnLimit: true,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 * 1024 * 1024
  })
);

/**
 * routes
 */
app.use("/api/v1/", require("./routes/v1/api"));

/**
 * start server
 */
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Web server is running on: ${port}`));
