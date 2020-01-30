const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { ErrorHandler } = require('../../middleware/error');
const Notification = require('../../models/notification');

// Middleware
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/user');
const Product = require('../../models/products');


// @route         POST api/posts/comment/:id
// @description   Comment on a post
// @access        Private
router.post('/comment/:id',
    [
        auth,
        check('text', 'Text is required').not().isEmpty()
    ], async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorHandler(400, errors.array());
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const product = await Product.findById(req.params.id);

            // Notification 
            const notifications = [];
            const sharedFields = {
                product: product._id,
                trigger: {
                    _id: user._id,
                    avatar: user.avatar
                }
            }

            // Notification to productOwener
            if (req.user.id !== product.user.toString()) {
                const toProductOwner = new Notification({
                    innerHTML: `<b>${user.name}</b> commented on your product.`,
                    recipient: product.user,
                    ...sharedFields
                });
                notifications.push(toProductOwner);
            }

            // Notification to other commenters
            const exclude = [product.user.toString(), req.user.id];
            product.comments.forEach((comment) => {
                if (!exclude.includes(comment.user.toString())) {
                    // push to exclude list
                    exclude.push(comment.user.toString());
                    // create notification
                    const toOther = new Notification({
                        innerHTML: `<b>${user.name}</b> commented on a product that you have commented`,
                        recipient: comment.user,
                        ...sharedFields
                    });
                    // add to new notifications
                    notifications.push(toOther);
                }
            });

            // Create and Add new comment
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };
            product.comments.push(newComment);

            // Save to the database
            await product.save();
            await Notification.insertMany(notifications);

            res.json(product.comments);
        } catch (err) {
            next(err);
        }
    }
);

// @route         DELETE api/posts/comment/:id/:comment_id
// @description   Delete a comment
// @access        Private
router.delete('/comment/:id/:comment_id', auth, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        // Pull out comment
        const comment = product.comments.find(comment => comment.id === req.params.comment_id);

        // Check if the comment exists
        if (!comment) {
            throw new ErrorHandler(404, "Comment does not exist");
        }

        // The user is the owner of the comment
        if (comment.user.toString() !== req.user.id) {
            throw new ErrorHandler(401, "User not authorized");
        }

        // Remove the comment
        const updatedComments = product.comments.filter(comment => comment.id.toString() !== req.params.comment_id);
        product.comments = updatedComments;

        // Save
        await product.save();

        res.json(product.comments);
    } catch (err) {
        next(err);
    }
});


module.exports = router;