const router = require('express').Router();
const indy = require('indy-sdk');
const userMap = require('../../src/userMap');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "superSECRET";
const request = require('request');
const ledgerHandler = require('../../src/ledgerHandler');

// let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
// clientId = decoded.clientId;

// let token = jwt.sign({clientId: req.clientId}, JWT_SECRET);
// rsp.json({token: token});

router.get("/", function (req, rsp) {
    console.log("Test is working");
    rsp.end("Test is working. Connected with Cloud Agent server");
})

/**
 * Log-in function.
 */
router.post("/wallet-log-in", async function(req, rsp) {
    let walletName = req.body.username;
    let walletPassword = req.body.password;
    let WALLET_NAME = {"id": walletName};
    let WALLET_CRED = {"key": walletPassword};
    let token; 

    if(walletName == '' || walletPassword == '')
        rsp.status(401).json({err:'Expected two parameters.'});
    else {
        try {
            let walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);

            token = jwt.sign({
                wallethandle: walletHandle,
                name: walletName
            }, JWT_SECRET);

            userMap.map.get(walletName).walletHandle = walletHandle;
        } catch (e) {
            rsp.status(500).json({err:'An error with indy occured',
                        stack:e});
            throw e;
        }
        rsp.status(200).json({success:'logged in',
                                token:token});
    }
});


 /**
  * Register function.
  */
router.post("/wallet-register", async function(req, rsp) {
    let walletName = req.body.username;
    let walletPassword = req.body.password;
    let WALLET_NAME = {"id": walletName};
    let WALLET_CRED = {"key": walletPassword};
    

    if(walletName == '' || walletPassword == '') {
        rsp.status(401).json({err:'Expected two parameters.'});
    } else {
        try {
           await indy.createWallet(WALLET_NAME, WALLET_CRED);
            let walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);

            let token = jwt.sign({
                wallethandle: walletHandle,
                name: walletName
            }, JWT_SECRET);
            
            let masterSecret = await indy.proverCreateMasterSecret(walletHandle, null);
            
            let userObject = {secret: masterSecret,
                                walletName: walletName,
                                walletHandle: walletHandle,
                                incomingOffers: []};
            
            userMap.map.set(walletName, userObject);
            rsp.status(201).json({success:'Created wallet.',
                                    token:token})
        } catch (e) {
            if (e.message == "WalletAlreadyExistsError") {
                rsp.status(400).json({err:'Wallet already exists. User should log-in instead.'})
                throw e;
            } else {
                rsp.status(400).json({err:'Wallet failed to create due to and indy error, stack below.',
                            stack:e})
                throw e;
            }
        }
    }
});

router.post("/sendreq", async function (req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    //todo get values from req
    let walletName = decoded.name;
    let walletHandle = userMap.map.get(walletName).walletHandle;
    
    let did;

    if(userMap.map.get(walletName).did){
        did = userMap.map.get(walletName).did;
    }else{
        did = await ledgerHandler.createDid(walletHandle);
        userMap.map.get(walletName).did = did;
    }

    let body = req.body;

    if(!isNaN(body.studentNummer) && body.naam){
        let body = req.body;

        //todo Stuur hier nog een http request
       request.post({
           headers: {'content-type' : 'application/json"'},
           url:     'http://127.0.0.1:3000/api/connectieRequest',
           form:    {naam: body.naam, studentnummer: body.studentNummer, did: did, walletNaam: walletName}
       }, async function (err, res) {
           if (err){ 
               rsp.status(400).end(JSON.stringify({err: "Something went front"}))
           }else{
               rsp.status(200).end(JSON.stringify({rsp: "request made"}))
           }
       })
    }else{
        rsp.status(400).end(JSON.stringify({err: "Something went front"}));
    }

});

// TODO ERROR HANDLING
router.post('/studentCredOffer', async function(req, rsp) {
    let vak = req.body.vak;
    let userName = req.body.username;
    let competenceOffer = req.body.competenceOffer;

    let offer = {
        vak: vak,
        competenceOffer: competenceOffer,
        idComp : req.body.idComp
    }

    userMap.map.get(userName).incomingOffers.push(offer);
    rsp.status(200).json({success:'cred offer received'});
});

// TODO ERROR HANDLING
router.get('/credentials', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;

    let data = await ledgerHandler.getAllCredentials(userMap.map.get(userName).walletHandle);

    rsp.status(200).json({success: data});
});

router.post('/logOut', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;

    await ledgerHandler.logOut(userMap.map.get(userName).walletHandle);

    rsp.status(200).json({success: "yes"});
});


// TODO ERROR HANDLING
router.get('/get-all-offers', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;
    
    let offers = userMap.map.get(userName).incomingOffers;
    let returnOffers = offers.map((offer, index) => ({vak : offer.vak, competenceOffer: offer.competenceOffer, id:index}));

    rsp.status(200).json({success:returnOffers});
})

router.post('/accept-cred-offer', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;
    
    let user =  userMap.map.get(userName);
    let offer =  user.incomingOffers[req.body.id];


    let [credreq, credReqMeta, diplomaCredDef] = await ledgerHandler.createOfferReq(JSON.parse(offer.competenceOffer), user.walletHandle, user.secret, user.did);

    let credReqstring = JSON.stringify(credreq);

    request.post({
        headers: {'content-type' : 'application/json"'},
        url:     'http://127.0.0.1:3000/api/competentieRequest',
        form:    {competentieRequest: credReqstring, competentieOfferNR: offer.idComp}
    }, async function (err, res) {
        if (err){ 
            rsp.status(400).end(JSON.stringify({err: "Something went front"}))
        }else{
            let diplomaCred = JSON.parse(res.body).rsp;

            await ledgerHandler.storeCredential(user.walletHandle, diplomaCred, credReqMeta, diplomaCredDef);
            let offer = user.incomingOffers.splice(req.body.id, 1)[0];
            rsp.status(200).end(JSON.stringify({rsp: "request made"}))
        }
    })
})

module.exports = router;