const router = require('express').Router();

router.post('/auth', function(req, res) {

    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body);
    console.log("username" + username);
    console.log("password" + password);

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

module.exports = router;