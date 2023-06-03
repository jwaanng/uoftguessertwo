const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Building = require('./models/building')

mongoose.connect('mongodb://127.0.0.1:27017/uoftguesser');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
const PORT = 5500;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render("home");
});

// app.get('/building', async (req, res) => {
//     const building = new Building({name: 'RB'});
//     await building.save();
//     res.send(building);
// });

app.listen(PORT, ()=> {
    console.log("On port 5500");
});