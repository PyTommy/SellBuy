const express = require('express');
require('./db/mongoose');
const User = require('./models/user');

const app = express();
app.use(express.json());

app.get('/user/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send("Not found");
            }
            res.send(user);
        })
        .catch((e) =>{
            res.status(500).send(e);
        });  
});

app.post('/user', (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(() => {
            res.send(user);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});



const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
});

