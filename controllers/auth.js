const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const session = require('express-session');

module.exports = router;

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

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
})

//SIGN IN ROUTE
router.post('/sign-in', async (req, res) => {

    //making sure the user is in the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }

    //bcrypt comparing passwords through the hash
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }

    req.session.user = {
        username: userInDatabase.username,
    };
    res.redirect('/');
});

