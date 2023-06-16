const mongoose = require('mongoose');
const Building = require('../models/building');
const buildingData = require('./buildingData');
const Image = require('../models/image')
const imageData = require('./imageData');

mongoose.connect('mongodb://127.0.0.1:27017/uoftguesser');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedBuildingDB = async () => {
    await Building.deleteMany({});  // deletes everything
    for (let i = 0 ; i < buildingData.length ; i++) {
        const building = new Building({
            name: `${buildingData[i].name}`,
            latitude: `${buildingData[i].latitude}`,
            longitutde: `${buildingData[i].longitude}`,
            code: `${buildingData[i].code}`
        })
        await building.save();
    }
}

const seedImagesDB = async () => {
    await Image.deleteMany({});
    for (let i = 0 ; i < imageData.length ; i++){
        const image = new Image({
            url: `${imageData[i].url}`,
            location: `${imageData[i].location}`,
            code: `${imageData[i].code}`
        })
        await image.save();
    }
}

seedBuildingDB()
  .then(() => {
    console.log('Building database seeded successfully');
    return seedImagesDB();
  })
  .then(() => {
    console.log('Images database seeded successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('An error occurred during seeding:', error);
    mongoose.connection.close();
  });

// console.log("hi", imageData[0].url);