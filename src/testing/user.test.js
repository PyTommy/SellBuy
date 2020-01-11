const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'test',
    email: 'test@test.com',
    password: 'testtest'
};
const jwtOne = jwt.sign(
    { 
        user: {
            id: userOneId 
        }
    }, 
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

beforeEach( async () => {
    await User.deleteMany();
    await new User(userOne).save();
});


//===================
// POST /api/user/signup
//===================
test('Should signup a new user', async () => {
    await request(app)
        .post('/api/user/signup')
        .send({
            name: 'signup',
            email: 'signup@test.com',
            password: 'signup'
        })
        .expect(201);
});

test('400: User Already Exists', async () => {
    const res = await request(app)
        .post('/api/user/signup')
        .send(userOne)
        .expect(400);
    expect(res.body.message)
        .toBe("User already exists");
});

test('400: Invalid inputs', async() => {
    const res = await request(app)
        .post('/api/user/signup')
        .send({
            name: '',
            email: 'test@test.com',
            password: ''
        })
        .expect(400);
    expect(res.body.message.length)
        .toBe(2);
});

//===================
// POST /api/user/login
//===================
test('Should login user', async () => {
    const res = await request(app)
        .post('/api/user/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);
});

//===================
// GET /api/user
//===================
test('Should get user', async() => {
    const res = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${jwtOne}`)
        .send()
        .expect(200);
});
test('400: "Authorization" header is not provided', async() => {
    const res = await request(app)
        .get('/api/user')
        .send()
        .expect(400);
    expect(res.body.message).toBe('"Authorization" header is not provided');
});