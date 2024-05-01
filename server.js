const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const methodOverride = require('method-override');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

//generates req.body VVVV
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));

const Cards = require('./models/card.js');


app.get('/', (req, res)=>{
    res.render('home.ejs')
})

app.get('/cards/new', (req, res)=>{
    res.render('cards/new.ejs')
})

app.get('/cards', async (req, res)=>{
    const allCards = await Cards.find({})
    res.render('cards/index.ejs', {
        cards: allCards
    })
})

app.post('/cards', async (req, res)=>{
    console.log(req.body);
    if(req.body.isAuth === 'on'){
        req.body.isAuth = true;
    } else {
        req.body.isAuth = false;
    }
    const createdCard = await Cards.create(req.body)
    res.redirect('/cards')
})



app.get('/cards/:cardId', async (req, res)=>{
    const foundCard = await Cards.findById(req.params.cardId)
    res.render('cards/show.ejs', {
        card: foundCard
    })
});



mongoose.connection.on('connected', ()=>{
    console.log(`connected to MongoDB ${mongoose.connection.name}`);
})

app.listen(3015, () => {
    console.log('Running on port 3015');
})