const indy = require('indy-sdk')
const util = require('./util')
const fs = require('fs')
const path = require("path");

/**
 * Constante variabelen
 */
//geef de pool een naam waarme je gaat verbinden
const POOL_NAME = "poolio";
const STEWARD_WALLET_NAME = "Stewardo walleto"; 

class Entity{
    constructor(name){
        this.name = name;
    }
}


class Stewardo{
    constructor(){
        this.seed = '000000000000000000000000Steward1';
        this.name = STEWARD_WALLET_NAME;
    }
}

let poolHandle;
const stewardWalletGlobal = new Stewardo();
const faberWalletGlobal = new Entity("faberio");

run();

async function run() {
    //zet de protocol versie. 
    //bron voor versie nummer: https://www.npmjs.com/package/indy-sdk#setprotocolversion--protocolversion----void
    await indy.setProtocolVersion(2);

    //open en verbind met de pool. Gebruik de handle om met de pool te praten.
    poolHandle = await connectMetPool();

    //creeer de wallet voor de steward. Deze zal de andere dingen authoriseren om te kunnen praten met de ledger
    await createStewardWallet();
    await createWalletAndOpen(faberWalletGlobal);

    //connecties
    await connectMetFaber();

    //close de wallets
    await indy.closeWallet(stewardWalletGlobal.walletHandle);
    await indy.closeWallet(faberWalletGlobal.walletHandle);


    //delete de wallets
    await indy.deleteWallet(stewardWalletGlobal.walletName, stewardWalletGlobal.walletPassword);
    await indy.deleteWallet(faberWalletGlobal.walletName, faberWalletGlobal.walletPassword);

    //sluit die pool
    await indy.closePoolLedger(poolHandle);
    console.log("hallo");
}

