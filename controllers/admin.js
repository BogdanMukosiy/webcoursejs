const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Додати товар',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product({
        title, price, description, imageUrl,
        userId: req.user // Mongoose автоматично витягне id з об'єкта користувача
    });
    product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect('/');
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) return res.redirect('/');
            res.render('admin/edit-product', {
                pageTitle: 'Редагувати товар',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res) => {
    const { productId, title, price, imageUrl, description } = req.body;
    Product.findById(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            return product.save();
        })
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
    Product.find({ userId: req.user._id }) // Показуємо товари лише цього адміна
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Адмін-товари',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.body.productId)
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};