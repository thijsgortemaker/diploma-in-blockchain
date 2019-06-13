const path = require("path");
const indy = require('indy-sdk');
const fs = require('fs');

let StewardSeed = '000000000000000000000000Steward1';
const POOL_NAME = "stewardPoolConfig";
const WALLET_NAME = {"id": "stewardWallet"};
const WALLET_CRED = {"key": "stewardWalletcred"};

var LedgerHandler = module.exports = {
    walletHandle: undefined,
    poolHandle: undefined,
    dids: {}
}

LedgerHandler.init= async function (port){
    await initPoolAndWallet(port);
}

LedgerHandler.close = async function (){
    await closePoolAndWallet();
}

LedgerHandler.addVerinym = async function(did, ver){
    let nymRequest = await indy.buildNymRequest(
        LedgerHandler.dids.veriynimDid, 
        did,
        ver, 
        null, 
        'TRUST_ANCHOR'
    );

    await indy.signAndSubmitRequest(
        LedgerHandler.poolHandle, 
        LedgerHandler.walletHandle, 
        LedgerHandler.dids.veriynimDid, 
        nymRequest
    )
}

async function closePoolAndWallet(){
    //write out the dids
    let data = JSON.stringify(LedgerHandler.dids);  
    fs.writeFileSync('dids.json', data);  

    await indy.closeWallet(LedgerHandler.walletHandle);
    await indy.closePoolLedger(LedgerHandler.poolHandle);
}

async function initPoolAndWallet(port){
    await indy.setProtocolVersion(2);

    LedgerHandler.poolHandle = await connectMetPool();
    
    await createStewardWallet();

    await createPortAndIpLedgerAttr(port);


    console.log("Connected with pool and created wallet");
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

async function createStewardWallet(){
    try{
        let rawdata = fs.readFileSync('dids.json');  
        LedgerHandler.dids = JSON.parse(rawdata); 
    }catch(e){
        console.log(":)");
    }

    try{
        //maak de wallet aan
        await createWalletAndOpen();   
        LedgerHandler.dids = {};
        
        //genereer de did die al op de ledger staat met een seed
        const did = {'seed': StewardSeed};
        [LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey] = await indy.createAndStoreMyDid(LedgerHandler.walletHandle, did);
    }catch(e){
        console.log("steward wallet already exists, just opening it");
        //als deze al bestaat open deze dan alleen.
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);
    }
}

async function createWalletAndOpen(){
    try{
        await indy.createWallet(WALLET_NAME, WALLET_CRED)
        LedgerHandler.walletHandle = await indy.openWallet(WALLET_NAME, WALLET_CRED);
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