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
// CREATE ROUTE----------------------------------------------------------------------
app.get('/cards/new', (req, res)=>{
    res.render('cards/new.ejs')
})

app.post('/cards', async (req, res)=>{
    // console.log(req.body);
    
    // if(req.body.condition === "M" || "m"){
    //     req.body.condition = "M"
    // }else if(req.body.condition === "NM" || "nm"){
    //     req.body.condition = "NM"
    // } else if (req.body.condition === "LP" || "lp"){
    //     req.body.condition = "LP"
    // } else if (req.body.condition === "MP" || "mp"){
    //     req.body.condition = "MP"
    // } else if (req.body.condition === "HP" || "hp"){
    //     req.body.condition = "HP"
    // } else if (req.body.condition === "DMG" || "dmg"){
    //     req.body.condition = "DMG"
    // }else{
    //     alert('Please type a valid input in the condition field.')
    // }
    
    if(req.body.isAuth === 'on'){
        req.body.isAuth = true;
    } else {
        req.body.isAuth = false;
    }
    const createdCard = await Cards.create(req.body)
    res.redirect('/cards')
})

//READ ROUTE-----------------------------------------------------------------------
app.get('/cards', async (req, res)=>{
    const allCards = await Cards.find({})
    res.render('cards/index.ejs', {
        cards: allCards
    })
})

app.get('/cards/:id', async (req, res) => {
    const foundCard = await Cards.findById(req.params.id);
    res.render('cards/show.ejs', {card: foundCard});
});

// UPDATE ROUTE--------------------------------------------------------------------

app.get('/cards/:id/edit', async (req, res)=>{
    const foundCard = await Cards.findById(req.params.id);
    res.render('cards/edit.ejs', {
        card: foundCard
    })
})

app.put('/cards/:id', async (req, res)=>{
    // if(req.body.condition === "M" || "m"){
    //     req.body.condition = "M"
    // }else if(req.body.condition === "NM" || "nm"){
    //     req.body.condition = "NM"
    // } else if (req.body.condition === "LP" || "lp"){
    //     req.body.condition = "LP"
    // } else if (req.body.condition === "MP" || "mp"){
    //     req.body.condition = "MP"
    // } else if (req.body.condition === "HP" || "hp"){
    //     req.body.condition = "HP"
    // } else if (req.body.condition === "DMG" || "dmg"){
    //     req.body.condition = "DMG"
    // }else{
    //     alert('Please type a valid input in the condition field.')
    // }
    await Cards.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.redirect(`/cards/${req.params.id}`);
})

// DELETE ROUTE--------------------------------------------------------------------

app.delete('/cards/:id', async (req, res)=>{
    await Cards.findByIdAndDelete(req.params.id);
    res.redirect('/cards');
})

// CONNECTIONS---------------------------------------------------------------------
mongoose.connection.on('connected', ()=>{
    console.log(`connected to MongoDB ${mongoose.connection.name}`);
})

app.listen(3015, () => {
    console.log('Running on port 3015');
})