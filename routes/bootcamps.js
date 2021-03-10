const express = require("express");

const router = express.Router();

const {
  getBootcamps,
  getBootcampById,
  addBootcamp,
  updateBootcampById,
  deleteBootcampById,
} = require("../controllers/bootcamp");

router.route("/").get(getBootcamps).post(addBootcamp);

router
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcampById)
  .delete(deleteBootcampById);

module.exports = router;
