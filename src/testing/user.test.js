const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {
    userOne,
    jwtOne,
    setupUsers,
} = require('./fixtures/db');

// Dummy user
const userThreeId = new mongoose.Types.ObjectId();
const userThree = {
    _id: userThreeId,
    name: 'Test 3',
    email: 'test3@test.com',
    password: 'testtest'
};
const jwtThree = jwt.sign(
    {
        user: {
            id: userThreeId
        }
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

// Setup useOne and userTwo
beforeAll(setupUsers);


//===================
// POST /api/user/signup
//===================
describe('Testing Signup', () => {
    test('Should signup a new user', async () => {
        await request(app)
            .post('/api/user/signup')
            .send({
                name: userThree.name,
                email: userThree.email,
                password: userThree.password
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

    test('400: Invalid inputs', async () => {
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

})

//===================
// POST /api/user/login
//===================

describe('Testing login', () => {
    test('Should login user', async () => {
        await request(app)
            .post('/api/user/login')
            .send({
                email: userOne.email,
                password: userOne.password
            })
            .expect(200);
    });

    test('Should fail to login user', async () => {
        await request(app)
            .post('/api/user/login')
            .send({
                email: userOne.email,
                password: "abcdefghi"
            })
            .expect(400);
    });

});

// //===================
// // GET /api/user
// //===================
describe('Testing loading user', () => {
    test('Should get user', async () => {
        await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${jwtOne}`)
            .send()
            .expect(200);
    });
    test('400: "Authorization" header is not provided', async () => {
        const res = await request(app)
            .get('/api/user')
            .send()
            .expect(400);
        expect(res.body.message).toBe('"Authorization" header is not provided');
    });
});
