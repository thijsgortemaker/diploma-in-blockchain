let jwt = require('express-jwt');
let secret = 'thisNeedsToChange';

function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

// This function might need to change in time too.
var auth = {
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getToken
    })
};

module.exports = auth;