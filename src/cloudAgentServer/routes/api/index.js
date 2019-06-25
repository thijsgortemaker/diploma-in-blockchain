const router = require('express').Router();
const indy = require('indy-sdk');

//expexted token values wallethandle, did ,verkey , name
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

    if(walletName == '' || walletPassword == '')
        rsp.status(401).json({err:'Expected two parameters.'});
    else {
        try {
            let walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);
            let [Did, Verkey] = await getmydid(walletHandle);
            let token = jwt.sign({
                wallethandle: walletHandle,
                did: Did,
                verkey: Verkey,
                name: walletName
            }, JWT_SECRET);
            rsp.json({token: token});
            rsp.status(200).send('Success');
        } catch (e) {
            // TODO: Proper error handling
            rsp.send('Failed to log-in');
            return;
        }
        rsp.status(200).send('Success');
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
            //todo save global did and name
            let token = jwt.sign({
                wallethandle: walletHandle,
                did: Did,
                verkey: Verkey,
                name: walletName
            }, JWT_SECRET);
            rsp.json({token: token});
        } catch (e) {
            if (e.message == "WalletAlreadyExistsError")
                rsp.send('Wallet exists, please log-in')
            else {
                rsp.send('Wallet failed to create.')
                throw e;
            }
        }
        rsp.status(200).send('Created wallet.')
    }
});


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
            //     if (err) return console.error(err.message);

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
            log("succes")
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