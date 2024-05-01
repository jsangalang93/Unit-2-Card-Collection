const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: String,
    number: String,
    condition: String,
    series: String,
    isAuth: Boolean
});

const Cards = mongoose.model('Cards', cardSchema);

module.exports = Cards