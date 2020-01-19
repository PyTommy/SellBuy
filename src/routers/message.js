const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { ErrorHandler } = require('../middleware/error');

// Middleware
const auth = require('../middleware/auth');

// Models
const User = require('../models/user');
const Message = require('../models/message');

// POST api/messages/:recipientId
// private
router.post('/:recipientId',
    [
        auth,
        check('text', 'text is required').not().isEmpty(),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ErrorHandler(400, errors.array());
            }

            // getting user data
            const sender = await User.findById(req.user.id).select('_id name');

            // check if the recipient exists
            const recipient = await User.findById(req.params.recipientId).select('_id name');

            if (!recipient) {
                throw new ErrorHandler(400, "The recipient not found");
            }

            const message = new Message({
                text: req.body.text,
                sender: req.user.id,
                senderName: sender.name,
                recipient: req.params.recipientId,
                recipientName: recipient.name
            });

            await message.save();

            res.send(message);
        } catch (err) {
            next(err);
        }
    }
);

// GET /messages
// desc massages
router.get('/', auth, async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const messages = await Message.find({ recipient: userId }, null, { sort: { createdAt: -1 } }).populate('sender', 'avatar');
        res.send(messages);
    } catch (err) {
        next(err);
    }
});

// GET /messages/sent
// desc massages
router.get('/sent', auth, async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const messages = await Message.find({ sender: userId }, null, { sort: { createdAt: -1 } }).populate('recipient', 'avatar');

        res.send(messages);
    } catch (err) {
        next(err);
    }
});

// GET /messages/:id
router.get('/:id', auth, async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate('sender', "avatar")
            .populate('recipient', "avatar");

        if (message.sender._id.toString() !== req.user.id.toString() && message.recipient._id.toString() !== req.user.id.toString()) {
            throw new ErrorHandler(400, "Not allowed to see the message");
        }

        res.send(message);
    } catch (err) {
        next(err);
    }
});

// DELETE /messages/:id
// Private
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            throw new ErrorHandler(404, "Message Not Found");
        }

        if (message.sender.toString() !== req.user.id) {
            throw new ErrorHandler(400, 'Not allowed');
        }

        await message.remove();

        res.send("Deleted");
    } catch (err) {
        next(err);
    }
});


module.exports = router;
