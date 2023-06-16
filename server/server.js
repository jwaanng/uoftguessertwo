const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const Building = require('./models/building')
const Image = require('./models/image')

mongoose.connect('mongodb://127.0.0.1:27017/uoftguesser');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
const PORT = 5500;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
  });


app.get('/images', async (req, res) => {
  try {
      const randomImage = await Image.aggregate([{ $sample: { size: 1 } }]);
      res.json(randomImage);
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Failed to fetch random picture' })
    }
});

app.get('/buildings', async (req, res) => {
    try {
      const randomBuilding = await Building.aggregate([{ $sample: { size: 1 } }]);
      res.json(randomBuilding);
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Failed to fetch random building' })
    }
});


// app.get('/building', async (req, res) => {
//     const building = new Building({name: 'RB'});
//     await building.save();
//     res.send(building);
// });

app.listen(PORT, ()=> {
    console.log("On port 5500");
});