const bcrypt = require('bcryptjs')

module.exports = {
    create: (str) => {
        return new Promise((resolve, reject) => {
            if (str === '') reject('Creating hash from an empty string!')
    
            bcrypt.genSalt(10, (error, salt) => {
                if (error) reject(error)
    
                bcrypt.hash(str, salt, (err, hash) => {
                    if (err) reject(err)
    
                    resolve(hash)
                })
            })
        })
    },
    compare: (str, hash) => bcrypt.compare(str, hash)
    
}