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

app.get('/product', function(request, response) {
    Product.find({}, function(err, products) {
        if (err) {
            response.status(500).send({error: "Products not found"});
        } else {
            response.send(products);
        }
    });
});

app.get('/wishlist', function(request, response) {
    WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishLists) {
        if (err) {
            response.status(500).send({error: "Could not find wish list"});
        } else {
            response.send(wishLists);
        }
    });
});

app.post('/wishlist', function(request,response) {
    let wishList = new WishList();
    wishList.title = request.body.title;
    wishList.save(function(err, newWishList) {
        if (err) {
            response.status(500).send({error: "Wish List could not be created"});
        } else {
            response.send(newWishList);
        }
    })
});

app.put('/wishlist/product/add', function(request, response) {
    Product.findOne({_id: request.body.productId}, function(err, product) {
        if (err) {
            response.status(500).send({error: "Product not found"});
        } else {
            WishList.update({_id: request.body.wishListId}, {$addToSet:{products: product._id}}, function(err, wishList) {
                if (err) {
                    response.status(500).send({error: "Could not update Wish List"});
                } else {
                    response.send(wishList);
                }
            });
        }
    });
});

app.listen(3000, function() {
    console.log("API running on port 3000");
});

