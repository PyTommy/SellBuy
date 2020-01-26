const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    innerHTML: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    trigger: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        avatar: {
            type: Buffer,
            default: null
        }
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    seen: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
);

const Notification = mongoose.model('Notification', notificationSchema);


module.exports = Notification;