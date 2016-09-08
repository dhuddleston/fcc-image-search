var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    imageURL: String,
    imageAlt: String,
    imageThumb: String,
    pageUrl: String
});

var querySchema = new Schema({
   term: String,
   when: String
});

module.exports = mongoose.model('image', imageSchema);
module.exports = mongoose.model('searchQuery', querySchema);