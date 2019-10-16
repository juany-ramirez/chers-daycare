const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    opened:  {
        type: Boolean,
        default: false,
        required: true
    },
    type: {
        type: Number,
        default: 1,
        min: 0,
        required: true
    },    
    thirdparty: {
        type: {},
        default: {},
        required: true
    },
    date:  {
        type: Date,
        default: Date.now,
        required: true
    },
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        default: '',
        required: false
    },
    course: {
        type: String,
        default: '',
        required: false
    },
    link: {
        type: String,
        default: '',
        required: true
    }
});

module.exports = mongoose.model('Notifications', NotificationSchema)