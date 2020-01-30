const express = require('express');
const router = express.Router();
const { ErrorHandler } = require('../../middleware/error');

// Middleware
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/user');
const Product = require('../../models/products');
const Notification = require('../../models/notification');


// @route         PUT api/products/purchase/:id
// @description   purchase a product
// @access        Private
// @res           {sold: true, purchaser: {_id, avatar, name}
router.put('/purchase/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        // Throw Errors for bad request
        if (!user) throw new ErrorHandler(400, "User not found");
        if (!product) throw new ErrorHandler(404, "Product not found");
        if (product.sold !== false) throw new ErrorHandler(400, "This product is already sold-out");

        // Update product
        product.sold = true;
        product.purchaser = req.user.id;

        // Create notification
        const notification = new Notification({
            innerHTML: `<b>${user.name}</b> purchased your product.`,
            product: product._id,
            trigger: {
                _id: user._id,
                avatar: user.avatar
            },
            recipient: product.user,
        });

        // Save to database
        await product.save();
        await notification.save();

        res.json({
            sold: product.sold,
            purchaser: {
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
            }
        });
    } catch (err) {
        next(err)
    }
});

// @route         PUT api/products/cancel/:id
// @description   Cancel a product
// @access        Private
// @res           { sold: true, purchaser: null }
router.put('/cancel/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        // Throw error to bad request
        if (!product.purchaser || !product.purchaser) throw new ErrorHandler(400, "Not sold yet");
        if (product.purchaser.toString() !== req.user.id) throw new ErrorHandler(400, "Not allowed to cancel");

        // Update product
        product.purchaser = null;
        product.sold = false;

        // Create notification
        const notification = new Notification({
            innerHTML: `<b>${user.name}</b> canceled purchase of your product.`,
            product: product._id,
            trigger: {
                _id: user._id,
                avatar: user.avatar
            },
            recipient: product.user,
        });

        // Save to database
        await product.save();
        await notification.save();

        res.json({
            sold: product.sold,
            purchaser: product.purchaser
        });
    } catch (err) {
        next(err)
    }
});

// @route         PUT api/products/reject/:id
// @description   Reject to sell
// @access        Private
// @res           { sold: true, purchaser: null }
router.put('/reject/:id', auth, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        const purchaser = await User.findById(product.purchaser);

        // Throw error to bad request
        if (!product.purchaser || !product.purchaser) throw new ErrorHandler(400, "Not sold yet");
        if (product.user.toString() !== req.user.id) throw new ErrorHandler(400, "Not allowed to reject");
        if (!purchaser) throw new ErrorHandler(404, "The purchaser not exists");

        // Update product
        product.purchaser = null;
        product.sold = false;

        // Create notification
        const notification = new Notification({
            innerHTML: `<b>${product.name}</b> rejected your purchase.`,
            product: product._id,
            trigger: {
                _id: product.user,
                avatar: product.avatar
            },
            recipient: purchaser._id,
        });

        // Save
        await product.save();
        await notification.save();

        res.json({
            sold: product.sold,
            purchaser: product.purchaser
        });
    } catch (err) {
        next(err)
    }
});

module.exports = router;