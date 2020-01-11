const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: Buffer,
        default: null
    },
    likes: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            }
        }
    ],
    boughts: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            }
        }
    ],
    sellings:[
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        // hash provided 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;