var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    imageURL: String,
    imageAlt: String,
    imageThumb: String,
    pageUrl: String
});

module.exports = mongoose.model('image', imageSchema);