const express = require('express')
const router  = express.Router()

const productController = require('./controllers/productController')

router.get('/', (req, res) => {
    productController.getAllProducts({})
        .then(products => {
            res.render('products/products', { products: products })
        })
        .catch(err => {
            res.status(err.status).json(err)
        })
})

router.get('/:id', (req, res) => {
    productController.getProductByID(req.params.id)
        .then(product => {
            res.render('products/product', { product: product })
        })
        .catch(err => {
            res.status(err.status).json(err)
        })
})

router.get('/getproductsbycategoryid/:id', (req, res) => {
    productController.getProductsByCategoryID(req.params.id)
        .then(products => {
            res.render('products/products', { products: products })
        })
        .catch(err => {
            res.status(err.status).json(err)
        })
})

module.exports = router