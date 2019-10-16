const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    section: {
        type: Boolean,
        default: false,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    caretakers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    }
});

module.exports = mongoose.model('Course', CourseSchema)