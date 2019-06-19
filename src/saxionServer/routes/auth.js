let secret = 'YMIePg4y6xE0MGjQV8KxgzpyUaXd3jLP4YsW8LiriAAnTl4G12iLlkVO0wAH';

function getToken(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

// This function might need to change in time too.
var auth = {
      secret: secret
    }
  
module.exports = auth;