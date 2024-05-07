const express = require('express');
const app = express();

const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const methodOverride = require('method-override');
const morgan = require('morgan');

const port = process.env.PORT ? process.env.PORT : 3015;
const authController = require('./controllers/auth.js');

const session = require ('express-session');

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

mongoose.connect(process.env.MONGODB_URI);


mongoose.connection.on("error", (error) => {
    console.log("MongoDB connection error ", error);
  });

// MIDDLEWARE VVVV
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(morgan('dev'));

//session setup prefs


const Cards = require('./models/card.js');

//Home page
app.get('/', async (req, res)=>{
    res.render('home.ejs', {
        user: req.session.user,
    });
});

//calling the authController
app.use('/auth', authController);

// CREATE ROUTE------------------------------------------------------------------------
app.get('/cards/new', (req, res)=>{
    res.render('cards/new.ejs')
})

app.post('/cards', async (req, res)=>{
    if(req.body.isAuth === 'on'){
        req.body.isAuth = true;
    } else {
        req.body.isAuth = false;
    }
    const createdCard = await Cards.create(req.body)
    res.redirect('/cards')
})

//READ ROUTE--------------------------------------------------------------------------
app.get('/cards', async (req, res)=>{
    const allCards = await Cards.find({})
    res.render('cards/index.ejs', {
        cards: allCards
    })
})

// SHOW ROUTE--------------------------------------------------------------------------

app.get('/cards/:id', async (req, res) => {
    const foundCard = await Cards.findById(req.params.id);
    res.render('cards/show.ejs', {card: foundCard});
});

// UPDATE ROUTE------------------------------------------------------------------------

app.get('/cards/:id/edit', async (req, res)=>{
    const foundCard = await Cards.findById(req.params.id);
    res.render('cards/edit.ejs', {
        card: foundCard
    })
})

app.put('/cards/:id', async (req, res)=>{
    await Cards.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.redirect(`/cards/${req.params.id}`);
})

// PARSING BY SERIES--------------------------------------------------------------------

app.get('/:series', async (req, res)=>{
    const foundCards = await Cards.find({series: req.params.series});
    console.log(
        foundCards
    );
    res.render('cards/series.ejs', {card: foundCards, series: req.params.series});
});
// DELETE ROUTE------------------------------------------------------------------------

app.delete('/cards/:id', async (req, res)=>{
    await Cards.findByIdAndDelete(req.params.id);
    res.redirect('/cards');
})

// CONNECTIONS-------------------------------------------------------------------------
mongoose.connection.on('connected', ()=>{
    console.log(`connected to MongoDB ${mongoose.connection.name}`);
})

app.listen(3015, () => {
    console.log('Running on port 3015');
})