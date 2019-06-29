const router = require('express').Router();
const auth = require('../auth');
const databaseHandler = require('../../src/database/databaseHandler');
const ledgerHandler = require('../../src/ledger/ledgerHandler');
const jwt = require('jsonwebtoken');
const request = require('request');

router.use('/user', require('./users'))

router.post('/connectieRequest', function(req, res) {
    let body = req.body;

    if(body.naam && body.studentnummer && body.did && body.walletNaam){
        if(isNaN(body.studentnummer)){
            res.status(400).json({err : "studentnummer needs to be a number"});
        }else{
            databaseHandler.voegConnectieRequestToe(body.naam, body.studentnummer, body.did, body.walletNaam ,connectieRequestCallback, req, res);
        }
    }else{
        res.status(400).json({err : "Expected four parameters."});
    }
})

router.post('/competentieRequest', function(req, res) {
    let body = req.body;

    if(body.competentieRequest, body.competentieOfferNR){
        databaseHandler.haalCompetentieOp(body.competentieOfferNR, competentieRequestOfferCallback, req, res);
    }else{
        res.status(400).json({err : "Expected two parameters"});
    }
})

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

router.get('/vak', function(req, res) {
    databaseHandler.getVakken(vakkenGetCallBack, req, res);
})

router.get('/student', function(req, res) {
    databaseHandler.getStudenten(studentGetCallBack, req, res);
})

router.get('/connectieRequest', function(req, res) {
    databaseHandler.getConnectieRequest(connectieRequestGetCallBack, req , res);
})

router.post('/accepteerConnectionRequest', function(req, res) {
    if(req.body.id){
        ledgerHandler.generateKeys(req.body.id, connectieRequestAccepteerCallBack , req , res);
    }else{
        res.status(404).end(JSON.stringify({err : "you need to give an id"}));
    }
})

router.post('/competentie', function(req, res) {
    if(req.body.student && req.body.vak && req.body.cijfer){
        if(isNaN(req.body.cijfer)){
            res.status(400).end(JSON.stringify({err : "cijfer needs to be a number"}));
        }else{
            ledgerHandler.makeCredOffer(voegCompetentieToeCallBack ,req, res);
        }
    }else{
        res.status(404).end(JSON.stringify({err : "you need to give an id"}));
    }
    
})

async function voegCompetentieToeCallBack(req ,res, credOffer){
    databaseHandler.voegCompetentieToe(req.body.student, req.body.vak, req.body.cijfer, JSON.stringify(credOffer),voegCompetentieToeCallBackNaDb, req , res);
}

async function voegCompetentieToeCallBackNaDb(req ,rsp, credOffer,student,vak ,competentie,err){
    if(err){
        rsp.status(404).end(JSON.stringify({err : "something went wrong but what"}));
    }else{
        //todo Stuur hier nog een http request
        request.post({
            headers: {'content-type' : 'application/json"'},
            url:     'http://127.0.0.1:3001/api/studentCredOffer',
            form:    {username: student.verinym, competenceOffer: credOffer, vak: vak.vaknaam, cijfer: vak, idComp: competentie.idCompetentie}
          }, async function (err, res) {
            if (err){ 
                rsp.status(400).end(JSON.stringify({err: "Something went front"}))
            }else{
                rsp.status(200).end(JSON.stringify({rsp: "request made"}))
            } 
        })
    }
}

async function vakkenPostCallBack(req ,res, err){
    if(err){
        res.status(404).end(JSON.stringify({err : "something went wrong but what"}));
    }else{
        res.status(200).end(JSON.stringify({rsp : "nieuw vak aangemaakt"}));
    }
}

async function connectieRequestCallback(req ,res, err){
    if(err){
        res.status(404).end(JSON.stringify({err : "something went wrong but what"}));
    }else{
        res.status(200).end(JSON.stringify({rsp : "nieuw connectie request aangemaakt"}));
    }
}

async function vakkenGetCallBack(results, err, req , res){
    if(err){
        res.status(405).end(JSON.stringify({err : "error"}));
    }else{
        res.status(200).end(JSON.stringify({results: results}));
    }
}

async function studentGetCallBack(results, err, req , res){
    if(err){
        res.status(405).end(JSON.stringify({err : "error"}));
    }else{
        res.status(200).end(JSON.stringify({results: results}));
    }
}


async function connectieRequestGetCallBack(results, err, req , res){
    if(err){
        res.status(405).end(JSON.stringify({err : "error"}));
    }else{
        res.status(200).end(JSON.stringify({results: results}));
    }
}

async function connectieRequestAccepteerCallBack(idConnectieRequest, did, req, res){
    databaseHandler.acceptConnectionRequest(idConnectieRequest, did ,connectieRequestAccepteerCallBackAfterDB, req , res);
}

async function connectieRequestAccepteerCallBackAfterDB(results, error, req, res){
    if(error){
        res.status(405).end(JSON.stringify({err : "error"}));
    }else{
        res.status(200).end(JSON.stringify({rsp : "nieuw connectie reuquest geaccepteert"}));
    }
}

async function competentieRequestOfferCallback(req, res, competentie, student, vak,error){  
    ledgerHandler.maakCompetentieAan(
        student.naamstudent, 
        student.studentnummer, 
        vak.vaknaam, 
        competentie.cijfer, 
        vak.ecs, 
        competentie.competentieOffer ,
        req.body.competentieRequest, competentieRequestOfferCallbackAfterLedger, req, res);
}

async function competentieRequestOfferCallbackAfterLedger(diplomaCred, req, res){
    res.status(200).json({rsp:diplomaCred});

    //voeg het nog toe aan de database
    databaseHandler.voegDiplomaCredToe(req.body.competentieOfferNR, diplomaCred);
}

module.exports = router;