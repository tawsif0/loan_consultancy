const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", applicationController.submitApplication);
router.get("/", authMiddleware, applicationController.getAllApplications);
router.get(
  "/download",
  authMiddleware,
  applicationController.downloadApplicationsPDF
);
router.get("/:id", authMiddleware, applicationController.getApplicationById);

module.exports = router;
