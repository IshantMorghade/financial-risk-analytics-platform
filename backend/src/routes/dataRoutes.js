const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { listDatasets, uploadDataset } =
  require("../controllers/dataController");

router.get("/", auth, listDatasets);
router.post("/upload", auth, upload.single("file"), uploadDataset);

module.exports = router;