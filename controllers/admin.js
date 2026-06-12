const Product = require('../models/product');

// GET: Сторінка додавання нового товару
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Додати товар',
        path: '/admin/add-product',
        editing: false
    });
};

// POST: Обробка створення нового товару
exports.postAddProduct = async (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    try {
        await product.save();
        console.log('Товар успішно додано до бази MongoDB Atlas!');
        res.redirect('/admin/products');
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

// GET: Сторінка редагування існуючого товару
exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    try {
        const product = await Product.findById(prodId);
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Редагувати товар',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

// POST: Обробка збереження змін після редагування
exports.postEditProduct = async (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.redirect('/');
        }

        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;

        await product.save();
        console.log('Товар успішно оновлено!');
        res.redirect('/admin/products');
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

// GET: Відображення списку товарів адміна
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ userId: req.user._id });
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Адмін-товари',
            path: '/admin/products'
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

// POST: Видалення товару з бази даних
exports.postDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;

    try {
        await Product.findByIdAndDelete(prodId);
        console.log('Товар успішно видалено з бази даних.');
        res.redirect('/admin/products');
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};