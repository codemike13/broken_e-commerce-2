const express = require('express');
const router = express.Router();

const productController = require('./products/controllers/productController')

const paginate = require('./products/utils/pagination')

/* GET home page. */
router.get('/', productController.getPageIfUserLoggedIn);

router.get('/page/:page', paginate)

module.exports = router;
