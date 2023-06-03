const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    location: String,
    code: String
    }
);

module.exports = mongoose.model('Image', ImageSchema);