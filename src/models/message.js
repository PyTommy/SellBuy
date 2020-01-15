const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    senderName: {
        type: String,
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    recipientName: {
        type: String,
        required: true,
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const Message = mongoose.model('Message', messageSchema);


module.exports = Message;