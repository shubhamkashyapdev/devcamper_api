const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).json({
    success: true,
    status: res.statusCode,
    greet: req.greeting,
    data: {
      name: "Brad",
      age: 45,
    },
  });
});

module.exports = router;
