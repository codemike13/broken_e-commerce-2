const crypto = require('crypto')

const getGravatar = (email) => {
    let defaultSize = 200

    if (!email) return `https://gravatar.com/avatar/?s=${ defaultSize }&d=retro`

    let md5 = crypto.createHash('md5').update(email).digest('hex')

    return `https://gravatar.com/avatar/${ md5 }/?s=${ defaultSize }&d=retro`
}

module.exports = getGravatar