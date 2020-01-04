const express = require('express');
const bcrypt =　require('bcryptjs');
const { check, validationResult } = require('express-validator'); 
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const {ErrorHandler} = require('../middleware/error');


const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const uploadAvatar = require('../middleware/uploadAvatar');
// const multer = require('multer');

// @route     GET /api/user
// @desc      get auth user
// @access    Public
// @res       {user: ...}
router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch(err) {
        next(err);
    }
});

// @route     POST /api/user/signup
// @desc      Signup user
// @access    Public
// @res       { token: ... }
router.post('/signup', [
    check('name', 'Name is required').trim().not().isEmpty(), 
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Please enter a password with 6 or more characters').trim().isLength({min: 6})
], async (req, res, next) => {
    try {
        // Check if the req are valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorHandler(400, errors.array());
        }

        const { name, email, password } = req.body;

        // Check if the User already exists
        let user = await User.findOne({ email });
        if (user) {
            throw new ErrorHandler(400, "User already exists");
        }
        
        user = new User({
            name,
            email,
            password
        });

        // hash provided 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // save the user on database
        await user.save();

        // Publishing Jsonwebtoken
        const token = jwt.sign(
            { 
                user: {
                    id: user.id 
                }
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' });
        res.status(201).send({token});
    } catch(err) {
        next(err);
    }
});

// @route     POST /api/user/login
// @desc      Login user
// @access    Public
// @res       { token:... }
router.post('/login', [
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Please enter a password with 6 or more characters').trim().isLength({min: 6})
], async (req, res, next) => {
    try {
        // Check if the req are valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorHandler(400, errors.array());
        }

        const { email, password } = req.body;

        // Check if the User exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new ErrorHandler(400, 'Email or Password is invalid');
        }

        const isMatch = bcrypt.compareSync(password, user.password); 
        if(!isMatch) {
            throw new ErrorHandler(400, 'Email or Password is invalid');
        }

        // Publishing Jsonwebtoken
        const token = jwt.sign(
            { 
                user: {
                    id: user.id 
                }
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' });
        res.status(200).send({token});
    } catch(err) {
        next(err);
    }
});


// @route     POST /api/user/avatar
// @desc      Upload a profile pic
// @access    Private
// @res       {msg: "..."}
router.post('/avatar', 
    [
        auth,
        uploadAvatar
    ],
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!req.file) {
                throw new ErrorHandler('400', "Please upload a png, jpeg or jpg");
            }
            const buffer = await sharp(req.file.buffer)
                .resize({width: 100, height: 100})
                .png()
                .toBuffer();
            user.avatar = buffer;
            await user.save();
            res.send({message: "Uploaded the avatar image"});
        } catch (err) {
            next(err);
        }
    }
);

// @route     GET /api/user/avatar
// @desc      Get a avatar
// @access    Public
// @res       {avatar: Buffer}
router.get('/:id/avatar', async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new ErrorHandler(404, 'The avatar is not exists.');
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (err) {
        next(err);
    }
});



module.exports = router;