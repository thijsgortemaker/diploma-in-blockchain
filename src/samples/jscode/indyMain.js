const indy = require('indy-sdk');
const util = require('./util');
const colors = require('./colors');

const poolName = 'pool';
let poolHandle;
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

exports.createWallet = async function createWallet(walletholder) {
    //create wallet
    try {
        await indy.createWallet(walletholder.walletConfig, walletholder.walletCredentials)
    } catch (e) {
        await indy.deleteWallet(walletholder.walletConfig, walletholder.walletCredentials);
        await indy.createWallet(walletholder.walletConfig, walletholder.walletCredentials);
    }
    log("wallet created")
};

exports.openWallet = async function openWallet(walletholder) {
    const wallethandle = await indy.openWallet(walletholder.walletConfig, walletholder.walletCredentials);
    log("wallet open");
    log(wallethandle);
    walletholder.walletHandle=wallethandle
};

exports.closeWallet = async function closeWallet(walletholder) {
    await indy.closeWallet(walletholder.walletHandle);
    log("wallet closed")
};

exports.deleteWallet = async function deleteWallet(walletholder) {
    await indy.deleteWallet(walletholder.walletConfig, walletholder.walletCredentials);
    log("wallet deleteted");
};

exports.generateDid = async function generateDid(walletholder) {
    const [Did, Verkey] = await indy.createAndStoreMyDid(walletholder.walletHandle, walletholder.seed);
    walletholder.Did= Did;
    walletholder.Verkey= Verkey;
    log("did generated")
};

exports.buildNymRequest = async function buildNymRequest(submiterDid, targetDid, targetverkey, alias, role) {
    const nymRequest = await indy.buildNymRequest(submiterDid, targetDid, targetverkey, alias, role);
    log("req build")
    return nymRequest;
};

exports.sendNymRequest = async function sendNymRequest(walletholder, nymRequest) {
    await indy.signAndSubmitRequest(poolHandle, walletholder.walletHandle, walletholder.Did, nymRequest);
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

exports.buildAndSendSchema = async function buildAndSendSchema(walletholder, name, version, atributes) {
    let [schemaId, schema] = await indy.issuerCreateSchema(stewardDid, name, version, atributes);
    log('Schema data: ', schemaId);
    log('Schema: ', schema);
    let schemaRequest = await indy.buildSchemaRequest(walletholder.Did, schema);
    let shemaResponse = await indy.signAndSubmitRequest(poolHandle, walletholder.walletHandle, walletholder.Did, schemaRequest)
    return [schemaId,shemaResponse];

};

exports.getschema = async function getschema(walletholder, schemaID) {
    let options ={noCache: false,noUpdate: false, noStore:false,minFresh:-1}
    let resp = await indy.getSchema(poolHandle,walletholder.walletHandle,walletholder.Did,schemaID,options)
    log(resp);
};

exports.createCred = async function createCred(walletholder,schema,) {
    cred_def_tag = 'TAG1'
    cred_def_type = 'CL'
    cred_def_config = {"support_revocation": False}
    [credDefId, credDef] = await indy.issuerCreateAndStoreCredentialDef(walletholder.walletHandle,walletholder.Did,schema,cred_def_tag,cred_def_type,cred_def_config)
    log("#test")
    return [credDefId, credDef];
};

exports.test = async function test() {
    log("#test")
};

exports.test = async function test() {
    log("#test")
};

exports.test = async function test() {
    log("#test")
};



exports.t = async function t() {
    log("#debuging")
};


