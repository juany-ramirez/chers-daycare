const mongoose = require('mongoose');

const KidsSchema = mongoose.Schema({
    names: {
        type: String,
        required: true,
        trim: true
    },
    last_names: {
        type: String,
        required: true,
        trim: true
    },
    profiles: {
        type: [String],
        default: [],
        required: false
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: true
    },
    payment: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
});

module.exports = mongoose.model('Kids', KidsSchema);