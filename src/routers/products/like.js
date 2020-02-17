const express = require('express');
const router = express.Router();
const { ErrorHandler } = require('../../middleware/error');

// Middleware
const auth = require('../../middleware/auth');

// Models
const Product = require('../../models/products');

// @route         PUT api/products/like/:id
// @description   Like a product
// @access        Private
// @res           [ {id:..., user: ...} ]
router.put('/like/:id', auth, async (req, res, next) => {
    try {
        // Get product
        const product = await Product.findById(req.params.id);
        if (!product) throw new ErrorHandler(400, "Product not found");

        // Check if product already liked by the user
        if (product.likes.find(like => like.toString() === req.user.id)) {
            throw new ErrorHandler(400, "Product already liked!");
        }

        // Add user id
        product.likes.unshift(req.user.id);

        // Save
        await product.save();

        res.json(product.likes);
    } catch (err) {
        next(err);
    }
});

// @route         PUT api/products/unlike/:id
// @description   Unlike a product
// @access        Private
// @res           [{id:..., user: ...}, ...]
router.put('/unlike/:id', auth, async (req, res, next) => {
    try {
        // Get a product
        const product = await Product.findById(req.params.id);
        if (!product) throw new ErrorHandler(400, "Product not found");

        // Remove like from a product
        const updatedLikes = product.likes.filter(like => like.toString() !== req.user.id);

        // Check if the user actually unliked it
        if (product.likes.length === updatedLikes.length) {
            throw new ErrorHandler(400, "Product has not yet been liked");
        }

        // Update
        product.likes = updatedLikes;
        await product.save();

        res.json(product.likes);
    } catch (err) {
        next(err)
    }
});

module.exports = router;