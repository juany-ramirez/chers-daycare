const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    date:  {
        type: Date,
        default: Date.now,
        required: true
    },
    link: {
        type: String,
        default: "",
        required: false
    },
});

const UserSchema = mongoose.Schema({
    avatar: {
        type: String,
        default: '',
        required:false,
    },
    names: {
        type: String,
        default: '',
        required: false,
        trim: true
    },
    last_names: {
        type: String,
        default: '',
        required: true,
        trim: true
    },
    phone:{
        type: String,
        default: '',
        required: false,
        trim: true
    },
    email: {
        type: String,
        default: '',
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        default: '',
        required: true
    },
    third_party_notification: {
        type: {},
        default: null,
        required: false
    },
    notifications: {
        type: [NotificationSchema],
        default: [],
        required: true
    },
    rol: {
        type: Number,
        default: 3,
        min: 0,
        required: true
    },
    permissions: {
        type: [String],
        default: [],
        required: false
    },
    user_type: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required:false,
    }    
});

UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        if(this.isModified('password'))
            this.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('Users', UserSchema)