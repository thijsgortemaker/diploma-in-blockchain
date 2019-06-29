const path = require("path");
const indy = require('indy-sdk');
const fs = require('fs');

const POOL_NAME = "saxionPoolConfig";
const WALLET_NAME = {"id": "saxionWaller"};
const WALLET_CRED = {"key": "saxionCredential"};

var LedgerHandler = module.exports = {
    walletHandle: undefined,
    poolHandle: undefined,
    dids: undefined
}

/**
 * Maakt een competentie aan met de gegeven competentie request
 */
LedgerHandler.maakCompetentieAan = async function(naam, studentnummer, vak, cijfer, ecs, comptenceOffer , competenceRequest, callBack, req, res){
    
    //alle values moeten een string zijn!
    let transcript_cred_values = {
        "naam": {"raw": naam + "", "encoded": "123456789"},
        "studentnummer": {"raw": studentnummer + "", "encoded": studentnummer + ""},
        "vak": {"raw": vak + "", "encoded": "123456789"},
        "cijfer": {"raw": cijfer + "", "encoded": cijfer+ ""},
        "ecs": {"raw": ecs + "", "encoded": ecs + ""}
    }

    //maak de credential aan
    let [dimplomaCred, credRevocId, revocRegDelta] = await indy.issuerCreateCredential(LedgerHandler.walletHandle, comptenceOffer, competenceRequest, transcript_cred_values, null, 0);

    callBack(dimplomaCred, req, res);
}

/**
 * Maak een offer om een cred uit te geven
 */
LedgerHandler.makeCredOffer= async function(callBack, req , res){
    let credOffer = await indy.issuerCreateCredentialOffer(LedgerHandler.walletHandle, LedgerHandler.dids.diplomaCredDefId);

    callBack(req, res, credOffer);
}

/**
 * Genereer keys voor het uitwisselen van de keys.
 * Wordt ook meteen naar de ledger geschreven
 */
LedgerHandler.generateKeys = async function(idConnectieRequest, callBack, req, res){
    //genereer keys
    let[did, verkey] = await indy.createAndStoreMyDid(LedgerHandler.walletHandle, {});
    
    //schrijf naar de ledger
    let nymRequest = await indy.buildNymRequest(LedgerHandler.dids.veriynimDid, did, verkey , null, null);
    await indy.signAndSubmitRequest(LedgerHandler.poolHandle, LedgerHandler.walletHandle, LedgerHandler.dids.veriynimDid, nymRequest);

    callBack(idConnectieRequest, did, req, res);
}

/**
 * Sluit de ledger af
 */
LedgerHandler.close = async function (){
    //write out the dids
    let data = JSON.stringify(LedgerHandler.dids);  
    fs.writeFileSync('dids.json', data);  

    await indy.closeWallet(LedgerHandler.walletHandle);
    await indy.closePoolLedger(LedgerHandler.poolHandle);
}

/**
 * Init de ledgerhandler door te verbinden met de pool en een wallet aan te maken
 * Zoekt een pool_genesis file in de project directory genaamd pool_genesis.txn
 */
LedgerHandler.init= async function (port){
    await indy.setProtocolVersion(2);

    await connectMetPool();
    await createSaxionWallet();

    // await createPortAndIpLedgerAttr(port);


    console.log("Connected with pool and opend wallet");
}


/**
 * Connect met de pool 
 */
async function connectMetPool(){
    //vind de geneiss file. In dit project zit het in de code map. Een map hoger dan deze
    const genesisFilePath = path.join(__dirname, '..', '..', 'pool_genesis.txn');
        
    //creeer de poolconfig
    const poolConfig = {'genesis_txn': genesisFilePath}
    
    //probeer een poolLedgerConfig te maken.
    try{           
        await indy.createPoolLedgerConfig(POOL_NAME, poolConfig)
    }catch(e){           
        console.log(`pool ledger already exists with name ${POOL_NAME}`);
    }
    
    //connect met de pool zodat je een hadle terug krijgt om er mee te praten
    LedgerHandler.poolHandle = await indy.openPoolLedger(POOL_NAME, undefined);
}

/**
 * Maak de Saxion wallet aan. Genereer een did en maak deze een trust anchor. Hierna maak een schema aan en stuur deze naar de ledger.
 * Stuur de cred def naar de ledger.
 */
