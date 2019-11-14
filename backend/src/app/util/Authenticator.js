const jwt = require('jsonwebtoken');

const { secret, expiresIn } = require('../../config/auth');

const generateToken = (params = {}) => {
    return jwt.sign(params, secret, {
        expiresIn
    });
}

const decode = async (token) => {
    return await jwt.decode(token);
}

module.exports = {
    generateToken,
    decode
}