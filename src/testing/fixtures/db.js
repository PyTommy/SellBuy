const { readFileSync } = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Product = require('../../models/products');

// =============
// Users
// =============

// UserOne
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Test 1',
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

// userTwo
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Test 2',
    email: 'test2@test.com',
    password: 'testtest'
};
const jwtTwo = jwt.sign(
    {
        user: {
            id: userTwoId
        }
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

// =============
// Products
// =============
console.log("__dirname", __dirname);
const imgFile = readFileSync('src/testing/fixtures/default.png');
const fileStr = imgFile.toString("base64");

// Owner = UserOne
// Purchaser = undefined
const productOneId = new mongoose.Types.ObjectId();
const productOne = {
    _id: productOneId,
    title: 'Table',
    description: 'Table',
    price: 100,
    category: 'Home',
    meetupAt: 'place 1',
    user: userOne._id,
    name: userOne.name,
    avatar: fileStr,
    productImage: fileStr,
    productImageLow: fileStr
};

// Owner = UserTwo
// Purchaser = UserOne
const productTwoId = new mongoose.Types.ObjectId();
const productTwo = {
    _id: productTwoId,
    title: 'Macbook',
    description: 'Brand new!!!!!!!',
    price: 50000,
    category: 'Electronics',
    meetupAt: 'place 2',
    user: userTwo._id,
    name: userTwo.name,
    avatar: fileStr,
    productImage: fileStr,
    productImageLow: fileStr,
    sold: true,
    purchaser: userOneId,
};

// Owner = UserTwo
// Purchaser = UserOne
const productThreeId = new mongoose.Types.ObjectId();
const productThree = {
    _id: productThreeId,
    title: 'Dell laptop',
    description: 'Used but comes with Office 365',
    price: 50000,
    category: 'Electronics',
    meetupAt: 'place 2',
    user: userTwo._id,
    name: userTwo.name,
    avatar: fileStr,
    productImage: fileStr,
    productImageLow: fileStr,
    sold: true,
    purchaser: userOneId,
};


const setupUsers = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
}

const setupAll = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await Product.deleteMany();
    await new Product(productOne).save();
    await new Product(productTwo).save();
    await new Product(productThree).save();
};

module.exports = {
    userOneId,
    userOne,
    jwtOne,

    userTwoId,
    userTwo,
    jwtTwo,

    productOne,
    productOneId,

    productTwo,
    productTwoId,

    productThree,
    productThreeId,

    setupUsers,
    setupAll
};