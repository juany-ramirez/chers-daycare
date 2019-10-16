const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    commenter:  {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required: false
    },
    date:  {
        type: Date,
        default: Date.now,
        required: true
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: true
    }
});

const PostSchema = mongoose.Schema({
    album: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required: false
    },
    caption:  {
        type: String,
        required: false,
        default: '',
        trim: true
    },
    post_date: {
        type: Date,
        default: '',
        required: false
    },
    release_date:  {
        type: Date,
        default: Date.now,
        required: true
    },
    courses: {
        type: [mongoose.Schema.Types.ObjectId],
        default: null,
        required: false
    },
    text_tags:{
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: true
    },
    comments: {
        type: [CommentSchema],
        default: [],
        required: false
    },
    image: {
        link: {
            type: String,
            default: '',
            required: false
        },
        tags:  {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            required: false
        }
    }
});

module.exports = mongoose.model('Posts', PostSchema)