const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");

// Load env vars //
dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(helmet());
app.use(express.json({ extended: false }));

// Middleware //

// Routes //

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  );
});
