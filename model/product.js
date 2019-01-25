let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let product = new Schema({
    title: String,
    price: Number,
    likes: {type: Number, default: 0}
});  

module.exports = mongoose.model('Product', product);

