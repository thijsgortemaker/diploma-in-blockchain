const router = require('express').Router();
const indy = require('indy-sdk');

router.get("/", function(req, rsp){
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
            walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);
        } catch(e) {

           // TODO: Proper error handling
           rsp.status(401).json({err:'Failed to log-in'});
           throw e;
        }
        rsp.status(200).json({success:'Success'});    
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
        } catch(e) {
            if(e.message == "WalletAlreadyExistsError")
                rsp.status(401).json({err:'Wallet exists, please log-in'});
            else {
                rsp.status(401).json({err:'Wallet failed to create'});
                throw e;
            }
        }
        rsp.status(200).json({success:'Success'});    
    }
});

module.exports = router;