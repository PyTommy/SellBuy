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
// desc latest massages for each counterParty
router.get('/', auth, async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        {
                            sender: userId
                        },
                        {
                            recipient: userId
                        }
                    ]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    "_id": {
                        $cond: [
                            { $gt: ["$recipient", "$sender"] },
                            { $concatArrays: [["$recipient"], ["$sender"]] },
                            { $concatArrays: [["$sender"], ["$recipient"]] }
                        ]
                    }, "message": { $first: "$$ROOT" }
                }
            }
        ]);
        const ids = [];
        let counterPartyArray;
        if (messages) {
            // extracting ids of counter party
            messages.forEach(message => {
                message._id.forEach(ID => {
                    if (ID.toString() !== req.user.id) {
                        message["counterParty"] = {
                            _id: new mongoose.Types.ObjectId(ID)
                        };
                        ids.push(new mongoose.Types.ObjectId(ID));
                    }
                })
            });

            // find avatar and name for each counter party
            counterPartyArray = await User.find({ _id: { $in: ids } }).select('avatar name');

            // embed avatar and name to messages[counterParty]
            messages.forEach(message => {
                const index = counterPartyArray.findIndex(cp => {
                    return cp._id.toString() === message.counterParty._id.toString();
                });
                message.counterParty = counterPartyArray[index];
            });
        }

        res.send(messages);
    } catch (err) {
        next(err);
    }
});

// GET /messages/:counterPartyId
// 
// Private
router.get('/:counterPartyId', auth, async (req, res, next) => {
    try {
        const messages = await Message.aggregate([
            {
                $match:
                {
                    $or: [
                        {
                            sender: new mongoose.Types.ObjectId(req.user.id),
                            recipient: new mongoose.Types.ObjectId(req.params.counterPartyId)
                        },
                        {
                            recipient: new mongoose.Types.ObjectId(req.user.id),
                            sender: new mongoose.Types.ObjectId(req.params.counterPartyId)
                        }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        if (!messages) {
            throw new ErrorHandler(404, "Message Not Found");
        }

        // get avatar and name of the counterParty
        const counterParty = await User.findById(req.params.counterPartyId).select('avatar name');

        const result = {
            messages,
            counterParty
        };

        res.send(result);
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
