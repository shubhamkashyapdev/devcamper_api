const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  removeUser,
} = require("../controllers/users");

const router = express.Router({ mergeParams: true });

// middleware //
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const User = require("../models/User");

router.use(protect);
router.use(authorize("admin"));
router.route("/").get(advancedResults(User), getUsers).post(addUser);
router.route("/:id").put(updateUser).delete(removeUser);

module.exports = router;
