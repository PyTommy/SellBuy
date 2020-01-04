const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const sharp = require('sharp');
const {ErrorHandler} = require('../middleware/error');

// Middleware
const auth = require('../middleware/auth');
const uploadProductPic = require('../middleware/uploadProductPic');

// Models
const User = require('../models/user');
const Product = require('../models/products');



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
        check('meetupAt', 'MeetupAt is required').trim().not().isEmpty(),
    ], 
    async (req, res, next) => {
        try {
            // Checking req.body was valid
            const errors = validationResult(req);
            if ( !errors.isEmpty() ) {
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
                // .resize({width: 640, height: 480})
                .resize({width: 300})
                .png()
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
                productImage 
            });

            await product.save();

            user.sellings.unshift({product: product.id});
            await user.save();

            res.send(product);
        } catch (err) {
            next(err);
        }
    }
);

// @route     GET /api/products
// @desc      Get product
// @access    Public
// @res       [...products]
router.get('/', async (req, res, next) => {
    let limit = 1;
    if (req.query && req.query.limit) {
        limit = parseInt(req.query.limit, 10);
    } 
    let skip = 0;
    if (req.query && req.query.skip) {
        skip = parseInt(req.query.skip, 10);
    } 

    try {
        const products = await Product.find({}, null, {
            limit: limit, 
            skip: skip
        }).sort({date: -1});
        // if (!products) {
        //     throw new ErrorHandler(404, "Products Not Found");
        // }

        res.send(products);
    } catch(err) {
        next(err);
    }
});

// @route     GET /api/products/:id
// @desc      Get product by Id
// @access    Public
// @res
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new ErrorHandler(404, "Product Not Found");
        }
        res.send(product);
    } catch(err) {
        next(err);
    }
});

// @route     Update /api/products/:id
// @desc      Update product by Id
// @access    private
router.put('/:id', auth, async (req, res, next) => {
    try {
        // Validating inputs
        const updates = Object.keys(req.body);
        const allowedUpdates = ["title", "description", "price", "category", "meetupAt"];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new ErrorHandler(400, "Invalid updates!");
        }

        // Update
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            throw new ErrorHandler(404, "Product Not Found");
        }

        updates.forEach((update) => product[update] = req.body[update]);

        await product.save();

        res.send(product);
    } catch(err) {
        next(err);
    }
}); //@@@@@@@@@@@@@ No image update-_-

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
        const index = user.sellings.findIndex((selling)=> selling.product.toString() === req.params.id);
        if ( index > -1){
            user.sellings.splice(index, 1);
        } else {
            throw new ErrorHandler(400, "Cannot find product in User's selling list.");
        }

        await product.remove();
        await user.save();

        res.send({msg: "Deleted!!"});
    } catch(err) {
        next(err);
    }
});

// @route         PUT api/products/like/:id
// @description   Like a product
// @access        Private
// @res           [{id:..., user: ...}, ...]
router.put('/like/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new ErrorHandler(400, "Product not found");
        }

        if (product.likes.find( like => like.user.toString() === req.user.id)) {
            throw new ErrorHandler(400, "Product already liked!");
        }

        product.likes.unshift({user: req.user.id});
        user.likes.unshift({product: product.id});

        await product.save();
        await user.save();

        res.json(product.likes);
    } catch(err) {
        next(err);
    }
});

// @route         PUT api/products/unlike/:id
// @description   Unlike a product
// @access        Private
// @res           [{id:..., user: ...}, ...]
router.put('/unlike/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        const updatedLikes = product.likes.filter( like => like.user.toString() !== req.user.id);

        if(product.likes.length === updatedLikes.length) {
            throw new ErrorHandler(400, "Product has not yet been liked");
        }

        product.likes = updatedLikes;

        const index = user.likes.findIndex((like) => like.product.toString() === req.params.id);
        if (index > -1) {
            user.likes.splice(index, 1);
        } else {
            throw new ErrorHandler(500, "Cannot delete like from user's likes list!!");
        }

        await product.save();
        await user.save();

        res.json(product.likes);
    } catch(err) {
        next(err)
    }
});

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
router.delete('/comment/:id/:comment_id', auth, async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        // Pull out comment
        const comment = product.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists
        if(!comment) {
            throw new ErrorHandler(404, "Comment does not exist");
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            throw new ErrorHandler(401, "User not authorized");
        }

        const updatedComments = product.comments.filter( comment => comment.id.toString() !== req.params.comment_id);

        product.comments = updatedComments;

        await product.save();

        res.json(product.comments);
    } catch(err) {
        next(err);
    }
});

// @route         PUT api/products/buy/:id
// @description   Buy a product
// @access        Private
router.put('/buy/:id', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);
        
        if (!user) {
            throw new ErrorHandler(400, "User not found");
        }
        if (!product) {
            throw new ErrorHandler(404, "Product not foun");
        }
        if (product.sold !== false) {
            throw new ErrorHandler(400, "This product is already sold-out");
        }

        product.sold = true;
        product.buyer = {user: req.user.id};

        user.boughts.unshift({product: product.id});

        await product.save();
        await user.save();

        res.json({msg: `You bought ${product.title}`});
    } catch(err) {
        next(err)
    }
});

module.exports = router;