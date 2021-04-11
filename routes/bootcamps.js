const express = require("express");
const {
  getBootcamps,
  getBootcampById,
  addBootcamp,
  updateBootcampById,
  deleteBootcampById,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamp");

// middlewares //
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");

// Include other resourse routers //
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();
// Re-route into other resource router //
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(advancedResults(Bootcamp, "courses"), getBootcamps);
router.route("/").post(protect, authorize("publisher", "admin"), addBootcamp);

router
  .route("/:id")
  .get(getBootcampById)
  .put(protect, authorize("publisher", "admin"), updateBootcampById)
  .delete(protect, authorize("publisher", "admin"), deleteBootcampById);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

module.exports = router;
