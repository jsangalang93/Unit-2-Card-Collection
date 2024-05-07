const express = require('express');
const router = express.Router();

module.exports = router;
const bcrypt = require('bcrypt');


const User = require('../models/user.js');




router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    res.send('Welcome to the The Pail!');

    //user validation
    const userInDatabase = await User.findOne({username: req.body.username});
    if (userInDatabase) {
        return res.send('Sorry, you may be a duplicate. Try again.');
    }

    if (req.body.password !== req.body.confirmPassword) {
        return  res.send(`I know it's difficult, but write the <b>same</b> password t w i c e.`);
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    //creates user
    const user = await User.create(req.body);
    res.send(`welcome to the Pail, ${user.name}!`);
});