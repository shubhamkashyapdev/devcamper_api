const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const colors = require("colors");

// Imports //
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars //
dotenv.config({ path: "./config/config.env" });

const app = express();
connectDB();

app.use(helmet());
app.use(express.json({ extended: false }));

// Middleware //
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Routes //
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/reviews", require("./routes/reviews"));
app.use("/api/v1/bootcamps", require("./routes/bootcamps"));
app.use(errorHandler);
app.use("/api/v1/courses", require("./routes/courses"));

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
