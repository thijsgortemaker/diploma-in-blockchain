const indy = require('indy-sdk');
const path = require('path');

let walletHandle;
let poolHandle;

const POOL_NAME = "testpoolconfig";
const WALLET_NAME = {"id": "testWallet"};
const WALLET_CRED = {"key": "testCredential"};


let walletHandleProver;
const WALLET_NAME_Prover = {"id": "testWalletafsdafds"};
const WALLET_CRED_prover = {"key": "testCredentialadsfafds"};

run();

async function run(){
    await indy.setProtocolVersion(2);

    poolHandle = await connectMetPool();

    //issuer
    try{
       await indy.createWallet(WALLET_NAME, WALLET_CRED);
    }catch(e){
        await indy.deleteWallet(WALLET_NAME, WALLET_CRED);
       await indy.createWallet(WALLET_NAME, WALLET_CRED);
    }


    walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);
    
    let [did, verkey] = await indy.createAndStoreMyDid(walletHandle, {});
    await makeTrustAnchor(did, verkey);

    //prover
    try{
        await indy.createWallet(WALLET_NAME_Prover, WALLET_CRED_prover);
     }catch(e){
        await indy.deleteWallet(WALLET_NAME_Prover, WALLET_CRED_prover);
         await indy.createWallet(WALLET_NAME_Prover, WALLET_CRED_prover);
     }

    walletHandleProver = await indy.openWallet(WALLET_NAME_Prover ,WALLET_CRED_prover);
    let masterSecret = await indy.proverCreateMasterSecret(walletHandleProver, null);

    let [didProver, verkeyProver] = await indy.createAndStoreMyDid(walletHandleProver, {}); 
    let nymRequest = await indy.buildNymRequest(did, didProver, verkeyProver, null, null);
    await indy.signAndSubmitRequest(poolHandle, walletHandle, did, nymRequest);

    //interactie
    //let schemaprover = await getSchema(poolHandle, didProver , schemaID);

    //let competentieCredOffer = await indy.issuerCreateCredentialOffer(walletHandle, credDefID);

    console.log("send Schema");
    let [diplomaSchemaId, diplomaSchema] = await indy.issuerCreateSchema(did, 'Saxion-Competentie', '1.0',
        ['naam', 'studentnummer', 'vak', 'cijfer', 'ecs']);    
    
    await sendSchema(poolHandle, walletHandle, did, diplomaSchema);
    [, diplomaSchema] = await getSchema(poolHandle, did, diplomaSchemaId);


    console.log("send Cred def");
    let [diplomaCredDefId, diplomaCredDefJson] = await indy.issuerCreateAndStoreCredentialDef(walletHandle, did, diplomaSchema, 'TAG1', 'CL', '{"support_revocation": false}');

    console.log(diplomaCredDefId);
	
    await sendCredDef(poolHandle, walletHandle, did, diplomaCredDefJson);


    //interactie

    console.log("interactie");
    let comptenceOffer = await indy.issuerCreateCredentialOffer(walletHandle, diplomaCredDefId);
    console.log(comptenceOffer.cred_def_id);

    [diplomaCredDefId, diplomaCredDefGet] = await getCredDef(poolHandle, did, comptenceOffer.cred_def_id);
    console.log(diplomaCredDefGet);

    let [competenceRequest, competenceRequestMeta]  = await indy.proverCreateCredentialReq(walletHandleProver , didProver, comptenceOffer , diplomaCredDefGet, masterSecret);
    console.log(competenceRequest);

    let transcript_cred_values = {
        "naam": {"raw": "Jack Nickelson", "encoded": "123456789"},
        "studentnummer": {"raw": "403018", "encoded": "403018"},
        "vak": {"raw": "hahaha", "encoded": "123456789"},
        "cijfer": {"raw": "6", "encoded": "6"},
        "ecs": {"raw": "3", "encoded": "3"}
    }

    let [dimplomaCred, credRevocId, revocRegDelta] = await indy.issuerCreateCredential(walletHandle, comptenceOffer, competenceRequest, transcript_cred_values, null, 0);

    await indy.proverStoreCredential(walletHandleProver, null, competenceRequestMeta, dimplomaCred, diplomaCredDefGet, null);
    let credentials = await indy.proverGetCredentials(walletHandleProver, null);
    console.log(credentials);

    await indy.setEndpointForDid(walletHandleProver, didProver, "http://localhost::3001", verkeyProver);

    var endpoint = '127.0.0.1:9700'
    await indy.setEndpointForDid(walletHandle, did, endpoint, verkey)
    
    var data = await indy.getEndpointForDid(walletHandleProver, poolHandle, did)
    console.log(data);

    //stop
    await indy.closeWallet(walletHandleProver);
    await indy.deleteWallet(WALLET_NAME_Prover, WALLET_CRED_prover);
    await indy.closeWallet(walletHandle);
    await indy.deleteWallet(WALLET_NAME, WALLET_CRED);
    await indy.closePoolLedger(poolHandle);
}

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
    await indy.signAndSubmitRequest(poolHandle, stewardWalletHandle, didStew, nymRequest);

    await indy.closeWallet(stewardWalletHandle);
    await indy.deleteWallet(stewardname, stewardKey);
}

async function sendSchema(poolHandle, walletHandle, Did, schema) {
    let schemaRequest = await indy.buildSchemaRequest(Did, schema);
    let response = await indy.signAndSubmitRequest(poolHandle, walletHandle, Did, schemaRequest)
}

async function sendCredDef(poolHandle, walletHandle, did, credDef) {
    let credDefRequest = await indy.buildCredDefRequest(did, credDef);
    let response = await indy.signAndSubmitRequest(poolHandle, walletHandle, did, credDefRequest);
    console.log(response);
}

async function getSchema(poolHandle, did, schemaId) {
    let getSchemaRequest = await indy.buildGetSchemaRequest(did, schemaId);
    let getSchemaResponse = await indy.submitRequest(poolHandle, getSchemaRequest);
    return await indy.parseGetSchemaResponse(getSchemaResponse);
}

async function getCredDef(poolHandle, did, schemaId) {
    let getCredDefRequest = await indy.buildGetCredDefRequest(did, schemaId);
    let getCredDefResponse = await indy.submitRequest(poolHandle, getCredDefRequest);
    return await indy.parseGetCredDefResponse(getCredDefResponse);
}
