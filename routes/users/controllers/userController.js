const User     = require('../models/User')
const bcrypt   = require('bcryptjs')
const hasher   = require('../utils/hasher')
const gravatar = require('../utils/gravatar')

module.exports = {
    signup: (req, res, next) => {
        if (req.validationErrors()) {
            res.render('auth/signup')

            return
        }

        User.findOne({ email: req.body.email })
            .then( user => {
                if (user) {
                    req.flash('errors', 'User already exists')

                    // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                    return res.redirect(301, '/api/users/signup')
                } else {
                    const newUser = new User
                    
                    newUser.email        = req.body.email
                    newUser.profile.name = req.body.name
                    newUser.profile.picture = gravatar(newUser.email)
                    
                    hasher.create(req.body.password)
                            .then( hash => {
                                newUser.password = hash

                                newUser
                                    .save()
                                    .then(user => {
                                        req.login(user, (err) => {
                                            if (err) {
                                                res.status(400).json({
                                                    confirmation: false,
                                                    message: err
                                                })
                                            } else {
                                                next()
                                            }
                                        })
                                    })
                                    .catch(err => {
                                        throw err
                                    })
                            })
                            .catch( err => {
                                throw err
                            })
                }
            } )
            .catch(err => {
                throw err
            })
    },
    // We do not use it. Instead we use passport.authenticate().
    signin: (params) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: params.email })
                .then(user => {
                    if (user) {
                        bcrypt.compare(params.password, user.password)
                                .then(result => {
                                    if (!result) {
                                        let errors     = {}
                                        errors.message = 'Password or email does not match'
                                        errors.status  = 400

                                        reject(errors)
                                    } else {
                                        resolve(user)
                                    }
                                })
                                .catch(err => reject(err))

                    } else {
                        let errors     = {}
                        errors.message = 'There is no such user'
                        errors.status  = 400

                        reject(errors)
                    }
                })
                .catch(err => reject(err))
        })
    },
    updateProfile: (params, id) => {
        return new Promise((resolve, reject) => {
            User.findById(id)
                .then( user => { 
                    if (params.password    != '' ||
                        params.password_2  != '' ||
                        params.oldPassword != '') {

                        if (params.password != params.password_2) reject('New Passwords do not match!')

                        hasher.compare(params.oldPassword, user.password)
                                .then(result => {
                                    if (!result) reject('Old password is not correct!')

                                    hasher.create(params.password)
                                            .then(hash => {
                                                user.password = hash

                                                if (params.name    != '') user.profile.name = params.name 
                                                if (params.address != '') user.address      = params.address 
                                                if (params.email   != '') user.email        = params.email 
                                                
                                                user.save()
                                                    .then(user => {
                                                        resolve(user)
                                                    })
                                                    .catch(err => {
                                                        reject(err)
                                                    })
                                            })
                                            .catch(err => {
                                                reject(err)
                                            })
                                })
                                .catch(err => {
                                    reject(err)
                                })
                    } else {
                        if (params.name    != '') user.profile.name = params.name 
                        if (params.address != '') user.address      = params.address 
                        if (params.email   != '') user.email        = params.email 

                        user.save()
                            .then(user => {
                                resolve(user)
                            })
                            .catch(err => {
                                reject(err)
                            })
                    }
                })
        })
    }
}