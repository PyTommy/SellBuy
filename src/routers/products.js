const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const sharp = require('sharp');

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
    async (req, res) => {
        try {
            // Checking req.body was valid
            const errors = validationResult(req);
            if ( !errors.isEmpty() ) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Get User info
            const user = await User.findById(req.user.id);
            if (!user) {
                res.status(400).send({msg: "User not found"})
            }

            const { title, description, price, category, meetupAt } = req.body;
            
            const productImage = await sharp(req.file.buffer)
                .resize({width: 1280, height: 720})
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
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route     GET /api/products
// @desc      Get product
// @access    Public
// @res       [...products]
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}, null, {limits: 10, skip: 0});
        if (!products) {
            return res.status(404).send("Not Found");
        }

        res.send(products);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route     GET /api/products/:id
// @desc      Get product by Id
// @access    Public
// @res
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found");
        }

        res.send(product);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route     Update /api/products/:id
// @desc      Update product by Id
// @access    private
router.put('/:id', auth, async (req, res) => {

    try {
        // Validating inputs
        const updates = Object.keys(req.body);
        const allowedUpdates = ["title", "description", "price", "category", "meetupAt"];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({error: "Invalid updates!"});
        }

        // Update
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).send("Not Found");
        }

        updates.forEach((update) => product[update] = req.body[update]);

        await product.save();

        res.send(product);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); //@@@@@@@@@@@@@ No image update-_-

// @route     DELETE /api/products/:id
// @desc      Delete product by Id
// @access    Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Not Found");
        }
        if (product.user.toString() !== req.user.id) {
            return res.send("This is yours");
        }

        // Delete product id from user.sellings
        // @@ need improvement
        const index = user.sellings.findIndex((selling)=> selling.product.toString() === req.params.id);
        if ( index > -1){
            user.sellings.splice(index, 1);
        } else {
            return res.send("Cannot find product in User's selling list.")
        }

        await product.remove();
        await user.save();

        res.send({msg: "Deleted!!"});
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route         PUT api/products/like/:id
// @description   Like a product
// @access        Private
// @res           [{id:..., user: ...}, ...]
router.put('/like/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({msg: 'Product not found'});
        }

        if (product.likes.find( like => like.user.toString() === req.user.id)) {
            return res.status(400).json({msg: 'Product already liked!'})
        }

        product.likes.unshift({user: req.user.id});
        user.likes.unshift({product: product.id});

        await product.save();
        await user.save();

        res.json(product.likes);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route         PUT api/products/unlike/:id
// @description   Unlike a product
// @access        Private
// @res           [{id:..., user: ...}, ...]
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);

        const updatedLikes = product.likes.filter( like => like.user.toString() !== req.user.id);

        if(product.likes.length === updatedLikes.length) {
            return res.status(400).send({msg: 'Product has not yet been liked'});
        }

        product.likes = updatedLikes;

        const index = user.likes.findIndex((like) => like.product.toString() === req.params.id);
        if (index > -1) {
            user.likes.splice(index, 1);
        } else {
            return res.status(500).send("Cannot delete like from user's likes list!!");
        }

        await product.save();
        await user.save();

        res.json(product.likes);
    } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
    }
});

// @route         POST api/posts/comment/:id
// @description   Comment on a post
// @access        Private
router.post('/comment/:id', 
    [
        auth,
        check('text', 'Text is required').not().isEmpty()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
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

            product.comments.unshift(newComment);

            await product.save();

            res.json(product.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route         DELETE api/posts/comment/:id/:comment_id
// @description   Delete a comment
// @access        Private
router.delete('/comment/:id/:comment_id', auth, async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        // Pull out comment
        const comment = product.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists
        if(!comment) {
            return res.status(404).json({msg: "Comment does not exist"});
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'});
        }

        const updatedComments = product.comments.filter( comment => comment.id.toString() !== req.params.comment_id);

        product.comments = updatedComments;

        await product.save();

        res.json(product.comments);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route         PUT api/products/buy/:id
// @description   Buy a product
// @access        Private
router.put('/buy/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(req.params.id);
        
        if (!user) {
            return res.status(404).send({msg: "User not found"});
        }
        if (!product) {
            return res.status(404).send({msg: "Product not found"});
        }
        if (product.sold !== false) {
            return res.status(400).send({msg: "This product is already sold-out"})
        }

        product.sold = true;
        product.buyer = {user: req.user.id};

        user.boughts.unshift({product: product.id});

        await product.save();
        await user.save();

        res.json({msg: `You bought ${product.title}`});
    } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
    }
});

module.exports = router;