const router = require('express').Router();
const auth = require('../auth');
const databaseHandler = require('../../src/database/databaseHandler');
const jwt = require('jsonwebtoken');

router.use('/user', require('./users'))

//check hier of de gebruiker een token heeft voor de calls naar de api
router.use(function(req,rsp,next){
    let userToken = req.headers.authorization;
   
     //wanneer deze eentje heeft doe en deze is goed doe deze dan in de request
     //anders stuur een error status terug
     if(userToken){
       jwt.verify(userToken, auth.secret, function(err, decoded) {
         if(err){
           rsp.status(401).send();
         }else{
           next();
         }       
     });
     }else{
       rsp.status(401).send();
     }
 });

router.post('/vak', function(req, res) {
    let body = req.body;
    
    if(body.naam && body.omschrijving && body.ecs){
        if(isNaN(body.ecs)){
            res.status(400).end(JSON.stringify({err : "ecs needs to be a number"}));
        }else{
            databaseHandler.voegVakToe(body.naam, body.omschrijving, body.ecs, vakkenPostCallBack, req, res);
        }

    }else{
        res.status(400).end(JSON.stringify({err : "bad request"}));
    }
})

async function vakkenPostCallBack(req ,res, err){
    if(err){
        res.status(404).end(JSON.stringify({err : "something went wrong but what"}));
    }else{
        res.status(200).end(JSON.stringify({rsp : "nieuw vak aangemaakt"}));
    }
}

module.exports = router;