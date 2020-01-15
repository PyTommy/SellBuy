const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    // user info
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    avatar: {
        type: Buffer
    },
    // product info
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    meetupAt: {
        type: String,
        trim: true,
        required: true
    },
    productImage: {
        type: Buffer,
        required: true
    },
    productImageLow: {
        type: Buffer,
        required: true
    },
    // Sell Status
    sold: {
        type: Boolean,
        required: true,
        default: false
    },
    buyer: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    },
    // Interactions
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            name: {
                type: String,
            },
            avatar: {
                type: Buffer,
            },
            text: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

module.exports = Post = mongoose.model('product', ProductSchema);