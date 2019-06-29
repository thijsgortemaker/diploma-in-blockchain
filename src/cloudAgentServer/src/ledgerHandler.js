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

/**
 * Init de ledgerhandler door te verbinden met de pool en een wallet aan te maken
 * Zoekt een pool_genesis file in de project directory genaamd pool_genesis.txn
 */
LedgerHandler.init= async function (){
    //Als dit er niet staat werkt het niet
    await indy.setProtocolVersion(2);

    LedgerHandler.poolHandle = await connectMetPool();
    
    await createWalletForCloudAgent();
}

/**
 * Sluit de verbingding met de pool ledger en sluit de wallet
 */
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

/**
 * Maakt en intieert de wallet voor de Cloud agent
 * maakt een nieuwe als deze nog niet bestaat anders opent het een oude.
 */
async function createWalletForCloudAgent(){
    try{
        //maak de wallet aan
        await indy.createWallet(WALLET_NAME, WALLET_CRED)
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);  
        LedgerHandler.dids = {};

        //genereer een did. Deze wordt een trust anchor did gemaakt hierna kan deze did ook dingen naar de ledger schrijven
        [LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey] = await indy.createAndStoreMyDid(LedgerHandler.walletHandle, {});
        await makeTrustAnchor(LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey);

    }catch(e){
        console.log("cloud wallet already exists, just opening it");
        //als deze wallet bestaat dan moet er ook een file zijn.
        let rawdata = fs.readFileSync('dids.json');  
        LedgerHandler.dids = JSON.parse(rawdata); 
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);        
    }
}

/**
 * Connect met de pool 
 */
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

/**
 * Maakt een steward wallet aan. Deze wallet heeft een did gegenereerd met een seed.
 * In de echt wereld is de steward een andere entiteit. Omdat dit een lokaal netwerk is kan de steward
 * did gegenereerd worden. Hiermee kan elke did makkelijk een trust anchor did gemaakt worden.
 * Een trust anchor kan dingen schrijven naar de ledger wat andere dids niet kunnen.
 * @param {*} didOther die een Trust anchor gemaakt moet worden
 * @param {*} verkeyOther  die een Trust anchor gemaakt moet worden
 */
async function makeTrustAnchor(didOther, verkeyOther){
    let stewardname = {"id": "testStewardWallet"};
    let stewardKey = {"key": "testStewardCredential"};
    const seed = {'seed': '000000000000000000000000Steward1'};
    let stewardWalletHandle;

    //maak de wallet aan
    await indy.createWallet(stewardname, stewardKey);
    stewardWalletHandle = await indy.openWallet(stewardname, stewardKey);

    //genereer een did met een seed
    let [didStew, verkeyStew] = await indy.createAndStoreMyDid(stewardWalletHandle, seed);
    
    //stuur de did oher and verkey other naar de ledger met de trust anchor stemperl
    let nymRequest = await indy.buildNymRequest(didStew, didOther, verkeyOther, null, 'TRUST_ANCHOR');
    await indy.signAndSubmitRequest(LedgerHandler.poolHandle, stewardWalletHandle, didStew, nymRequest);

    await indy.closeWallet(stewardWalletHandle);
    await indy.deleteWallet(stewardname, stewardKey);
}

/**
 * Maakt een did aan voor de meegegeven Wallethandle.
 * Deze did wordt ook meteen weggeschreven naar de ledger
 */
LedgerHandler.createDid = async function(walletHandleStudent){
    let veriynimDid = LedgerHandler.dids.veriynimDid;
    let veriynimVerkey = LedgerHandler.dids.veriynimVerkey;
    
    //genereer did
    let [did,verkey] = await indy.createAndStoreMyDid(walletHandleStudent, {});

    let nymRequest = await indy.buildNymRequest(veriynimDid, did, verkey, null, null);
    let signAndSubmitRequest = await indy.signAndSubmitRequest(LedgerHandler.poolHandle, LedgerHandler.walletHandle, veriynimDid, nymRequest);
    return did;
}

/**
 * Genereert een cred request van een cred offer. Deze wordt terug gestuurd zodat er een cred kan worden uitgegeven
 */
LedgerHandler.createOfferReq = async function(credOffer, walletHandleProver, masterSecret, didProver){
    let veriynimDid = LedgerHandler.dids.veriynimDid;

    //haal eerst de cred def op van de ledger
    let getCredDefRequest = await indy.buildGetCredDefRequest(veriynimDid, credOffer.cred_def_id);
    let getCredDefResponse = await indy.submitRequest(LedgerHandler.poolHandle, getCredDefRequest);
    let [diplomaCredDefId, diplomaCredDefGet]  = await indy.parseGetCredDefResponse(getCredDefResponse);
    
    //maak daarna een credreq aan.
    let [credreq, credReqMeta] = await indy.proverCreateCredentialReq(walletHandleProver, didProver, credOffer, diplomaCredDefGet, masterSecret);

    return [credreq, credReqMeta, diplomaCredDefGet];
}

/**
 * Sla een credential op
 */
LedgerHandler.storeCredential = async function(walletHandleProver, dimplomaCred, competenceRequestMeta, diplomaCredDefGet){
    await indy.proverStoreCredential(walletHandleProver, null, competenceRequestMeta, dimplomaCred, diplomaCredDefGet, null);
}

/**
 * Krijg alle credentials
 */
LedgerHandler.getAllCredentials = async function(walletHandleProver){
    return await indy.proverGetCredentials(walletHandleProver, null);
}

LedgerHandler.logOut = async function(walletHandleProver){
    await indy.closeWallet(walletHandleProver);
}