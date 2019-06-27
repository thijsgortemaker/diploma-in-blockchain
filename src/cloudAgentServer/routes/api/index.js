const router = require('express').Router();
const indy = require('indy-sdk');
const userMap = require('../../src/userMap');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "superSECRET";


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
            let [Did, Verkey] = await getmydid(walletHandle);
            token = jwt.sign({
                wallethandle: walletHandle,
                did: Did,
                verkey: Verkey,
                name: walletName
            }, JWT_SECRET);
            for (var key of userMap.map.keys()) {
                console.log(key);
              }
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
            let [Did, Verkey] = await indy.createAndStoreMyDid(walletHandle, {})
            await indy.setDidMetadata(walletHandle, Did, "mydid");
            let token = jwt.sign({
                wallethandle: walletHandle,
                did: Did,
                verkey: Verkey,
                name: walletName
            }, JWT_SECRET);
            let masterSecret = await indy.proverCreateMasterSecret(walletHandle, null);
            let userObject = {secret: masterSecret,
                                walletName: walletName,
                                walletHandle: walletHandle,
                                incomingOffers: []};
            
            userMap.map.set(walletName, userObject);
            await indy.closeWallet(walletHandle);
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

// TODO ERROR HANDLING
router.post('get-all-offers', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;
    let offerList = userMap.getmap().get(userName).incomingOffers;
    rsp.send(200).json({success:offerList});
})

// TODO ERROR HANDLING
router.post('receive-cred-offer', async function(req, rsp) {
    let vak = req.body.vak;
    let userName = req.body.username;
    let competenceOffer = req.body.competenceOffer;
    let grade = req.body.grade;

    let offer = {
        vak: vak,
        grade: grade,
        competenceOffer: competenceOffer
    }

    userMap.getmap().get(userName).incomingOffers.push(offer);
    rsp.status(200).json({success:'cred offer received'});
});

router.post('accept-cred-offer', async function(req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    let userName = decoded.name;
    
    let poolHandle; // heb ik nodig ?
    let did; // ???
    let schemaId; // ??

    let getCredDefRequest = await indy.buildGetCredDefRequest(did, schemaId);
    let getCredDefResponse = await indy.submitRequest(poolHandle, getCredDefRequest);
    let credDef = await indy.parseGetCredDefResponse(getCredDefResponse);
    await indy.proverStoreCredential(walletHandleProver, null, competenceRequestMeta, dimplomaCred, diplomaCredDefGet, null);

})


router.post("/sendreq", async function (req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    //todo get values from req
    let myname = decoded.name;
    let conectionname = "debug"
    let studentid = 123;

    if (false) {
        //param check
    } else {
        try {
            //try indy shit
            const [from_to_did, from_to_key] = await indy.createAndStoreMyDid(decoded.wallethandle, {});
            console.log("generate new key pair")
            //   const nymRequest = await indy.buildNymRequest(//cloudaget, from_to_did, from_to_key, null, null);
            console.log()
            await indy.storeTheirDid(decoded.walletHandle, {"did": from_to_did, "verkey": from_to_key})
            await indy.setDidMetadata(decoded.walletHandle, from_to_did, "to" + conectionname);
            //todo send req
            //send
                // pool handle
            //poll handel?? or send req to vernim to send
            //await indy.signAndSubmitRequest(poolHandle, walletHandle, Did, nymRequest);
            //  log("send conection req")


            //send over internet how to send
            const connection_request = {
                'did': from_to_did,
                'studentid': studentid,
                'name': decoded.name
            };
            // request.post({
             //     headers: {'content-type' : 'application/json"'},
            //     url:     'http://127.0.0.1:3000/api/connectieRequest',
            //     form:    {verinymDID: ledgerHandler.dids.veriynimDid , verinymverKey: ledgerHandler.dids.veriynimVerkey}
            //   }, async function (err, res) {
            //    if (err) return console.error(err.message);

            // })
            //todo return connection req


        } catch (e) {
            rsp.send('error' + e)
        }
        rsp.status(200).send('send response')
    }
});

router.get("/alldid", async function (req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    try {
        rsp.send(await indy.listMyDidsWithMeta(decoded.wallethandle));
    } catch (e) {
        rsp.send('error' + e)
    }
    rsp.status(200).send('send response')

});

router.get("/increq", async function (req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);

    if (false) {
        //param check
    } else {
        try {
            //try indy shit
        } catch (e) {
            rsp.send('error' + e)
        }
        rsp.status(200).send('send response')
    }
});

router.get("/diploma", async function (req, rsp) {
    let decoded = jwt.verify(req.headers.authorization, JWT_SECRET);


    if (false) {
        //param check
    } else {
        try {
            //try indy shit
        } catch (e) {
            rsp.send('error' + e)
        }
        rsp.status(200).send('send response')
    }
});

async function getmydid(wh) {
    let all = await indy.listMyDidsWithMeta(wh);
    let did = null;
    let verkey = null;
    for (i in all) {
        values = all[i];
        if (values.metadata == "mydid") {
            did = values.did;
            verkey = values.verkey;
        }
    }
    return [did, verkey];
}

async function findByMeta(wh, meta) {
    let all = await indy.listMyDidsWithMeta(wh);
    let did = null;
    let verkey = null;
    for (i in all) {
        values = all[i];
        if (values.metadata == meta) {
            log("succes")
            did = values.did;
            verkey = values.verkey;
        }
    }
    return [did, verkey];
}

module.exports = router;