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
    monthly_payment: [{
        first_date: {
            type: Date,
            default: '',
            required: false
        },
        second_date: {
            type: Date,
            default: '',
            required: false
        },
        payment: {
            type: Number,
            default: 0,
            min: 0,
            required: false
        },
        payed: {
            type: Number,
            default: 0,
            min: 0,
            required: false
        },
        done: {
            type: Boolean,
            default: false,
            required: false
        }
    }],
    singular_payment: [{
        first_date: {
            type: Date,
            default: '',
            required: false
        },
        payment: {
            type: Number,
            default: 0,
            min: 0,
            required: false
        },
        payed: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            required: false
        },
        done: {
            type: Boolean,
            default: false,
            required: false
        }
    }],
    parents: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
});

module.exports = mongoose.model('Kids', KidsSchema);
