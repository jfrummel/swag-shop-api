let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let db = mongoose.connect('mongodb://localhost/swag-shop', { useNewUrlParser: true });

let Product = require('./model/product');
let WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(request, response) {
    let product = new Product();
    product.title = request.body.title,
    product.price = request.body.price
    product.save(function(err, savedProduct) {
        if (err) {
            response.status(500).send({error: "Could not save product"});
        } else {
            response.send(savedProduct);
        }
    });
});

app.listen(3000, function() {
    console.log("API running on port 3000");
});

