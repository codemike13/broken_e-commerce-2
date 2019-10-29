const categoryValidation = (req, res, next) => {
    req.checkBody('name', 'Category name cannot ne empty').notEmpty()

    const errorValidate = req.validationErrors()

    if (errorValidate) {
        req.flash('errors', errorValidate[0].message)

        res.status(301).redirect('/api/admin/add-category')
    } else {
        next()
    }
}

module.exports = categoryValidation