const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const postController = require("../controllers/posts");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(passportJWT, postController.getPosts);

router.route("/:id").get(passportJWT, postController.getPost);

router.route("/").patch(passportJWT, postController.getParentsPosts);

router.route("/").post(passportJWT, postController.createPost);

router.route("/:id").delete(passportJWT, postController.deletePost);

router.route("/:id").put(passportJWT, postController.updatePost);

router.route("/like/:id").put(passportJWT, postController.likePost);

router.route("/:postId/comment").put(passportJWT, postController.createComment);

router
  .route("/:postId/comment/:id")
  .delete(passportJWT, postController.deleteComment);

// router.route("/image").post(passportJWT, postController.postImage);

module.exports = router;
