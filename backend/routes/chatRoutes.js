const router = require("express").Router();
const ctrl = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.post("/", protect, ctrl.startChat);
router.get("/", protect, ctrl.getMyChats);
router.get("/:chatId/messages", protect, ctrl.getMessages);
router.post("/:chatId/messages", protect, ctrl.sendMessage);

module.exports = router;
