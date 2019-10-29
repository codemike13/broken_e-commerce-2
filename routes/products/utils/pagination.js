const Product = require('../models/Product')

const paginate = (req, res) => {
    let perPage = 9
    let page    = req.params.page

    Product
        .find({})
        .skip(perPage)
        .limit(perPage)
        .populate('category')
        .exec()
        .then(products => products)
        .then(products => {
            Product
                .countDocuments()
                .exec()
                .then(count => {
                    res.render('products/product-main', {
                        products: products,
                        pages: Math.ceil(count / perPage),
                        current: Number(page),
                        nextPage: Number(page),
                        previousPage: Number(page)
                    })
                })
                .catch(err => {
                    let errors = {}
                    errors.status = 500
                    errors.message = err

                    res.status(errors).json(errors)
                })
        })
        .catch(err => {
            let errors = {}
            errors.status = 500
            errors.message = err

            res.status(errors).json(errors)
        })
}

module.exports = paginate