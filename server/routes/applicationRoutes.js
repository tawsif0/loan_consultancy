const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", applicationController.submitApplication);
router.get("/", authMiddleware, applicationController.getAllApplications);
router.get("/:id", authMiddleware, applicationController.getApplicationById);
router.get(
  "/download",
  authMiddleware,
  applicationController.downloadApplicationsPDF
);
module.exports = router;
