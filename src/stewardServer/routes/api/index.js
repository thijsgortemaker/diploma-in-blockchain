const router = require('express').Router();
const ledgerHandler = require('../../src/ledgerHandler');

router.get("/", function(req, rsp){
    console.log("Test is working");
    rsp.end("Test is working. Connected with Steward server");
})

router.post("/makeMeATrustAnchor", async function(req, rsp){
    console.log(req.body);

    if(!req.body.verinymDID || !req.body.verinymverKey){
        rsp.status(404).send(JSON.stringify({err : "You need to give a vernimymdid and verkey"}));
    }else{
        await ledgerHandler.addVerinym(req.body.verinymDID, req.body.verinymverKey);
        rsp.end(JSON.stringify({rsp: "Here is what they think about you"}));    
    }
})

module.exports = router;
