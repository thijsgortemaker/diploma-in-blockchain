const router = require('express').Router();
const auth = require('../auth');

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


module.exports = router;