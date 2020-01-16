const mongoose = require('mongoose');

const ParentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    kids: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    notifications: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    payments: [{
        date: {
            type: Date,
            default: Date.now,
            required: false
        },
        payment: {
            type: Number,
            default: 1,
            min: 1,
            required: false
        },
        description: {
            type: String,
            default: '',
            required: false,
            trim: true
        },
    }],
});


module.exports = mongoose.model('Parents', ParentSchema)