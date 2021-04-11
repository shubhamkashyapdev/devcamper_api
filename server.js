const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// Imports //
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars //
dotenv.config({ path: "./config/config.env" });

const app = express();
connectDB();

// Middleware //
app.use(helmet());
// rate limiting //
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use(limiter);
// prevent http param polution //
app.use(hpp());
// cross domain access //
app.use(cors());
// sanitize data //
app.use(sanitize());
// prevent cross site scripting attack //
app.use(xss());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// accept json data //
app.use(express.json({ extended: false }));
// file uploading //
app.use(fileupload());
// cookie parser //
app.use(cookieParser());
// set static folder //
app.use(express.static(path.join(__dirname, "public")));

// Routes //
app.use("/api/v1/users", require("./routes/users"));
app.use(errorHandler);
app.use("/api/v1/auth", require("./routes/auth"));
app.use(errorHandler);
app.use("/api/v1/reviews", require("./routes/reviews"));
app.use(errorHandler);
app.use("/api/v1/bootcamps", require("./routes/bootcamps"));
app.use(errorHandler);
app.use("/api/v1/courses", require("./routes/courses"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejections //
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server & exit process //
  server.close(() => process.exit(1));
});
