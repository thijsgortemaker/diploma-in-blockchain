const indy = require('indy-sdk');
const util = require('./util');
const buffer = require('buffer').Buffer;

const poolName = 'pool';
let poolHandle;
const log = console.log;

//backend server shit noapi needed
exports.openpool = async function openPool() {
    await indy.setProtocolVersion(2);
    const genesisFilePath = await util.getPoolGenesisTxnPath(poolName);
    const poolConfig = {'genesis_txn': genesisFilePath};
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

//register todo inplement api
exports.createWallet = async function createWallet(walletConfig, walletCredentials) {
    try {
        await indy.createWallet(walletConfig, walletCredentials);
    } catch (e) {
        await indy.deleteWallet(walletConfig, walletCredentials);
        await indy.createWallet(walletConfig, walletCredentials);
    }
    log("wallet created")
};

//login todo inplement api
exports.openWallet = async function openWallet(walletholder, walletConfig, walletCredentials) {
    try {
        walletholder.walletHandle = await indy.openWallet(walletConfig, walletCredentials);
    } catch (e) {
        await indy.createWallet(walletConfig, walletCredentials);
        walletholder.walletHandle = await indy.openWallet(walletConfig, walletCredentials);
    }
    log("wallet open");

};

//logout madatory to free recoursers todo inplement api???
exports.closeWallet = async function closeWallet(walletholder) {
    await indy.closeWallet(walletholder.walletHandle);
    log("wallet closed")
};

//dont seed
exports.deleteWallet = async function deleteWallet(walletConfig, walletCredentials) {
    await indy.deleteWallet(walletConfig, walletCredentials);
    log("wallet deleteted");
};

//static did inplement into login?
exports.didfromSeed = async function Didfromseed(walletholder, seed) {
    const [Did, Verkey] = await indy.createAndStoreMyDid(walletholder.walletHandle, seed);
    walletholder.Did = Did;
    walletholder.Verkey = Verkey;
    await indy.setDidMetadata(walletholder.walletHandle,Did,"mydid");
    log("did generated from seed")
};

//random DID to do inplement mabby
exports.generateDid = async function generateDid(walletholder,meta) {
    return [Did, Verkey] = await indy.createAndStoreMyDid(walletholder.walletHandle, {});
};

exports.storeDIDwithMeta = async function generateDid(walletholder,did,verkey,meta) {
    var identity={"did": did ,"verkey":verkey};
    await indy.storeTheirDid(walletholder.walletHandle,identity);
    await indy.setDidMetadata(walletholder.walletHandle,did,meta);
};

exports.setDidMeta = async function generateDid(walletholder,did,meta) {
    await indy.setDidMetadata(walletholder.walletHandle,did,meta);
};


exports.getDIDswithMeta = async function generateDid(walletholder) {
    return await indy.listMyDidsWithMeta(walletholder.walletHandle)
};


//todo inplement
exports.buildNymRequest = async function buildNymRequest(submiterDid, targetDid, targetverkey, role) {
    const nymRequest = await indy.buildNymRequest(submiterDid, targetDid, targetverkey, null, role);
    log("req build")
    return nymRequest;
};

//todo inplement mabby combine
exports.sendNymRequest = async function sendNymRequest(walletholder, nymRequest) {
    await indy.signAndSubmitRequest(poolHandle, walletholder.walletHandle, walletholder.Did, nymRequest);
    log("req send");
};

exports.buildAndSendGetNymRequest = async function buildAndSendGetNymRequest(submiterDid, targetDid) {
    const getNymRequest = await indy.buildGetNymRequest(submiterDid, targetDid);
    log(getNymRequest);
    log("get req build");
    const getNymResponse = await indy.submitRequest(poolHandle, getNymRequest);
    log("get req send");
    return getNymResponse;
};

exports.buildAndSendSchema = async function buildAndSendSchema(walletholder, name, version, atributes) {
    let [schemaId, schema] = await indy.issuerCreateSchema(stewardDid, name, version, atributes);
    log('Schema data: ', schemaId);
    log('Schema: ', schema);
    let schemaRequest = await indy.buildSchemaRequest(walletholder.Did, schema);
    let shemaResponse = await indy.signAndSubmitRequest(poolHandle, walletholder.walletHandle, walletholder.Did, schemaRequest)
    return [schemaId, shemaResponse];

};

exports.getschema = async function getschema(walletholder, schemaID) {
    let options = {noCache: false, noUpdate: false, noStore: false, minFresh: -1}
    var resp = await indy.getSchema(poolHandle, walletholder.walletHandle, walletholder.Did, schemaID, options)
    return resp;
};


//inplement in conectie
exports.getVerkey = async function getVerkey(walletholder, did) {
    return await indy.keyForDid(poolHandle, walletholder.walletHandle, did)
};

exports.setupconection = async function setupconection(from, to) {
    //from steps make and send did

    const [from_to_did, from_to_key] = await indy.createAndStoreMyDid(from.walletHandle, {});
    log("generate new key pair")
    const nymRequest = await indy.buildNymRequest(from.Did, from_to_did, from_to_key, null, null);
    log("build nym req")
    await indy.signAndSubmitRequest(poolHandle, from.walletHandle, from.Did, nymRequest);
    log("send conection req")

    //send over internet
    const connection_request = {
        'did': from_to_did,
        'nonce': 123456789
    };


    //to steps retive did and ver key and sendd resp
    const [to_from_did, to_from_key] = await indy.createAndStoreMyDid(to.walletHandle, {});
    log("generate new key pair")
    //see getverkey
    const from_to_verkey = await indy.keyForDid(poolHandle, to.walletHandle, from_to_did);
    log("get conection req")

    //encrypt and send over internet  back
    const connection_response = {
        'did': to_from_did,
        'verkey': to_from_key,
        'nonce': connection_request['nonce']
    };

    var string = JSON.stringify(connection_response)
    var buf = buffer.from(string);
    // encrypte sure
    to.anoncrypted_connection_response = await indy.cryptoAnonCrypt(from_to_verkey, buf)
    log("encrypted")
    log(to.anoncrypted_connection_response)

    //todo send mesage
    from.anoncrypted_connection_response = to.anoncrypted_connection_response;


    connection_response2 = await indy.cryptoAnonDecrypt(from.walletHandle, from_to_key, from.anoncrypted_connection_response);
    log(connection_response2.toString())
    log("decrypt")
    const nymRequest2 = await indy.buildNymRequest(from.Did, from_to_did, from_to_key, null, null);
    log("req build")
    await indy.signAndSubmitRequest(poolHandle, to.walletHandle, to.Did, nymRequest2);
    log("req send")
    log("return values")
    return [from_to_did, from_to_key, to_from_did, to_from_key]

};

//todo inplement encryp and dycrypt in coms
exports.encrypt = async function encrypt(key, message) {
    var string = JSON.stringify(message)
    var buf = buffer.from(string);
    return await indy.cryptoAnonCrypt(key, buf)
};

exports.decrypt = async function decrypt(key, message) {
    var buf = await indy.cryptoAnonDecrypt(key, message)
    return buf.toString()
};

exports.authencrypt = async function authencrypt(walletholder, key, message) {
    var string = JSON.stringify(message)
    var buf = buffer.from(string);
    return await indy.cryptoAuthCrypt(walletholder.walletHandle, key, buf)
};

exports.authdecrypt = async function authdecrypt(walletholder, key, message) {
    var buf = await indy.cryptoAuthDecrypt(walletholder.walletHandle, key, message)
    return buf.toString()
};

//todo inplement shit at server
exports.createandsendCreddef = async function createCreddef(walletholder, schema,) {
    cred_def_tag = 'TAG1';
    cred_def_type = 'CL';
    cred_def_config = {"support_revocation": False}
    var [credDefId, credDef] = await indy.issuerCreateAndStoreCredentialDef(walletholder.walletHandle, walletholder.Did, schema, cred_def_tag, cred_def_type, cred_def_config)
    var cred_def_request = await indy.buildCredDefRequest(walletholder.Did, credDef);
    await indy.signAndSubmitRequest(poolHandle, walletholder.walletHandle, walletholder.Did, cred_def_request)
    return [credDefId, credDef];
};

exports.getcreddef = async function getcreddef(walletholder, creddefid) {
    let options = {noCache: false, noUpdate: false, noStore: false, minFresh: -1};
    return await indy.getCredDef(poolHandle, walletholder.walletHandle, walletholder.Did, creddefid, options)
};


exports.tt = async function tt(from, to, creddef) {
    log("created offer")


    // faber['transcript_cred_offer'] = \
    //     await anoncreds.issuer_create_credential_offer(faber['wallet'], faber['transcript_cred_def_id'])
    log("");
    // logger.info("\"Faber\" -> Get key for Alice did")
    // faber['alice_key_for_faber'] = \
    //     await did.key_for_did(faber['pool'], faber['wallet'], faber['alice_connection_response']['did'])
    //
    // logger.info("\"Faber\" -> Authcrypt \"Transcript\" Credential Offer for Alice")
    // faber['authcrypted_transcript_cred_offer'] = \
    //     await crypto.auth_crypt(faber['wallet'], faber['key_for_alice'], faber['alice_key_for_faber'],
    //         faber['transcript_cred_offer'].encode('utf-8'))
    //
    // logger.info("\"Faber\" -> Send authcrypted \"Transcript\" Credential Offer to Alice")
    // alice['authcrypted_transcript_cred_offer'] = faber['authcrypted_transcript_cred_offer']
    //
    // logger.info("\"Alice\" -> Authdecrypted \"Transcript\" Credential Offer from Faber")
    // alice['faber_key_for_alice'], alice['transcript_cred_offer'], authdecrypted_transcript_cred_offer = \
    //     await auth_decrypt(alice['wallet'], alice['key_for_faber'], alice['authcrypted_transcript_cred_offer'])
    // alice['transcript_schema_id'] = authdecrypted_transcript_cred_offer['schema_id']
    // alice['transcript_cred_def_id'] = authdecrypted_transcript_cred_offer['cred_def_id']
    //
    // logger.info("\"Alice\" -> Create and store \"Alice\" Master Secret in Wallet")
    // alice['master_secret_id'] = await anoncreds.prover_create_master_secret(alice['wallet'], None)
    //
    // logger.info("\"Alice\" -> Get \"Faber Transcript\" Credential Definition from Ledger")
    // (alice['faber_transcript_cred_def_id'], alice['faber_transcript_cred_def']) = \
    //     await get_cred_def(alice['pool'], alice['did_for_faber'], alice['transcript_cred_def_id'])
    //
    // logger.info("\"Alice\" -> Create \"Transcript\" Credential Request for Faber")
    // (alice['transcript_cred_request'], alice['transcript_cred_request_metadata']) = \
    //     await anoncreds.prover_create_credential_req(alice['wallet'], alice['did_for_faber'],
    //         alice['transcript_cred_offer'], alice['faber_transcript_cred_def'],
    //         alice['master_secret_id'])
    //
    // logger.info("\"Alice\" -> Authcrypt \"Transcript\" Credential Request for Faber")
    // alice['authcrypted_transcript_cred_request'] = \
    //     await crypto.auth_crypt(alice['wallet'], alice['key_for_faber'], alice['faber_key_for_alice'],
    //         alice['transcript_cred_request'].encode('utf-8'))
    //
    // logger.info("\"Alice\" -> Send authcrypted \"Transcript\" Credential Request to Faber")
    // faber['authcrypted_transcript_cred_request'] = alice['authcrypted_transcript_cred_request']
    //
    // logger.info("\"Faber\" -> Authdecrypt \"Transcript\" Credential Request from Alice")
    // faber['alice_key_for_faber'], faber['transcript_cred_request'], _ = \
    //     await auth_decrypt(faber['wallet'], faber['key_for_alice'], faber['authcrypted_transcript_cred_request'])
    //
    // logger.info("\"Faber\" -> Create \"Transcript\" Credential for Alice")
    // faber['alice_transcript_cred_values'] = json.dumps({
    //     "first_name": {"raw": "Alice", "encoded": "1139481716457488690172217916278103335"},
    //     "last_name": {"raw": "Garcia", "encoded": "5321642780241790123587902456789123452"},
    //     "degree": {"raw": "Bachelor of Science, Marketing", "encoded": "12434523576212321"},
    //     "status": {"raw": "graduated", "encoded": "2213454313412354"},
    //     "ssn": {"raw": "123-45-6789", "encoded": "3124141231422543541"},
    //     "year": {"raw": "2015", "encoded": "2015"},
    //     "average": {"raw": "5", "encoded": "5"}
    // })
    // faber['transcript_cred'], _, _ = \
    //     await anoncreds.issuer_create_credential(faber['wallet'], faber['transcript_cred_offer'],
    //         faber['transcript_cred_request'],
    //         faber['alice_transcript_cred_values'], None, None)
    //
    // logger.info("\"Faber\" -> Authcrypt \"Transcript\" Credential for Alice")
    // faber['authcrypted_transcript_cred'] = \
    //     await crypto.auth_crypt(faber['wallet'], faber['key_for_alice'], faber['alice_key_for_faber'],
    //         faber['transcript_cred'].encode('utf-8'))
    //
    // logger.info("\"Faber\" -> Send authcrypted \"Transcript\" Credential to Alice")
    // alice['authcrypted_transcript_cred'] = faber['authcrypted_transcript_cred']
    //
    // logger.info("\"Alice\" -> Authdecrypted \"Transcript\" Credential from Faber")
    // _, alice['transcript_cred'], _ = \
    //     await auth_decrypt(alice['wallet'], alice['key_for_faber'], alice['authcrypted_transcript_cred'])
    //
    // logger.info("\"Alice\" -> Store \"Transcript\" Credential from Faber")
    // _, alice['transcript_cred_def'] = await get_cred_def(alice['pool'], alice['did_for_faber'],
    //     alice['transcript_cred_def_id'])
    //
    // await anoncreds.prover_store_credential(alice['wallet'], None, alice['transcript_cred_request_metadata'],
    //     alice['transcript_cred'], alice['transcript_cred_def'], None)

};

exports.t = async function t() {
    log("#debuging")
};



