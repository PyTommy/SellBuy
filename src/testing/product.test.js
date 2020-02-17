const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const {
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
} = require('./fixtures/db');

// Dummy Data
const dummy = {
    title: 'T-shirts',
    describe: "Nice T-shirts",
    category: "Women",
    price: 1000,
    meetupAt: "Beppu",
    productImage: 'src/testing/fixtures/default.png'
};


// Setup users
beforeAll(setupUsers);

//==================
// POST /products
//==================
describe('Testing POST product', () => {
    test('Should create product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${jwtOne}`)
            .field('title', dummy.title)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .attach('productImage', dummy.productImage)
            .expect(200);
    });

    test('400: Should fail creating product (No title)', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${jwtOne}`)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .attach('productImage', dummy.productImage)
            .expect(400);
    });

    test('400: Should fail (No Image attached)', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${jwtOne}`)
            .field('title', dummy.title)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .expect(400);
    });

})


//==================
// GET /products
//==================
describe('matching cities to foods', () => {
    beforeAll(setupAll);

    test('Should get products', async () => {
        const res = await request(app)
            .get('/api/products')
            .expect(200);

        expect(res.body.length).toBe(3);
    });

    test('Should get Purchased products', async () => {
        const res = await request(app)
            .get('/api/products?purchased=true')
            .set('Authorization', `Bearer ${jwtOne}`)
            .expect(200);

        expect(res.body.length).toBe(2);
    });

    test('Should get "Macbook" with "mac book"', async () => {
        const res = await request(app)
            .get('/api/products?search=mac+book')
            .expect(200);

        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe("Macbook");
    });

    test('Should get no products, searching "mac laptop"', async () => {
        const res = await request(app)
            .get('/api/products?search=mac+laptop')
            .expect(200);

        expect(res.body.length).toBe(0);
    });

    test('200: Should get only "Electronics"', async () => {
        const res = await request(app)
            .get('/api/products?category=Electronics')
            .expect(200);

        expect(res.body.length).toBe(2);
    });
});


// //==================
// // GET /products/:id
// //==================
describe('GET a product', () => {
    beforeAll(setupAll);

    test('Should get a product', async () => {
        const res = await request(app)
            .get(`/api/products/${productOne._id}`)
            .expect(200);

        expect(res.body.title).toBe(productOne.title);
    });

    test('404: Should fail to get a product with "Not found"', async () => {
        const dummyId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/products/${dummyId}`)
            .expect(404);
    });
});


// //==================
// // PUT /products/:id
// //==================
describe('Update a product', () => {
    beforeEach(setupAll);

    test('Should update a product with Image', async () => {
        await request(app)
            .put(`/api/products/${productOne._id}`)
            .set('Authorization', `Bearer ${jwtOne}`)
            .field('title', dummy.title)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .attach('productImage', dummy.productImage)
            .expect(200);
        const res = await request(app)
            .get(`/api/products/${productOne._id}`)
            .expect(200);
        expect(res.body.title).toBe(dummy.title);
    });

    test('Should update a product without Image', async () => {
        await request(app)
            .put(`/api/products/${productOne._id}`)
            .set('Authorization', `Bearer ${jwtOne}`)
            .field('title', dummy.title)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .expect(200);
        const res = await request(app)
            .get(`/api/products/${productOne._id}`)
            .expect(200);
        expect(res.body.title).toBe(dummy.title);
    });

    test('Should fail to update a product without title', async () => {
        await request(app)
            .put(`/api/products/${productOne._id}`)
            .set('Authorization', `Bearer ${jwtOne}`)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .expect(400);
    });

    test('Should fail to update a product from different user', async () => {
        await request(app)
            .put(`/api/products/${productOne._id}`)
            .set('Authorization', `Bearer ${jwtTwo}`)
            .field('title', dummy.title)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .expect(401);
    });

    test('Should fail to update a sold-out product', async () => {
        await request(app)
            .put(`/api/products/${productTwo._id}`)
            .set('Authorization', `Bearer ${jwtTwo}`)
            .field('title', dummy.title)
            .field('description', dummy.describe)
            .field('price', dummy.price)
            .field('category', dummy.category)
            .field('meetupAt', dummy.meetupAt)
            .expect(400);
        const res = await request(app)
            .get(`/api/products/${productTwo._id}`)
            .expect(200);
        expect(res.body.title).toBe(productTwo.title);
    });
});


// //==================
// // DELETE /products/:id
// //==================
describe('Delete product', () => {
    beforeEach(setupAll);

    test('200: Should delete a product', async () => {
        await request(app)
            .delete(`/api/products/${productOne._id}`)
            .set('Authorization', `Bearer ${jwtOne}`)
            .expect(200);
    });

    test('400: Should fail to delete a product with different auth', async () => {
        await request(app)
            .delete(`/api/products/${productOne._id}`)
            .set('Authorization', `Bearer ${jwtTwo}`)
            .expect(400);
    });

    test('400: Should fail to delete sold-out product', async () => {
        await request(app)
            .delete(`/api/products/${productTwo._id}`)
            .set('Authorization', `Bearer ${jwtTwo}`)
            .expect(400);
    });
});


// // ==================
// // POST /products/purchase/:id
// // ==================
describe('Purchase a product', () => {
    beforeEach(setupAll);
    test('200: Should purchase a product', async () => {
        await request(app)
            .put(`/api/products/purchase/${productOne._id}`)
            .set('Authorization', `Bearer ${jwtTwo}`)
            .expect(200);
        const res = await request(app)
            .get(`/api/products/${productOne._id}`)
            .expect(200);
        expect(res.body.sold).toBe(true);
        expect(res.body.purchaser._id.toString()).toBe(userTwoId.toString());
    });

    test('400: Should fail to purchase a sold-out product', async () => {
        await request(app)
            .put(`/api/products/purchase/${productTwo._id}`)
            .set('Authorization', `Bearer ${jwtOne}`)
            .expect(400);
    });
});

// // ==================
// // POST /products/cancel/:id
// // ==================
describe('Purchase cancel a product', () => {
    beforeEach(setupAll);
    test('200: Should purchase a product', async () => {
        await request(app)
            .put(`/api/products/cancel/${productTwo._id}`)
            .set('Authorization', `Bearer ${jwtOne}`)
            .expect(200);
        const res = await request(app)
            .get(`/api/products/${productTwo._id}`)
            .expect(200);
        expect(res.body.sold).toBe(false);
        expect(res.body.purchaser).toBe(null);
    });

    test('400: Should fail to cancel from different user', async () => {
        await request(app)
            .put(`/api/products/cancel/${productTwo._id}`)
            .set('Authorization', `Bearer ${jwtTwo}`)
            .expect(400);
    });
});

// // ==================
// // POST /products/reject/:id
// // ==================
describe('Should reject a purchase', () => {
    beforeEach(setupAll);
    test('200: Should purchase a product', async () => {
        await request(app)
            .put(`/api/products/reject/${productTwo._id}`)
            .set('Authorization', `Bearer ${jwtTwo}`)
            .expect(200);
        const res = await request(app)
            .get(`/api/products/${productTwo._id}`)
            .expect(200);
        expect(res.body.sold).toBe(false);
        expect(res.body.purchaser).toBe(null);
    });

    test('400: Should fail to reject from different user', async () => {
        await request(app)
            .put(`/api/products/reject/${productTwo._id}`)
            .set('Authorization', `Bearer ${jwtOne}`)
            .expect(400);
    });
});