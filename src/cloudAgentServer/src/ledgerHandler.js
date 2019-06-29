const path = require("path");
const indy = require('indy-sdk');
const fs = require('fs');

const POOL_NAME = "CloudAgentPoolConfig";
const WALLET_NAME = {"id": "CloudAgentWallet"};
const WALLET_CRED = {"key": "CloudAgentCred"};

var LedgerHandler = module.exports = {
    walletHandle: undefined,
    poolHandle: undefined,
    dids: {}
}

LedgerHandler.init= async function (){
    await indy.setProtocolVersion(2);

    LedgerHandler.poolHandle = await connectMetPool();
    
    await createWalletForCloudAgent();
}

LedgerHandler.close = async function (){
    //write out the dids
    let data = JSON.stringify(LedgerHandler.dids);  
    try{
        fs.writeFileSync('dids.json', data); 
    }catch(e){
        e.log;
    }

    await indy.closeWallet(LedgerHandler.walletHandle);
    await indy.closePoolLedger(LedgerHandler.poolHandle);
}

async function createWalletForCloudAgent(){
    try{
        //maak de wallet aan
        await indy.createWallet(WALLET_NAME, WALLET_CRED)
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);  
        LedgerHandler.dids = {};

        //genereer de did die al op de ledger staat met een seed
        [LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey] = await indy.createAndStoreMyDid(LedgerHandler.walletHandle, {});
        await makeTrustAnchor(LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey);

    }catch(e){
        console.log("cloud wallet already exists, just opening it");
        //als deze file bestaat dan moet er ook een wallet zijn.
        let rawdata = fs.readFileSync('dids.json');  
        LedgerHandler.dids = JSON.parse(rawdata); 
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);        
    }
}

async function connectMetPool(){
    //vind de geneiss file. In dit project zit het in de code map. Een map hoger dan deze
    const genesisFilePath = path.join(__dirname, '..', 'pool_genesis.txn');
        
    //creeer de poolconfig
    const poolConfig = {'genesis_txn': genesisFilePath}
    
    //probeer een poolLedgerConfig te maken.
    try{           
        await indy.createPoolLedgerConfig(POOL_NAME, poolConfig)
    }catch(e){
        console.log(`pool ledger already exists with name ${POOL_NAME}`);
    }
    
    //connect met de pool zodat je een hadle terug krijgt om er mee te praten
    return await indy.openPoolLedger(POOL_NAME, undefined);
}

async function makeTrustAnchor(didOther, verkeyOther){
    let stewardname = {"id": "testStewardWallet"};
    let stewardKey = {"key": "testStewardCredential"};
    const seed = {'seed': '000000000000000000000000Steward1'};
    let stewardWalletHandle;

    await indy.createWallet(stewardname, stewardKey);
    stewardWalletHandle = await indy.openWallet(stewardname, stewardKey);

    let [didStew, verkeyStew] = await indy.createAndStoreMyDid(stewardWalletHandle, seed);
    
    let nymRequest = await indy.buildNymRequest(didStew, didOther, verkeyOther, null, 'TRUST_ANCHOR');
    await indy.signAndSubmitRequest(LedgerHandler.poolHandle, stewardWalletHandle, didStew, nymRequest);

    await indy.closeWallet(stewardWalletHandle);
    await indy.deleteWallet(stewardname, stewardKey);
}

LedgerHandler.createDid = async function(walletHandleStudent){
    let veriynimDid = LedgerHandler.dids.veriynimDid;
    let veriynimVerkey = LedgerHandler.dids.veriynimVerkey;

    console.log(walletHandleStudent);
    console.log(LedgerHandler.walletHandle);

    let [did,verkey] = await indy.createAndStoreMyDid(walletHandleStudent, {});

    console.log(veriynimDid);
    let nymRequest = await indy.buildNymRequest(veriynimDid, did, verkey, null, null);
    //let signAndSubmitRequest = await indy.signAndSubmitRequest(LedgerHandler.poolHandle, LedgerHandler.walletHandle, veriynimDid, nymRequest);
    return did;
}

LedgerHandler.createOfferReq = async function(credOffer, walletHandleProver, masterSecret, didProver){
    let veriynimDid = LedgerHandler.dids.veriynimDid;

    let getCredDefRequest = await indy.buildGetCredDefRequest(veriynimDid, credOffer.cred_def_id);
    let getCredDefResponse = await indy.submitRequest(LedgerHandler.poolHandle, getCredDefRequest);
    let [diplomaCredDefId, diplomaCredDefGet]  = await indy.parseGetCredDefResponse(getCredDefResponse);
    let [credreq, credReqMeta] = await indy.proverCreateCredentialReq(walletHandleProver, didProver, credOffer, diplomaCredDefGet, masterSecret);

    return [credreq, credReqMeta, diplomaCredDefGet];
}

LedgerHandler.storeCredential = async function(walletHandleProver, dimplomaCred, competenceRequestMeta, diplomaCredDefGet){
    await indy.proverStoreCredential(walletHandleProver, null, competenceRequestMeta, dimplomaCred, diplomaCredDefGet, null);
}

LedgerHandler.getAllCredentials = async function(walletHandleProver){
    return await indy.proverGetCredentials(walletHandleProver, null);
}

LedgerHandler.logOut = async function(walletHandleProver){
    await indy.closeWallet(walletHandleProver);
}