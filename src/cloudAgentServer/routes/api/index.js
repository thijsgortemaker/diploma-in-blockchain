const router = require('express').Router();

router.get("/", function(req, rsp){
    console.log("Test is working");
    rsp.end("Test is working. Connected with Cloud Agent server");  
})

/**
 * Log-in function.
 */
router.post("/wallet-log-in", async function(req, rsp) {
    let walletName = req.body.walletName;
    let walletPassword = req.body.walletPassword;
    let walletHandle;

    if(walletName !== '' || walletPassword !== '')
        rsp.send('Expected two parameters.');
    else {

        try {
            walletHandle = await indy.openWallet(walletName, walletPassword);
        } catch(e) {
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
    let walletName = req.body.walletName;
    let walletPassword = req.body.walletPassword;

    if(walletName !== '' || walletPassword !== '')
        rsp.send('Expected two parameters.');
    else {
        try {
            await indy.createWallet(walletName, walletPassword);
        } catch(e) {
            if(e.message == "WalletAlreadyExistsError")
                rsp.send('Wallet exists, please log-in')
            else {
                rsp.send('Wallet failed to create.')
                throw e;
            }
        }
        rsp.status(200).send('Created wallet.')
    }
});

module.exports = router;