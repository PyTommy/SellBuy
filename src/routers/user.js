const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const { ErrorHandler } = require('../middleware/error');


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
        if (!user) {
            throw new ErrorHandler(400, "Please Login again");
        }
        res.json(user);
    } catch (err) {
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
    check('password', 'Please enter a password with 6 or more characters').trim().isLength({ min: 6 })
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

        // Create new User
        user = new User({
            name,
            email,
            password
        });

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
            { expiresIn: '7d' });
        res.status(201).send({ token });
    } catch (err) {
        next(err);
    }
});

// @route     POST /api/user/login
// @desc      Login user
// @access    Public
// @res       { token:... }
router.post('/login', [
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Please enter a password with 6 or more characters').trim().isLength({ min: 6 })
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

        //Check if the password correct
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new ErrorHandler(400, 'Email or Password is invalid');
        }

        // Publishing Jsonwebtoken
        const token = jwt.sign(
            {
                user: { id: user.id }
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' });
        res.status(200).send({ token });
    } catch (err) {
        next(err);
    }
});


// @route     POST /api/user/avatar
// @desc      Upload a profile pic
// @access    Private
// @res       {msg: "..."}
router.put('/avatar',
    [
        auth,
        uploadAvatar
    ],
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            // Check if the file exists
            if (!req.file) throw new ErrorHandler('400', "Please upload a png, jpeg or jpg");

            // Compress the image
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 300, height: 300 })
                .jpeg({ quality: 80 })
                .toBuffer();

            // Save
            user.avatar = buffer;
            await user.save();

            // Get avatar from database (avatar data format that saved is different from the one above)
            const storedAvatar = await User.findById(req.user.id).select("avatar");

            res.send(storedAvatar);
        } catch (err) {
            next(err);
        }
    }
);

// @route     GET /api/user/:id
// @desc      Get a user info to show profile
// @access    Private
// @res       {avatar, sellings, name}
router.get('/:id', async (req, res, next) => {
    try {
        // Get user with
        const user = await User.findById(req.params.id).select("name avatar facebook");
        if (!user) throw new ErrorHandler(404, 'User not found');

        res.send(user);
    } catch (err) {
        next(err);
    }
});

// @route     PUT /api/user/profile
// @desc      Change profile
// @access    Private
// @req.body  {name, facebook}
// @res       user
router.put('/profile', [
    check('name', 'Name is required').trim().not().isEmpty(),
    auth
], async (req, res, next) => {
    try {
        // Check if the req are valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new ErrorHandler(400, errors.array());

        const { name, facebook } = req.body;

        // Get user info
        const user = await User.findById(req.user.id).select("-password");

        // Update and save
        user.name = name;
        if (facebook) user.facebook = facebook;
        await user.save();

        res.send(user);
    } catch (err) {
        next(err);
    }
});

// @route     PUT /api/user/email
// @desc      Update email
// @access    Private
// @res       user -password
router.put('/email', [
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Please enter a password with 6 or more characters').trim().isLength({ min: 6 }),
    auth
], async (req, res, next) => {
    try {
        // Check if the req are valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new ErrorHandler(400, errors.array());

        const { email, password } = req.body;

        // Check if the User exists
        const user = await User.findById(req.user.id);

        //Check if the password correct
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) throw new ErrorHandler(400, 'Password is invalid');

        // Update and save
        user.email = email;
        await user.save();

        res.status(200).send(user.email);
    } catch (err) {
        next(err);
    }
});

// @route     PUT /api/user/password
// @desc      Update password
// @access    Private
// @res       user -password
router.put('/password', [
    check('curPassword', 'Please enter a current password with 6 or more characters').trim().isLength({ min: 6 }),
    check('newPassword', 'Please enter a new password with 6 or more characters').trim().isLength({ min: 6 }),
    auth
], async (req, res, next) => {
    try {
        // Check if the req are valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new ErrorHandler(400, errors.array());

        const { curPassword, newPassword } = req.body;

        // Get user
        const user = await User.findById(req.user.id);

        //Check if the password correct
        const isMatch = bcrypt.compareSync(curPassword, user.password);
        if (!isMatch) throw new ErrorHandler(400, 'Current Password is invalid');

        user.password = newPassword;
        await user.save();

        res.status(200).send({ message: "Changed Password" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;