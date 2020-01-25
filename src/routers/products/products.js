const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const sharp = require('sharp');
const { ErrorHandler } = require('../../middleware/error');

// Middleware
const auth = require('../../middleware/auth');
const getUserId = require('../../middleware/getUserId');
const uploadProductPic = require('../../middleware/uploadProductPic');

// Models
const User = require('../../models/user');
const Product = require('../../models/products');



// @route     POST /api/products
// @desc      Post a product
// @access    Private
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

            // Get User info
            const user = await User.findById(req.user.id);
            if (!user) {
                throw new ErrorHandler(400, "User not found");
            }

            const { title, description, price, category, meetupAt } = req.body;

            if (!req.file) {
                throw new ErrorHandler(400, "Please upload a png, jpeg or jpg");
            }

            const productImage = await sharp(req.file.buffer)
                .resize({ width: 720 })
                .jpeg({
                    quality: 80,
                })
                .toBuffer();
            const productImageLow = await sharp(req.file.buffer)
                .resize({ width: 500 })
                .jpeg({
                    quality: 50,
                })
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

            user.sellings.unshift({ product: product.id });
            await user.save();

            res.send("created");
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
    let limit = 10;
    if (req.query.limit) {
        limit = parseInt(req.query.limit, 10);
    }
    let skip = 0;
    if (req.query.skip) {
        skip = parseInt(req.query.skip, 10);
    }

    let findLiked = {}, findPurchased = {}, findSellings = {}, search = {}, category = {};
    if (req.query.liked === "true") {
        if (!req.user.id) throw new ErrorHandler(400, "Need to be authorized to get liked");
        findLiked = { "likes.user": new mongoose.Types.ObjectId(req.user.id) }
    } else if (req.query.purchased === "true") {
        if (!req.user.id) throw new ErrorHandler(400, "Need to be authorized to get purchased")
        findPurchased = { "purchaser.user": new mongoose.Types.ObjectId(req.user.id) }
    } else if (req.query.sellings === "true") {
        if (!req.user.id) throw new ErrorHandler(400, "Need to be authorized to get sellings");
        findSellings = { "user": new mongoose.Types.ObjectId(req.user.id) }
    };
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

    if (req.query.category) {
        category = { category: req.query.category };
    };

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
    let limit = 10;
    if (req.query && req.query.limit) {
        limit = parseInt(req.query.limit, 10);
    }
    let skip = 0;
    if (req.query && req.query.skip) {
        skip = parseInt(req.query.skip, 10);
    }

    try {
        const products = await Product.find({ user: new mongoose.Types.ObjectId(req.params.userId) }, null, {
            limit: limit,
            skip: skip,
            sort: {
                createdAt: -1
            }
        }).select('-productImage');
        res.send(products);
    } catch (err) {
        next(err);
    }
});

// @route     GET /api/products/:id
// @desc      Get product by Id
// @access    Public
// @res
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).select('-productImageLow');
        if (!product) {
            throw new ErrorHandler(404, "Product Not Found");
        }
        res.send(product);
    } catch (err) {
        next(err);
    }
});

// @route     PUT /api/products/:id
// @desc      Update a product
// @access    Private
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ErrorHandler(400, errors.array());
            }

            // Get User info
            const user = await User.findById(req.user.id);
            if (!user) {
                throw new ErrorHandler(400, "User not found");
            }

            // Get Product saved
            const product = await Product.findById(req.params.id);
            if (!product) {
                throw new ErrorHandler(400, "Product not found");
            };

            const { title, description, price, category, meetupAt } = req.body;

            let newProductImage = null;
            let newProductImageLow = null;
            if (req.file) {
                newProductImage = await sharp(req.file.buffer)
                    .resize({ width: 720 })
                    .jpeg({
                        quality: 80,
                    })
                    .toBuffer();
                newProductImageLow = await sharp(req.file.buffer)
                    .resize({ width: 500 })
                    .jpeg({
                        quality: 50,
                    })
                    .toBuffer();
            }


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

            const updates = Object.keys(newProduct);
            updates.forEach((update) => product[update] = newProduct[update]);


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
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new ErrorHandler(404, "Product Not found");
        }
        if (product.user.toString() !== req.user.id) {
            throw new ErrorHandler(404, "You are not allowed to delete this product because you are not the user");
        }

        // Delete product id from user.sellings
        // @@ need improvement
        const index = user.sellings.findIndex((selling) => selling.product.toString() === req.params.id);
        if (index > -1) {
            user.sellings.splice(index, 1);
        } else {
            throw new ErrorHandler(400, "Cannot find product in User's selling list.");
        }

        await product.remove();
        await user.save();

        res.send({ msg: "Deleted!!" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;