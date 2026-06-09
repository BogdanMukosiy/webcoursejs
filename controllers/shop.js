const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Всі товари',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
    Product.findById(req.params.productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Магазин',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Ваш кошик',
                products: user.cart.items
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
    Product.findById(req.body.productId)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res) => {
    req.user.removeFromCart(req.body.productId)
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: { name: req.user.name, userId: req.user },
                products: products
            });
            return order.save();
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch(err => console.log(err));
};

exports.getOrders = (req, res) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Ваші замовлення',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};