// Set up router
const router = require('express').Router();

// Packages from npm.
const indy = require('indy-sdk');
const jwt = require('jsonwebtoken');
const request = require('request');

// Packages from own utils.
const userMap = require('../../src/userMap');
const ledgerHandler = require('../../src/ledgerHandler');

// So secret.
const JWT_SECRET = "superSECRET";

/**
 * @swagger
 * /wallet-log-in:
 *  post:
 *      tags:
 *          - Users
 *      name: Log-in
 *      summary: Logs a user into their wallet, if it exists.
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *                  format: password
 *            required:
 *              - username
 *              - password
 *      responses:
 *          200:
 *              description: User found and logged in succesfully
 *          401:
 *              description: One or two parameters were left empty
 *          500:
 *              description: Either wrong credentials or internal indy error
 */
router.post("/wallet-log-in", async function(req, rsp) {
    let walletName = req.body.username;
    let walletPassword = req.body.password;
    let WALLET_NAME = {"id": walletName};
    let WALLET_CRED = {"key": walletPassword};
    let token; 

    // Check if both paramters are found.
    if(walletName == '' || walletPassword == '')
        rsp.status(401).json({err:'Expected two parameters.'});
    else {
        try {
            // Trying to open the wallet and saving the walletHandle.
            let walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);

            token = jwt.sign({
                wallethandle: walletHandle,
                name: walletName
            }, JWT_SECRET);

            // Save the walletHandle in hashMap for later use
            userMap.map.get(walletName).walletHandle = walletHandle;
        } catch (e) {
            // Caught and throwin the error.
            rsp.status(500).json({err:'An error with indy occured',
                        stack:e});
            throw e;
        }
        rsp.status(200).json({success:'logged in',
                                token:token});
    }
});


 /**
 * @swagger
 * /wallet-register:
 *  post:
 *      tags:
 *          - Users
 *      name: Register
 *      summary: Registers a wallet for a user.
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *                  format: password
 *            required:
 *              - username
 *              - password
 *      responses:
 *          201:
 *              description: Wallet created succesfully
 *          401:
 *              description: One or two parameters were left empty
 *          400:
 *              description: Either wallet exists or internal indy error
 */
router.post("/wallet-register", async function(req, rsp) {
    let walletName = req.body.username;
    let walletPassword = req.body.password;
    let WALLET_NAME = {"id": walletName};
    let WALLET_CRED = {"key": walletPassword};
    
    // Checking if both parameters are found.
    if(walletName == '' || walletPassword == '') {
        rsp.status(401).json({err:'Expected two parameters.'});
    } else {
        try {
            // Attempting to create a new wallet.
            await indy.createWallet(WALLET_NAME, WALLET_CRED);

            // Immediatly opening the wallet so the user doesnt have to log-in.
            let walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);

            let token = jwt.sign({
                wallethandle: walletHandle,
                name: walletName
            }, JWT_SECRET);
            
            // Creating a master secret.
            let masterSecret = await indy.proverCreateMasterSecret(walletHandle, null);
            
            // Mapping the data to an object.
            let userObject = {secret: masterSecret,
                                walletName: walletName,
                                walletHandle: walletHandle,
                                incomingOffers: []};
            
            // Saving the data in the HashMap
            userMap.map.set(walletName, userObject);
            rsp.status(201).json({success:'Created wallet.',
                                    token:token})
        } catch (e) {
            if (e.message == "WalletAlreadyExistsError") {
                // Wallet already exists so user should log-in
                rsp.status(400).json({err:'Wallet already exists. User should log-in instead.'})
                throw e;
            } else {
                // Internal indy error, throwing the stack.
                rsp.status(400).json({err:'Wallet failed to create due to and indy error, stack below.',
                            stack:e})
                throw e;
            }
        }
    }
});

 /**
 * @swagger
 * /sendreq:
 *  post:
 *      tags:
 *          - Requests
 *      name: Send connection request.
 *      summary: Sends a connection request to another user.
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                studentnummer:
 *                  type: int
 *            required:
 *              - name
 *              - studentnummer
 *      responses:
 *          200:
 *              description: Request was made and sent successfully
 *          400:
 *              description: Parameters were left empty or internal indy error
 */
