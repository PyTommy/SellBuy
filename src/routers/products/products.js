const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sharp = require('sharp');

// Middleware
const { check, validationResult } = require('express-validator');
const { ErrorHandler } = require('../../middleware/error');
const auth = require('../../middleware/auth');
const getUserId = require('../../middleware/getUserId');
const uploadProductPic = require('../../middleware/uploadProductPic');

// Models
const User = require('../../models/user');
const Product = require('../../models/products');



// @route     POST /api/products
// @desc      Post a product
// @access    Private
// @res       none
router.post('/',
    [
        auth,
        uploadProductPic,
        check('title', 'Title is required').trim().not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price(with Number) is required').isNumeric(),
        check('category', 'Category is required').trim().not().isEmpty(),
        check('meetupAt', 'MeetupAt is required').trim().not().isEmpty()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ErrorHandler(400, errors.array());
            }
            const { title, description, price, category, meetupAt } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) throw new ErrorHandler(400, "User not found");

            if (!req.file) throw new ErrorHandler(400, "Please upload a png, jpeg or jpg");

            // High quality image
            const productImage = await sharp(req.file.buffer)
                .resize({ width: 720 })
                .jpeg({ quality: 80, })
                .toBuffer();

            // Low quality image
            const productImageLow = await sharp(req.file.buffer)
                .resize({ width: 500 })
                .jpeg({ quality: 50, })
                .toBuffer();


            const product = new Product({
                user: req.user.id,
                name: user.name,
                avatar: user.avatar,
                title,
                description,
                price,
                category,
                meetupAt,
                productImage,
                productImageLow
            });

            await product.save();

            res.send();
        } catch (err) {
            next(err);
        }
    }
);

// @route     GET /api/products
// @desc      Get product
// @access    Public
// @res       [...products]
// @queries
//      @@ limit : Num
//      @@ skip : Num
//      @@ category : Str
//      @@ search : Str
//      @@ liked : Boolean
//      @@ purchased : Boolean
//      @@ sellings : Boolean
router.get('/', getUserId, async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;

    // Setting filters for liked, purchased, selling products
    let findLiked = {}, findPurchased = {}, findSellings = {};
    const authCheck = (errText) => {
        if (!req.user) throw new ErrorHandler(400, errText)
    };
    const objUserId = req.user ? new mongoose.Types.ObjectId(req.user.id) : null;
    if (req.query.liked === "true") {
        authCheck("Need to be authorized to get liked products");
        findLiked = { "likes": objUserId }
    } else if (req.query.purchased === "true") {
        authCheck("Need to be authorized to get purchased products");
        findPurchased = { "purchaser": objUserId }
    } else if (req.query.sellings === "true") {
        authCheck("Need to be authorized to get selling products");
        findSellings = { "user": objUserId }
    };

    // Setting search filter
    let search = {};
    if (req.query.search) {
        const words = req.query.search.split(" ");
        const regexArray = words.map((word) => new RegExp(".*" + word + ".*", "i"));
        search = {
            $or: [
                { title: { $all: regexArray } },
                { description: { $all: regexArray } },
                { name: { $all: regexArray } },
                { meetupAt: { $all: regexArray } }
            ]
        }
    };

    // Setting category filter
    const category = req.query.category ? { category: req.query.category } : {};

    try {
        const products = await Product.find({
            ...findLiked,
            ...findPurchased,
            ...findSellings,
            ...category,
            ...search,
        }, null, {
            limit: limit,
            skip: skip,
            sort: {
                createdAt: -1
            },
        }).select('-productImage');

        res.send(products);
    } catch (err) {
        next(err);
    }
});

// @route     GET /api/products/sellings/:userId
// @desc      Get selling products of a user
// @access    Public
// @res       [...products]
// @ query 
// @@@@ skip
// @@@@ limit
router.get('/sellings/:userId', async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;

    try {
        const products = await Product.find(
            { user: new mongoose.Types.ObjectId(req.params.userId) },
            null,
            {
                limit: limit,
                skip: skip,
                sort: { createdAt: -1 }
            }
        ).select('-productImage');
        res.send(products);
    } catch (err) {
        next(err);
    }
});

// @route     GET /api/products/:id
// @desc      Get product by Id
// @access    Public
// @res       {product}
router.get('/:id', async (req, res, next) => {
    try {
        // Get Product 
        const product = await Product
            .findById(req.params.id)
            .select('-productImageLow')
            .populate('purchaser', 'name avatar');

        // Check if the product exists
        if (!product) throw new ErrorHandler(404, "Product Not Found");

        res.send(product);
    } catch (err) {
        next(err);
    }
});

// @route     PUT /api/products/:id
// @desc      Update a product
// @access    Private
// @res       none
router.put('/:id',
    [
        auth,
        uploadProductPic,
        check('title', 'Title is required').trim().not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price(with Number) is required').isNumeric(),
        check('category', 'Category is required').trim().not().isEmpty(),
        check('meetupAt', 'MeetupAt is required').trim().not().isEmpty()
    ],
    async (req, res, next) => {
        try {
            // Check Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new ErrorHandler(400, errors.array());

            // Get User info
            const user = await User.findById(req.user.id);
            if (!user) throw new ErrorHandler(400, "User not found");

            // Get Product 
            const product = await Product.findById(req.params.id);
            if (!product) throw new ErrorHandler(400, "Product not found");

            // Check Authentication
            if (user._id.toString() !== product.user.toString()) {
                throw new ErrorHandler(401, "User not found");
            };

            // Check if the product sold-out
            if (product.sold) throw new ErrorHandler(400, "Cannot update sold-out product");

            // Spread object to variables
            const { title, description, price, category, meetupAt } = req.body;

            let newProductImage = null;
            let newProductImageLow = null;
            if (req.file) {
                // High quality Image
                newProductImage = await sharp(req.file.buffer)
                    .resize({ width: 720 })
                    .jpeg({ quality: 80 })
                    .toBuffer();
                // Low quality image
                newProductImageLow = await sharp(req.file.buffer)
                    .resize({ width: 500 })
                    .jpeg({ quality: 50, })
                    .toBuffer();
            }

            // Create Object with provided values
            const newProduct = {
                user: req.user.id,
                name: user.name,
                avatar: user.avatar,
                title,
                description,
                price,
                category,
                meetupAt,
                productImage: newProductImage || product.productImage,
                productImageLow: newProductImageLow || product.productImageLow
            };

            // Update product
            const updates = Object.keys(newProduct);
            updates.forEach((update) => product[update] = newProduct[update]);

            // Save
            await product.save();

            res.send();
        } catch (err) {
            next(err);
        }
    }
);

// @route     DELETE /api/products/:id
// @desc      Delete product by Id
// @access    Private
// @res       {msg: "Deleted!!"}
router.delete('/:id', auth, async (req, res, next) => {
    try {
        // Get product
        const product = await Product.findById(req.params.id);
        if (!product) throw new ErrorHandler(404, "Product Not found");

        // Check if the user allowed to delete the product
        if (product.user.toString() !== req.user.id) {
            throw new ErrorHandler(400, "You are not allowed to delete this product because you are not the user");
        }

        if (product.sold) throw new ErrorHandler(400, "Cannot delete sold-out product");

        await product.remove();

        res.send({ msg: "Deleted!!" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;