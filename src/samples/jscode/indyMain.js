const indy = require('indy-sdk');
const util = require('./util');
const colors = require('./colors');

const poolName = 'pool';
let poolHandle;
let walletHandle;
const log = console.log;

function logValue() {
    log(colors.CYAN, ...arguments, colors.NONE)
}

exports.openpool = async function openPool() {
    await indy.setProtocolVersion(2)
    const genesisFilePath = await util.getPoolGenesisTxnPath(poolName)
    const poolConfig = {'genesis_txn': genesisFilePath}
    try {
        await indy.createPoolLedgerConfig(poolName, poolConfig)
    } catch (e) {
        await indy.deletePoolLedgerConfig(poolName);
        await indy.createPoolLedgerConfig(poolName, poolConfig)
    }


    poolHandle = await indy.openPoolLedger(poolName, poolConfig);
    log("the pool is open");
};

exports.closePool = async function closePool() {
    await indy.closePoolLedger(poolHandle);
    await indy.deletePoolLedgerConfig(poolName);
    log("pool is closed")
};

exports.createWallet = async function createWallet(walletConfig, walletCredentials) {
    //create wallet
    try {
        await indy.createWallet(walletConfig, walletCredentials)
    } catch (e) {
        await indy.deleteWallet(walletConfig, walletCredentials);
        await indy.createWallet(walletConfig, walletCredentials);
    }
    log("wallet created")
};

exports.openWallet = async function openWallet(walletConfig, walletCredentials) {
    const wallethandle = await indy.openWallet(walletConfig, walletCredentials);
    log("wallet open");
    log(wallethandle);
    walletHandle = wallethandle;
    return walletHandle;
};

exports.closeWallet = async function closeWallet() {
    await indy.closeWallet(walletHandle);
    log("wallet closed")
};

exports.deleteWallet = async function deleteWallet(walletConfig, walletCredentials) {
    await indy.deleteWallet(walletConfig, walletCredentials);
    log("wallet deleteted");
};

exports.generateDid = async function generateDid(did) {
    const [Did, Verkey] = await indy.createAndStoreMyDid(walletHandle, did)
    return [Did, Verkey];
};

exports.buildNymRequest = async function buildNymRequest(submiterDid, targetDid, targetverkey, alias, role) {
    const nymRequest = await indy.buildNymRequest(submiterDid, targetDid, targetverkey, alias, role);
    log("req build")
    return nymRequest;
};

exports.sendNymRequest = async function sendNymRequest(submitterdid, nymRequest) {
    await indy.signAndSubmitRequest(poolHandle, walletHandle, submitterdid, nymRequest);
    log("req send");
};

exports.buildAndSendGetNymRequest = async function buildAndSendGetNymRequest(submiterDid, targetDid) {
    const getNymRequest = await indy.buildGetNymRequest(submiterDid, targetDid);
    log(getNymRequest);
    log("req build");
    const getNymResponse = await indy.submitRequest(poolHandle, getNymRequest);
    log("req send");
    return getNymResponse;
};

exports.buildAndSendSchema = async function buildAndSendSchema(stewardDid, name, version, atributes) {
    let [schemaId, schema] = await indy.issuerCreateSchema(stewardDid, name, version, atributes);
    log('Schema data: ', schemaId);
    log('Schema: ', schema);
    let schemaRequest = await indy.buildSchemaRequest(stewardDid, schema);
    let shemaResponse = await indy.signAndSubmitRequest(poolHandle, walletHandle, stewardDid, schemaRequest)
    return [schemaId,shemaResponse];

};

exports.getschema = async function getschema(submiterID, schemaID) {
    let options ={noCache: false,noUpdate: false, noStore:false,minFresh:-1}
    let resp = await indy.getSchema(poolHandle,walletHandle,submiterID,schemaID,options)
    log(resp);
};

exports.test = async function test() {
    log("#test")
    let options ={noCache: false,noUpdate: false, noStore:false,minFresh:-1}
    // {
    //     noCache: (bool, optional, false by default) Skip usage of cache,
    //     noUpdate: (bool, optional, false by default) Use only cached data, do not try to update.
    //     noStore: (bool, optional, false by default) Skip storing fresh data if updated,
    //     minFresh: (int, optional, -1 by default) Return cached data if not older than this many seconds. -1 means do not check age.
    // }

    let resp = await indy.getSchema(poolHandle,walletHandle,"Th7MpTaRZVRYnPiabds81Y","Th7MpTaRZVRYnPiabds81Y:2:person:1.1",options)
    log(resp);
    return resp;
};

exports.t = async function t() {
    log("#debuging")
};


