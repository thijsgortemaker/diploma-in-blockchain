let jwt = require('express-jwt');
let secret = 'thisNeedsToChange';

router.post('/auth', function(req, res) {

    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    console.log(password);

    // doorzoek database op username match
    let foundUsn;
    let foundPw;

    // decrypt found password
    if(true) {
        res.json(
            {"response" : "success",
                "token" : "token"}
        )
    } else {
        res.status(403);
        res.json({"response" : "unsuccessfull"});
    }
});

function getToken(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
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