async function connectMetFaber(){
    [stewardWalletGlobal.forFaberDid, stewardWalletGlobal.forFaberKey] = await indy.createAndStoreMyDid(stewardWalletGlobal.walletHandle, {}); 

    let nymRequest = await indy.buildNymRequest(stewardWalletGlobal.stewardDid, stewardWalletGlobal.forFaberDid, stewardWalletGlobal.forFaberKey, null, null);
    await indy.signAndSubmitRequest(poolHandle, stewardWalletGlobal.walletHandle , stewardWalletGlobal.stewardDid , nymRequest);

    let connectionRequest = {
        did: stewardWalletGlobal.forFaberDid,
        nonce: 123456789
    };

    [faberWalletGlobal.forStewardDid, faberWalletGlobal.forStewardKey] = await indy.createAndStoreMyDid(faberWalletGlobal.walletHandle, {}); 

    let connectionResponse = JSON.stringify({
        'did': faberWalletGlobal.forStewardDid,
        'verkey': faberWalletGlobal.forStewardKey,
        'nonce': connectionRequest.nonce
    });

    let stewardVerkey = await indy.keyForDid(poolHandle, faberWalletGlobal.walletHandle, connectionRequest.did);

    let anoncryptedConnectionResponse = await indy.cryptoAnonCrypt(stewardVerkey, Buffer.from(connectionResponse, 'utf8'));
    let decryptedConnectionResponse = JSON.parse(Buffer.from(await indy.cryptoAnonDecrypt(stewardWalletGlobal.walletHandle, stewardWalletGlobal.forFaberKey, anoncryptedConnectionResponse)));

    let nymRequest2 = await indy.buildNymRequest(stewardWalletGlobal.stewardDid, decryptedConnectionResponse.did, decryptedConnectionResponse.verkey, null, null);
    await indy.signAndSubmitRequest(poolHandle, stewardWalletGlobal.walletHandle, stewardWalletGlobal.stewardDid, nymRequest2);

    //verinym
    [faberWalletGlobal.faberDid, faberWalletGlobal.faberKey] = await indy.createAndStoreMyDid(faberWalletGlobal.walletHandle, {});
    let didInfoJson = JSON.stringify({
        'did': faberWalletGlobal.faberDid,
        'verkey': faberWalletGlobal.faberKey
    });

    let authcryptedDidInfo = await indy.cryptoAuthCrypt(faberWalletGlobal.walletHandle, faberWalletGlobal.forStewardKey, stewardVerkey, Buffer.from(didInfoJson, 'utf8'));
    let [senderVerkey, authdecryptedDidInfo] = await indy.cryptoAuthDecrypt(stewardWalletGlobal.walletHandle, stewardWalletGlobal.forFaberKey, Buffer.from(authcryptedDidInfo));

    let authdecryptedDidInfoJson = JSON.parse(Buffer.from(authdecryptedDidInfo));
    console.log(authdecryptedDidInfoJson);
    console.log(senderVerkey);
    console.log(authdecryptedDidInfoJson.did);
    console.log(authdecryptedDidInfoJson.verkey);

    let peniswtfisthishit =  await indy.keyForDid(poolHandle, stewardWalletGlobal.walletHandle, decryptedConnectionResponse.did);

    if(senderVerkey == peniswtfisthishit){
        console.log("match");
    }

    let nymRequest3 = await indy.buildNymRequest(stewardWalletGlobal.stewardDid, authdecryptedDidInfoJson.did,
                                             authdecryptedDidInfoJson.verkey, "Fabre", 'TRUST_ANCHOR');

    await indy.signAndSubmitRequest(poolHandle, stewardWalletGlobal.walletHandle, stewardWalletGlobal.stewardDid, nymRequest3)

    let[dida, verkeya] = await indy.createAndStoreMyDid(faberWalletGlobal.walletHandle, {}); 
    
    nymRequest3 = await indy.buildNymRequest(faberWalletGlobal.faberDid, dida,
    verkeya, "Fdsafe", null);

    await indy.signAndSubmitRequest(poolHandle, faberWalletGlobal.walletHandle, faberWalletGlobal.faberDid, nymRequest3)



    let nymGet = await indy.buildGetNymRequest(stewardWalletGlobal.stewardDid, authdecryptedDidInfoJson.did);
    let penis = await indy.signAndSubmitRequest(poolHandle, stewardWalletGlobal.walletHandle, stewardWalletGlobal.stewardDid, nymGet);
    console.log(authdecryptedDidInfoJson.did);
    console.log(penis);


    // let attrrequest = await indy.buildAttribRequest(authdecryptedDidInfoJson.did, authdecryptedDidInfoJson.did, null, {"port": "6969"}, null);
    // penis = await indy.signAndSubmitRequest(poolHandle, faberWalletGlobal.walletHandle, authdecryptedDidInfoJson.did, attrrequest);

    // nymGet = await indy.buildGetAttribRequest(stewardWalletGlobal.stewardDid, authdecryptedDidInfoJson.did,null,"halloa123123ttr",null);
    // penis = await indy.signAndSubmitRequest(poolHandle, stewardWalletGlobal.walletHandle, stewardWalletGlobal.stewardDid, nymGet);
    console.log("aaaaaaaaaaaaaaaaaaa");
    console.log(penis);
}

async function createStewardWallet(){
    
    try{
        //maak de wallet aan
        await createWalletAndOpen(stewardWalletGlobal);
        
        //genereer de did die al op de ledger staat met een seed
        const did = {'seed': stewardWalletGlobal.seed};
        [stewardWalletGlobal.stewardDid, stewardWalletGlobal.stewardVerkey] = await indy.createAndStoreMyDid(stewardWalletGlobal.walletHandle, did);

    }catch(e){
        console.log("steward wallet already exists, just opening it");
        //als deze al bestaat open deze dan alleen.
        stewardWalletGlobal.walletHandle = await indy.openWallet(stewardWalletGlobal.walletName, stewardWalletGlobal.walletPassword);
    }
}

async function createWalletAndOpen(walletOwner){
    try{
        walletOwner.walletName = {"id": walletOwner.name}
        walletOwner.walletPassword = {"key": "wachtwoord"}
        await indy.createWallet(walletOwner.walletName, walletOwner.walletPassword)

        walletOwner.walletHandle = await indy.openWallet(walletOwner.walletName, walletOwner.walletPassword);
    }catch(e){
        e.log;
        throw e;
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