const express = require('express')
const router  = express.Router()

const async  = require('async')
const stripe = require('stripe')('sk_test_5zPUKi7gHghPzCEhWfDd5fQl00XivGJYfX')

const cartController = require('./controllers/cartController')

const Cart = require('./models/Cart')

router.get('/', cartController.getUserShoppingCart)

router.post('/product', cartController.addProductToCart)

router.delete('/remove', cartController.removeProduct)

router.post('/payment', (req, res, next) => {
    const stripeToken    = req.body.stripeToken
    const currentCharges = req.body.stripeMoney * 100
      
    stripe.customers
            .create({
                source: stripeToken
            })
            .then(customer => {
                const result = stripe.charges.create({
                    amount: currentCharges,
                    currency: 'usd',
                    customer: customer.id
                })

                return result
            })
            .then(result => {
                async.waterfall([
                    (callback) => {
                        Cart.findOne({
                            owner: req.user._id
                        }, (error, cart) => {
                            callback(error, cart)
                        })
                    },
                    (cart, callback) => {
                        let user = req.user

                        for (let order of cart.items) {
                            user.history.push({
                                item: order.item,
                                paid: order.price
                            })
                        }

                        user.save((error, user) => {
                            if (error) return next(error)

                            callback(null, cart)
                        })
                    },
                    (cart) => {
                        cart.update({
                            $set: {
                                items: [],
                                total: 0
                            }
                        }, (error, updated) => {
                            if (updated) res.render('thankyou')
                        })    
                    }
                ])
            })
            .catch(error => {
                let errors     = {}
                errors.status  = 500
                errors.message = error

                res.status(errors.status).json(errors)
            })
})

module.exports = router
