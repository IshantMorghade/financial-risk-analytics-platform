const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { runAnalytics } = require("../controllers/analyticsController");

router.post("/run", auth, runAnalytics);
module.exports = router;