async function createSaxionWallet(){
    try{
        //maak de wallet aan
        await indy.createWallet(WALLET_NAME, WALLET_CRED)
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);  
        LedgerHandler.dids = {};

        //genereer de did die al op de ledger staat met een seed
        [LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey] = await indy.createAndStoreMyDid(LedgerHandler.walletHandle, {});
        await makeTrustAnchor(LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey);

        let did = LedgerHandler.dids.veriynimDid;
        let poolHandle = LedgerHandler.poolHandle;
        let walletHandle = LedgerHandler.walletHandle;

        //hierna moet er nog een Schema gepubliceert worden.
        console.log("send Schema");
        let [diplomaSchemaId, diplomaSchema] = await indy.issuerCreateSchema(did, 'Saxion-Competentie', '1.0',
        ['naam', 'studentnummer', 'vak', 'cijfer', 'ecs']);    
    
        await sendSchema(poolHandle, walletHandle, did, diplomaSchema);
        //je moet de schema weer ophalen wil je het gebruiken
        [, diplomaSchema] = await getSchema(poolHandle, did, diplomaSchemaId);

        //maak een cred def aan
        console.log("send Cred def");
        let [diplomaCredDefId, diplomaCredDefJson] = await indy.issuerCreateAndStoreCredentialDef(walletHandle, did, diplomaSchema, 'TAG1', 'CL', '{"support_revocation": false}');
        await sendCredDef(poolHandle, walletHandle, did, diplomaCredDefJson);

        LedgerHandler.dids.diplomaSchemaId = diplomaSchemaId;
        LedgerHandler.dids.diplomaSchema = diplomaSchema;
        LedgerHandler.dids.diplomaCredDefId = diplomaCredDefId;
        LedgerHandler.dids.diplomaCredDefJson = diplomaCredDefJson;
    }catch(e){
        console.log("steward wallet already exists, just opening it");
        //als deze file bestaat dan moet er ook een wallet zijn.
        let rawdata = fs.readFileSync('dids.json');  
        LedgerHandler.dids = JSON.parse(rawdata); 
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);        
    }
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

    await indy.createWallet(stewardname, stewardKey);
    stewardWalletHandle = await indy.openWallet(stewardname, stewardKey);

    let [didStew, verkeyStew] = await indy.createAndStoreMyDid(stewardWalletHandle, seed);
    
    let nymRequest = await indy.buildNymRequest(didStew, didOther, verkeyOther, null, 'TRUST_ANCHOR');
    await indy.signAndSubmitRequest(LedgerHandler.poolHandle, stewardWalletHandle, didStew, nymRequest);

    await indy.closeWallet(stewardWalletHandle);
    await indy.deleteWallet(stewardname, stewardKey);
}

/**
 * Stuur schema naar ledger
 * @param {*} poolHandle 
 * @param {*} walletHandle 
 * @param {*} Did 
 * @param {*} schema 
 */
async function sendSchema(poolHandle, walletHandle, Did, schema) {
    let schemaRequest = await indy.buildSchemaRequest(Did, schema);
    let response = await indy.signAndSubmitRequest(poolHandle, walletHandle, Did, schemaRequest)
    console.log(response);
}

/**
 * Stuur cred def naar ledger
 * @param {} poolHandle 
 * @param {*} walletHandle 
 * @param {*} did 
 * @param {*} credDef 
 */
async function sendCredDef(poolHandle, walletHandle, did, credDef) {
    let credDefRequest = await indy.buildCredDefRequest(did, credDef);
    let response = await indy.signAndSubmitRequest(poolHandle, walletHandle, did, credDefRequest);
    console.log(response);
}

async function createPortAndIpLedgerAttr(port){
    let attrRequest = await indy.buildAttribRequest(
        LedgerHandler.dids.veriynimDid, 
        LedgerHandler.dids.veriynimDid,
        null,
        {"port": port},
        null
        );
        
        reply = await indy.signAndSubmitRequest(LedgerHandler.poolHandle, LedgerHandler.walletHandle, LedgerHandler.dids.veriynimDid, attrRequest);
        console.log(reply.result.txn.data.raw);

    attrRequest = await indy.buildAttribRequest(
        LedgerHandler.dids.veriynimDid, 
        LedgerHandler.dids.veriynimDid,
        null,
        {"ip": "127.0.0.1"},
        null
    );

    reply = await indy.signAndSubmitRequest(LedgerHandler.poolHandle, LedgerHandler.walletHandle, LedgerHandler.dids.veriynimDid, attrRequest);
    console.log(reply.result.txn.data.raw);
}

/**
 * Krijg schema van de ledger
 * @param {} poolHandle 
 * @param {*} did 
 * @param {*} schemaId 
 */
async function getSchema(poolHandle, did, schemaId) {
    let getSchemaRequest = await indy.buildGetSchemaRequest(did, schemaId);
    let getSchemaResponse = await indy.submitRequest(poolHandle, getSchemaRequest);
    return await indy.parseGetSchemaResponse(getSchemaResponse);
}

/**
 * Krijg schema van de ledger
 * @param {*} poolHandle 
 * @param {*} did 
 * @param {*} schemaId 
 */
async function getCredDef(poolHandle, did, schemaId) {
    let getCredDefRequest = await indy.buildGetCredDefRequest(did, schemaId);
    let getCredDefResponse = await indy.submitRequest(poolHandle, getCredDefRequest);
    return await indy.parseGetCredDefResponse(getCredDefResponse);
}