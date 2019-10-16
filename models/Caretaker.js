const mongoose = require('mongoose');

const CaretakerSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    courses: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    posted_publications: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    }
});

module.exports = mongoose.model('Caretakers', CaretakerSchema)