const express = require('express');
const router = express.Router();
const { ErrorHandler } = require('../../middleware/error');

// Middleware
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/user');
const Product = require('../../models/products');


// @route         PUT api/products/purchase/:id
// @description   purchase a product
// @access        Private
router.put('/purchase/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        if (!user) {
            throw new ErrorHandler(400, "User not found");
        }
        if (!product) {
            throw new ErrorHandler(404, "Product not found");
        }
        if (product.sold !== false) {
            throw new ErrorHandler(400, "This product is already sold-out");
        }

        product.sold = true;
        product.purchaser = { user: req.user.id };

        user.purchases.unshift({ product: product.id });

        await product.save();
        await user.save();

        res.json({
            sold: product.sold,
            purchaser: product.purchaser
        });
    } catch (err) {
        next(err)
    }
});

// @route         PUT api/products/unlike/:id
// @description   Unlike a product
// @access        Private
// @res           [{id:..., user: ...}, ...]
router.put('/cancel/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        if (!product.purchaser || !product.purchaser.user) throw new ErrorHandler(400, "Not sold yet");

        if (product.purchaser.user.toString() !== req.user.id) {
            throw new ErrorHandler(400, "Not allowed to cancel");
        }

        product.purchaser = null;
        product.sold = false;

        const index = user.purchases.findIndex((bought) => bought.product.toString() === req.params.id);
        if (index > -1) {
            user.purchases.splice(index, 1);
        } else {
            throw new ErrorHandler(500, "Cannot delete bought item from user's list!!");
        }

        await product.save();
        await user.save();

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
router.put('/reject/:id', auth, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product.purchaser || !product.purchaser.user) throw new ErrorHandler(400, "Not sold yet");

        if (product.user.toString() !== req.user.id) {
            throw new ErrorHandler(400, "Not allowed to reject");
        }

        const purchaser = await User.findById(product.purchaser.user);
        if (!purchaser) throw new ErrorHandler(404, "The purchaser not exists");

        product.purchaser = null;
        product.sold = false;

        const index = purchaser.purchases.findIndex((bought) => bought.product.toString() === req.params.id);
        if (index > -1) {
            purchaser.purchases.splice(index, 1);
        } else {
            throw new ErrorHandler(500, "Cannot delete bought item from user's list!!");
        }

        await product.save();
        await purchaser.save();

        res.json({
            sold: product.sold,
            purchaser: product.purchaser
        });
    } catch (err) {
        next(err)
    }
});

module.exports = router;