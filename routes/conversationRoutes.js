const router = require("express").Router();
const {
  addConversation,
  deleteConversation,
  getConversation
} = require("../controllers/chatUserController");

router.post("/conversation", addConversation);
router.route("/conversation/:sender").get(getConversation).delete(deleteConversation);

module.exports = router;
