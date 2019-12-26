const express = require('express');
const bcrypt =　require('bcryptjs');
const { check, validationResult } = require('express-validator'); 
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// @route     GET /api/user
// @desc      get auth user
// @access    Public
// @res       {user: ...}
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch(err) {
        res.status(500).send("Server Error");
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
], async (req, res) => {
    try {
        // Check if the req are valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if the User already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({errors: [{msg: 'User already exists'}]});
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
        res.status(500).send(err);
    }
});

// @route     GET /api/user/login
// @desc      Login user
// @access    Public
// @res       { token:... }
router.get('/login', [
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Please enter a password with 6 or more characters').trim().isLength({min: 6})
], async (req, res) => {
    try {
        // Check if the req are valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if the User exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({errors: [{msg: 'Email or Password is invalid'}]});
        }

        const isMatch = bcrypt.compareSync(password, user.password); 
        if(!isMatch) {
            return res.status(400).send({errors: [{msg: 'Email or Password is invalid'}]});
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
        res.status(500).send(err);
    }
});

module.exports = router;