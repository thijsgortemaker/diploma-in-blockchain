const router = require('express').Router();
const databaseHandler = require('../../src/database/databaseHandler')
const jwt = require('jsonwebtoken');
const auth= require('../auth');

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/auth', function(req, res) {
    if(req.body.username && req.body.password){
        databaseHandler.getUser(req.body.username, callBackAuth, req, res);
    }else{
        res.status(400).end(JSON.stringify({err : "bad request"}));
    }
})

async function callBackAuth(results, fields, req , res){
    if(results.length > 0){
        if(bcrypt.compareSync(req.body.password, results[0].password)){
            let jsonwt = jwt.sign({userid : results.username}, auth.secret);

            res.status(202).end(JSON.stringify({rsp : "logged in", token: jsonwt}));
        }else {
            res.status(401).end(JSON.stringify({err : "invalid credentials"}));
        }
    }else{
        res.status(401).end(JSON.stringify({err : "invalid credentials"}));
    }
}

module.exports = router;