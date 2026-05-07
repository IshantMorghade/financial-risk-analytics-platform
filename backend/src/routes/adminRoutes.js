const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { listUsers, deleteUser } =
  require("../controllers/adminController");

router.get("/users", auth, role("admin"), listUsers);
router.delete("/user/:id", auth, role("admin"), deleteUser);

module.exports = router;