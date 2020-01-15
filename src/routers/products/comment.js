const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { ErrorHandler } = require('../../middleware/error');

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

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            product.comments.push(newComment);

            await product.save();

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

        // Make sure comment exists
        if (!comment) {
            throw new ErrorHandler(404, "Comment does not exist");
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            throw new ErrorHandler(401, "User not authorized");
        }

        const updatedComments = product.comments.filter(comment => comment.id.toString() !== req.params.comment_id);

        product.comments = updatedComments;

        await product.save();

        res.json(product.comments);
    } catch (err) {
        next(err);
    }
});


module.exports = router;