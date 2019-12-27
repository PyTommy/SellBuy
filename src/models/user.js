const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

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
})

const User = mongoose.model('User', UserSchema);

module.exports = User;