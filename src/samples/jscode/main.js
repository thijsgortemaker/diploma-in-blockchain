console.log("server on");

const indyMain = require("./indyMain");
const colors = require('./colors');
const {walletholder} =require('./walletholder');
const log = console.log;

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
    let steward= new walletholder("1","secret");

    await indyMain.createWallet(steward);
    await indyMain.openWallet(steward);

    //create steward]
    const did = {'seed': '000000000000000000000000Steward1'};
    steward.seed= did;

    await indyMain.generateDid(steward);
    logValue('Steward DID: ', steward.Did);
    logValue('Steward Verkey: ', steward.Verkey);

    //create anchor
    const trustAnchor =  new walletholder("2","secret");
    await indyMain.createWallet(trustAnchor);
    await indyMain.openWallet(trustAnchor);


    await indyMain.generateDid(trustAnchor);
    logValue('Trust anchor DID: ', trustAnchor.Did);
    logValue('Trust anchor Verkey: ', trustAnchor.Verkey);
    //build req
    const nymRequest = await indyMain.buildNymRequest(steward.Did, trustAnchor.Did, trustAnchor.Verkey, "TRUST_ANCHOR", "TRUST_ANCHOR");
    //send req
    await indyMain.sendNymRequest(steward, nymRequest);
    //
    // //generate client
    // const [clientDid, clientVerkey] = await indyMain.generateDid({});
    // logValue('Client DID: ', clientDid);
    // logValue('Client Verkey: ', clientVerkey);
    //
    connection_request = {
        'did': trustAnchor.Did,
        'nonce': 123456789
    }


    //   old
    //   const getNYMreq = await indyMain.buildGetNymRequest(clientDid, trustAnchorDid);
    //   const getNymResponse = await indyMain.sendGetNymRequest(getNYMreq);
    //  new
    const getNymResponse = await indyMain.buildAndSendGetNymRequest(steward.Did, trustAnchor.Did);
    logValue(getNymResponse)
    logValue('Written by Steward: ', trustAnchor.Verkey)
    const verkeyFromLedger = JSON.parse(getNymResponse['result']['data'])['verkey']
    logValue('Queried from ledger: ', verkeyFromLedger)
    logValue('Matching: ', verkeyFromLedger == trustAnchor.Verkey)

    //version has to be newer and a . between numbers not a ,
    //var version = "1.1";
    // var atributes = ['age', 'sex', 'height', 'name'];
    //let [schemaid, schemaresponse] = await indyMain.buildAndSendSchema(stewardDid, "person", "1.4", atributes);
    //log("schema id +" +schemaid);
    // log(schemaresponse);

    //schemaresp =await indyMain.getschema(clientDid,"Th7MpTaRZVRYnPiabds81Y:2:person:1.1");
    //log(schemaresp);
    //indyMain.test(stewardDid,"test","1.0",atributes);
    //shut down
    await indyMain.closeWallet(steward);
    await indyMain.closeWallet(trustAnchor);
    await indyMain.deleteWallet(steward);
    await indyMain.deleteWallet(trustAnchor);
    await indyMain.closePool();
}

try {
    main();
} catch (e) {
    console.log("ERROR occured : " + e.toString())
}