router.post("/sendreq", async function (req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let walletName = decoded.name;
    let walletHandle = userMap.map.get(walletName).walletHandle;
    
    let did;

    // Attempting to get the users DID.
    if(userMap.map.get(walletName).did){
        did = userMap.map.get(walletName).did;
    }else{
        did = await ledgerHandler.createDid(walletHandle);
        userMap.map.get(walletName).did = did;
    }

    let body = req.body;

    // Check if we found a number.
    if(!isNaN(body.studentNummer) && body.naam){
        let body = req.body;
        // Creating the request to the saxion server.
        request.post({
           headers: {'content-type' : 'application/json"'},
           url:     'http://127.0.0.1:3000/api/connectieRequest',
           form:    {naam: body.naam, studentnummer: body.studentNummer, did: did, walletNaam: walletName}
       }, async function (err, res) {
           // Throwing error, if there is one.
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

/**
 * @swagger
 * /studentCredOffer:
 *  post:
 *      tags:
 *          - Requests
 *      name: Send cred offer request.
 *      summary: Sends a credential offer.
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                vak:
 *                  type: string
 *                username:
 *                  type: string
 *                competenceOffer:
 *                  type: string
 *            required:
 *              - vak
 *              - username
 *              - competenceOffer
 *      responses:
 *          200:
 *              description: Request was made and sent successfully
 *          400:
 *              description: Wrong amount of parameters
 */
router.post('/studentCredOffer', async function(req, rsp) {
    let vak = req.body.vak;
    let userName = req.body.username;
    let competenceOffer = req.body.competenceOffer;

    // Check if all parameters are here.
    if(req.body.vak && req.body.username && req.body.competenceOffer) {

        let offer = {
            vak: vak,
            competenceOffer: competenceOffer,
            idComp : req.body.idComp
        }

        // Adding the offer to the users offer list.
        userMap.map.get(userName).incomingOffers.push(offer);
        rsp.status(200).json({success:'cred offer received'});
    } else {
        rsp.status(400).json({err:'Expected three parameters'})
    }

});

/**
 * @swagger
 * /credentials:
 *  get:
 *      tags:
 *          - Credentials
 *      name: Get credentials.
 *      summary: Returns all the credentials for the user.
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Succesfully returned all credentials of user.
 *          500:
 *              description: Internal indy error.
 */
router.get('/credentials', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;
    let data;
    try {
        // Getting all the users credentials through the ledgerHandler.
        data = await ledgerHandler.getAllCredentials(userMap.map.get(userName).walletHandle);
    } catch(e) {
        rsp.status(500).json({err:'Something went wrong with Indy',
                                stack:e})
        throw e;
    }

    rsp.status(200).json({success: data});
});

/**
 * @swagger
 * /logOut:
 *  post:
 *      tags:
 *          - Users
 *      name: Log out.
 *      summary: Logs a user out of their wallet.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Succesfully logged out and closed wallet.
 *          500:
 *              description: Internal indy error.
 */
router.post('/logOut', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;

    try {
        // Logging the user out through the ledgerHandler, closing their wallet.
        await ledgerHandler.logOut(userMap.map.get(userName).walletHandle);
    } catch(e) {
        // Something went wrong with indy internally, throwing the stack.
        rsp.status(500).json({err:'no',
                                stack:e});
        throw e;
    }

    rsp.status(200).json({success: "yes"});
});


/**
 * @swagger
 * /get-all-offers:
 *  get:
 *      tags:
 *          - Credentials
 *      name: Get offers.
 *      summary: Returns all the pending offers for a user. If there are none, returns an empty list.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Succesfully returned all credentials of user.
 */
router.get('/get-all-offers', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;
    
    let offers = userMap.map.get(userName).incomingOffers;
    let returnOffers = offers.map((offer, index) => ({vak : offer.vak, competenceOffer: offer.competenceOffer, id:index}));

    rsp.status(200).json({success:returnOffers});
})

/**
 * @swagger
 * /accept-cred-offer:
 *  post:
 *      tags:
 *          - Credentials
 *      name: Accept offer.
 *      summary: Accept a credential offer and adds them to the users credentials.
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
*      parameters:
 *          - name: body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *            required:
 *              - id
 *      responses:
 *          200:
 *              description: Succesfully accepted credential offer.
 *          400:
 *              description: Either an indy error or wrong params.
 */
router.post('/accept-cred-offer', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;
    
    let user =  userMap.map.get(userName);
    let offer =  user.incomingOffers[req.body.id];

    // Creating a cred offer through the ledgerhandler.
    let [credreq, credReqMeta, diplomaCredDef] = await ledgerHandler.createOfferReq(JSON.parse(offer.competenceOffer), user.walletHandle, user.secret, user.did);

    let credReqstring = JSON.stringify(credreq);

    // Making the request for the cred offer to the Saxion server
    request.post({
        headers: {'content-type' : 'application/json"'},
        url:     'http://127.0.0.1:3000/api/competentieRequest',
        form:    {competentieRequest: credReqstring, competentieOfferNR: offer.idComp}
    }, async function (err, res) {
        if (err){ 
            rsp.status(400).end(JSON.stringify({err: "Something went front"}))
        }else{
            // Succesfully made the request
            let diplomaCred = JSON.parse(res.body).rsp;
            // Storing the users newly accepted credential.
            await ledgerHandler.storeCredential(user.walletHandle, diplomaCred, credReqMeta, diplomaCredDef);
            let offer = user.incomingOffers.splice(req.body.id, 1)[0];
            rsp.status(200).end(JSON.stringify({rsp: "request made"}))
        }
    })
})

module.exports = router;