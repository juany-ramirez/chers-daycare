const Post = require("../models/Post");

module.exports = {
  getPosts: async (req, res, next) => {
    Post.find(req.query)
      .then(posts => {
        res.send({ success: true, data: posts });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  getPost: async (req, res, next) => {
    Post.findById(req.params.id)
      .then(post => {
        res.send({ success: true, data: post });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  createPost: async (req, res, next) => {
    const post = new Post({
      album: req.body.album,
      caption: req.body.caption,
      post_date: req.body.post_date,
      text_tags: req.body.text_tags
        ? [...req.body.text_tags]
        : req.body.text_tags,
      title: req.body.title,
      image: req.body.image
        ? {
            link: req.body.image.link,
            tags: req.body.image.tags
              ? [...req.body.image.tags]
              : req.body.image.tags
          }
        : {}
    });
    post
      .save()
      .then(post => {
        res.send({ success: true, data: post });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  deletePost: async (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
      .then(post => {
        res.send({ success: true, data: post });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  updatePost: async (req, res, next) => {
    Post.updateOne(
      { _id: req.params.id },
      {
        $set: {
          album: req.body.album,
          caption: req.body.caption,
          post_date: req.body.post_date,
          text_tags: req.body.text_tags
            ? [...req.body.text_tags]
            : req.body.text_tags,
          title: req.body.title,
          image: {
            link: req.body.image.link,
            tags: req.body.image.tags
              ? [...req.body.image.tags]
              : req.body.image.tags
          }
        }
      }
    )
      .then(post => {
        res.send({ success: true, data: post });
      })
      .catch(err =>
        res.status(422).send({ success: false, error: err.message })
      );
  },
  likePost: async (req, res, next) => {
    Post.findOne({ _id: req.params.id })
      .then(postResponse => {
        const index = postResponse.likes.indexOf(req.body._id);
        if (index !== -1) {
          postResponse.likes.splice(index, 1);
          postResponse
            .save()
            .then(post => {
              res.send({ success: true, data: post });
            })
            .catch(err =>
              res.status(422).send({ success: false, error: err.message })
            );
        } else {
          postResponse.likes.push(req.body._id);
          postResponse
            .save()
            .then(post => {
              res.send({ success: true, data: post });
            })
            .catch(err =>
              res.status(422).send({ success: false, error: err.message })
            );
        }
      })
      .catch(err =>
        res.status(404).send({ success: false, error: err.message })
      );
  },
  createComment: async (req, res, next) => {
    Post.findOne({ _id: req.params.postId })
      .then(postResponse => {
        postResponse.comments.push({
          comment: req.body.comment,
          commenter: req.body.commenter,
          tags: req.body.tags
        });
        postResponse
          .save()
          .then(post => {
            res.send({ success: true, data: post });
          })
          .catch(err =>
            res.status(422).send({ success: false, error: err.message })
          );
      })
      .catch(err =>
        res.status(404).send({ success: false, error: err.message })
      );
  },
  deleteComment: async (req, res, next) => {
    Post.update(
      { _id: req.params.postId },
      { $pull: { comments: { _id: req.params.id } } }
    )
      .then(post => {
        res.send({ success: true, data: post });
      })
      .catch(err =>
        res.status(404).send({ success: false, error: err.message })
      );
  }
};
