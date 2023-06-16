const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuildingSchema = new Schema({
    name: String,
    latitude: Number,
    longitutde: Number,
    code: String
});

module.exports = mongoose.model('Building', BuildingSchema);