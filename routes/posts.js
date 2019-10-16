const express =  require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', (req, res) => {
    Post.find().then((posts) => {
        res.send({success:true, data:posts});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => {
        res.send({success:true, data:post});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.post('/', (req, res) => {
    const post = new Post({
        album: req.body.album,
        caption: req.body.caption,
        post_date: req.body.post_date,
        courses: req.body.course,
        text_tags: req.body.text_tags,
        title: req.body.title,
        image: req.body.image
    });
    post.save().then((post) => {
        res.send({success:true, data:post});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.delete('/:id', (req, res) => {
    Post.deleteOne({_id: req.params.id}).then((post) => {
        res.send({success:true, data:post});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.put('/:postId/comment', (req, res) => {
    Post.findOne({_id: req.params.postId}).then((postResponse) =>{
        postResponse.comments.push({
            comment: req.body.comment,
            commenter: req.body.commenter,
            tags: req.body.tags
        });
        postResponse.save().then((post) => {
            res.send({success:true, data:post});
        }).catch((err) =>
            res.status(422).send({success:false, error:err.message})
        );
    }).catch((err) =>
        res.status(404).send({success:false, error:err.message})
    );
});

router.delete('/:postId/comment/:id', (req, res) => {
    Post.findOne({_id: req.params.postId}).then((postResponse) =>{
        postResponse.comments.push({
            comment: req.body.comment,
            commenter: req.body.commenter,
            tags: req.body.tags
        });
        postResponse.deleteOne({_id: req.params.id}).then((post) => {
            res.send({success:true, data:post});
        }).catch((err) =>
            res.status(422).send({success:false, error:err.message})
        );
    }).catch((err) =>
        res.status(404).send({success:false, error:err.message})
    );
});

router.put('/like/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then((postResponse) =>{
        const index = postResponse.likes.indexOf(req.body._id);
        if(index !== -1){
            postResponse.likes.splice(index , 1 );
            postResponse.save().then((post) => {
                res.send({success:true, data:post});
            }).catch((err) =>
                res.status(422).send({success:false, error:err.message})
            );
        }else{
            postResponse.likes.push(req.body._id);
            postResponse.save().then((post) => {
                res.send({success:true, data:post});
            }).catch((err) =>
                res.status(422).send({success:false, error:err.message})
            );
        }
    }).catch((err) =>
        res.status(404).send({success:false, error:err.message})
    );
});

router.put('/:id', (req, res) => {
    Post.updateOne({_id: req.params.id}, 
        { $set: 
            {
                album: req.body.album,
                caption: req.body.caption,
                post_date: req.body.post_date,
                courses: req.body.course,
                text_tags: req.body.text_tags,
                title: req.body.title,
                image: req.body.image
            }
    }).then((post) => {
        res.send({success:true, data:post});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

module.exports  = router;