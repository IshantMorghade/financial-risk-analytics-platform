const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/csv", authMiddleware, reportController.exportCsv);

module.exports = router;