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
    }
});


module.exports = mongoose.model('Parents', ParentSchema)