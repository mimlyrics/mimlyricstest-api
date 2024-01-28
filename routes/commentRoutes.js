const router = require("express").Router();
const {editComment, sortComment, deleteComment, postComment, likeComment, getComment, postCommentResponse, getCommentResponse, likeCommentResponse, deleteCommentResponse} = require("../controllers/commentController");

router.route("/video/comment").post(postComment);
router.route("/video/comment/:mediaId").get(getComment)
router.route("/video/comment/:commentId").delete(deleteComment);
router.route("/video/comment/edit/:mediaId").put(editComment)
router.route("/video/comment/sort/:mediaId").get(sortComment);
router.route("/video/comment/like/:commentId").put(likeComment)
router.route("/video/comment/delete/:commentId/:responseId").put(deleteCommentResponse);
router.route("/video/comment/response/:responseCommentId").put(postCommentResponse).get(getCommentResponse);
router.route("/video/comment/like/response/:responseCommentId").put(likeCommentResponse)
module.exports = router;