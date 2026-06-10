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
exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user // Mongoose автоматично витягне id з повноцінного об'єкта користувача
    });

    product
        .save()
        .then(result => {
            console.log('Товар успішно додано до бази MongoDB Atlas!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error); // Передаємо помилку в глобальний мідлвар в app.js
        });
};

// GET: Сторінка редагування існуючого товару
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Редагувати товар',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

// POST: Обробка збереження змін після редагування
exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            // Оновлюємо поля документа
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;

            return product.save();
        })
        .then(result => {
            console.log('Товар успішно оновлено!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

// GET: Відображення списку товарів адміна
exports.getProducts = (req, res, next) => {
    // Показуємо товари, які належать виключно поточному авторизованому користувачу
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Адмін-товари',
                path: '/admin/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

// POST: Видалення товару з бази даних
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findByIdAndDelete(prodId)
        .then(() => {
            console.log('Товар успішно видалено з бази даних.');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};