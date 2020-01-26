const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ErrorHandler } = require('../middleware/error');

// Middleware
const auth = require('../middleware/auth');

// Models
const User = require('../models/user');
const Notification = require('../models/notification');

// GET /notifications
// desc return notifications, turn seen=true and return number of notifications that turned from unseen to seen 
// @ Private
// @ res = {notifications: Array, countUnseenToSeen: Num }
router.get('/', auth, async (req, res, next) => {
    if (!req.query) req.query = {};

    let limit = 10;
    if (req.query.limit) limit = parseInt(req.query.limit, 10);

    let skip = 0;
    if (req.query.skip) skip = parseInt(req.query.skip, 10);

    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        // get notifications
        const notifications = await Notification.find({ recipient: userId }, null, {
            limit: limit,
            skip: skip,
            sort: { createdAt: -1 }
        });

        // extract unseen notifications
        const unseenNotifications = notifications.filter(notification => {
            return !notification.seen;
        });

        // map unseen notifications' _id to Array
        const unseenIds = unseenNotifications.map(el => el._id);

        await Notification.updateMany(
            { _id: { $in: unseenIds } },
            { $set: { seen: true } }
        );

        res.send({ notifications, countUnseenToSeen: unseenIds.length });
    } catch (err) {
        next(err);
    }
});

// GET /messages/count
// desc count the number of unseen notifications
// res { count: Num }
router.get('/count', auth, async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const count = await Notification.countDocuments({
            $and: [
                { recipient: userId },
                { seen: false }
            ]
        });
        res.send({ count });
    } catch (err) {
        next(err);
    }
});

module.exports = router;