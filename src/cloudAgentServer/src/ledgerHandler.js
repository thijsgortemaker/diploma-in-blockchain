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
    //await initPoolAndWallet();
}

LedgerHandler.close = async function (){
    //await closePoolAndWallet();
}

async function closePoolAndWallet(){
    //write out the dids
    let data = JSON.stringify(LedgerHandler.dids);  
    try{
        fs.writeFileSync('dids.json', data); 
    }catch(e){
        e.log;
    }

    await indy.closeWallet(LedgerHandler.walletHandle);
    await indy.closePoolLedger(LedgerHandler.poolHandle);

    console.log(LedgerHandler.walletHandle);
}

async function initPoolAndWallet(){
    await indy.setProtocolVersion(2);

    LedgerHandler.poolHandle = await connectMetPool();
    
    await createWalletForCloudAgent();

    console.log("Connected with pool and created wallet");
}

LedgerHandler.createPortAndIpLedgerAttr =  async function(port){    
    let attrRequest = await indy.buildAttribRequest(
        LedgerHandler.dids.veriynimDid, 
        LedgerHandler.dids.veriynimDid,
        null,
        {"port": port},
        null
        );
        
    let reply = await indy.signAndSubmitRequest(LedgerHandler.poolHandle, LedgerHandler.walletHandle, LedgerHandler.dids.veriynimDid, attrRequest);
    console.log(reply.result.txn.data);


    attrRequest = await indy.buildAttribRequest(
        LedgerHandler.dids.veriynimDid, 
        LedgerHandler.dids.veriynimDid,
        null,
        {"ip": "127.0.0.1"},
        null
    );

    reply = await indy.signAndSubmitRequest(LedgerHandler.poolHandle, LedgerHandler.walletHandle, LedgerHandler.dids.veriynimDid, attrRequest);
    console.log(reply.result.txn.data);
}

async function createWalletForCloudAgent(){
    try{
        //maak de wallet aan
        await createWalletAndOpen();   
        LedgerHandler.dids = {};
        
        //genereer de did die al op de ledger staat met een seed
        [LedgerHandler.dids.veriynimDid, LedgerHandler.dids.veriynimVerkey] = await indy.createAndStoreMyDid(LedgerHandler.walletHandle, {});
    }catch(e){
        console.log(WALLET_NAME.id +  " already exists, just opening it");
        let rawdata = fs.readFileSync('dids.json');  
        LedgerHandler.dids = JSON.parse(rawdata); 
        console.log(LedgerHandler.dids);

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