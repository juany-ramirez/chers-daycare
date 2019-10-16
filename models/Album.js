const mongoose = require('mongoose');

const AlbumSchema = mongoose.Schema({
    name: {
        type: String,
        default: '',
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: '',
        trim: true
    },
    text_tags: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    creation_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    last_updated: {
        type: Date,
        default: Date.now,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        default: '',
        required: false
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: true
    }
});

module.exports = mongoose.model('Albums', AlbumSchema)