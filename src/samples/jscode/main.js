console.log("server on");

const indyMain = require("./indyMain");
const colors = require('./colors');
const log = console.log;

const walletConfig = {"id": "1"};
const walletCredentials = {"key": "secret"};

function logValue() {
    log(colors.CYAN, ...arguments, colors.NONE)
}

async function main() {
    //testing puposoues of indyMain
    //run as admin to fix shit
    //order is key pleas use await to make sure the pool is open when in use

    //open pool
    await indyMain.openpool();

    // create wallet command

    await indyMain.createWallet(walletConfig, walletCredentials);

    //get wallethandle
     await indyMain.openWallet(walletConfig, walletCredentials);

    //create steward]
    const did = {'seed': '000000000000000000000000Steward1'};
    //seed is ww?
    const [stewardDid, stewardVerkey] = await indyMain.generateDid(did);
    logValue('Steward DID: ', stewardDid);
    logValue('Steward Verkey: ', stewardVerkey);

    //create anchor
    //no did = new acc did and key
    const [trustAnchorDid, trustAnchorVerkey] = await indyMain.generateDid("{}");
    logValue('Trust anchor DID: ', trustAnchorDid);
    logValue('Trust anchor Verkey: ', trustAnchorVerkey);
    //build req
    const nymRequest = await indyMain.buildNymRequest(stewardDid, trustAnchorDid, trustAnchorVerkey, "TRUST_ANCHOR", "TRUST_ANCHOR");
    //send req
    await indyMain.sendNymRequest(stewardDid,nymRequest);

    //generate client
    const [clientDid, clientVerkey] = await indyMain.generateDid({});
    logValue('Client DID: ', clientDid);
    logValue('Client Verkey: ', clientVerkey);

    //old
  //   const getNYMreq = await indyMain.buildGetNymRequest(clientDid, trustAnchorDid);
  //   const getNymResponse = await indyMain.sendGetNymRequest(getNYMreq);
  // //  new
    const getNymResponse = await indyMain.buildAndSendGetNymRequest(clientDid, trustAnchorDid);
    logValue(getNymResponse)

    logValue('Written by Steward: ', trustAnchorVerkey)
    const verkeyFromLedger = JSON.parse(getNymResponse['result']['data'])['verkey']
    logValue('Queried from ledger: ', verkeyFromLedger)
    logValue('Matching: ', verkeyFromLedger == trustAnchorVerkey)

    //version has to be newer and a . between numbers not a ,
    //var version = "1.1";
    //var atributes = ['age', 'sex', 'height', 'name'];
    //let [schemaid,schemaresponse] = await indyMain.buildAndSendSchema(stewardDid, "person", "1.4", atributes);
    //log("schema id +" +schemaid);
   // log(schemaresponse);

    schemaresp =await indyMain.getschema(clientDid,"Th7MpTaRZVRYnPiabds81Y:2:person:1.1");
    log(schemaresp);
    //indyMain.test(stewardDid,"test","1.0",atributes);
    //shut down
    await indyMain.closeWallet();
    await indyMain.deleteWallet(walletConfig, walletCredentials);
    await indyMain.closePool();
}

try {
    main();
} catch (e) {
    console.log("ERROR occured : " + e.toString())
}