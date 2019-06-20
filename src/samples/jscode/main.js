console.log("server on");

const indyUtils= require("./indyUtils");
const colors = require('./colors');
const {walletholder} = require('./walletholder');
const log = console.log;


function logValue() {
    log(colors.CYAN, ...arguments, colors.NONE)
}

async function main() {
    //testing puposoues of indyMain
    //run as admin to fix shit
    //order is key pleas use await to make sure the pool is open when in use

    //open pool

    await indyUtils.openpool();

    // create wallet command

    walletConfig = {"id": "1"};
    walletCredentials = {"key": "secret"}
    walletConfig2 = {"id": "2"};
    walletCredentials2 = {"key": "secret"}
    let steward = new walletholder();
    await indyUtils.createWallet(walletConfig, walletCredentials);
    await indyUtils.openWallet(steward, walletConfig, walletCredentials);

    //create steward]
    const seed = {'seed': '000000000000000000000000Steward1'};
    var temp = await indyUtils.getDIDswithMeta(steward)
    log(temp);


    await indyUtils.didfromSeed(steward, seed);
   // logValue('Steward DID: ', steward.Did);
   // logValue('Steward Verkey: ', steward.Verkey);

    [Did1, Verkey1] = await indyUtils.generateDid(steward);
    steward.pririvateDid = Did1;
    steward.pririverkey = Verkey1;
//UsCeuNW53NyNccoaBd6Gej
    //create anchor
    let trustAnchor = new walletholder();
    await indyUtils.createWallet(walletConfig2, walletCredentials2);
    await indyUtils.openWallet(trustAnchor, walletConfig2, walletCredentials2);
    // var temp2= await indyUtils.getDIDswithMeta(trustAnchor)
    // log(temp2)
    // var [Did, Verkey] = await indyUtils.generateDid(trustAnchor);
    // trustAnchor.Did = Did;
    // trustAnchor.Verkey = Verkey;
    // logValue('Trust anchor DID: ', trustAnchor.Did);
    // logValue('Trust anchor Verkey: ', trustAnchor.Verkey);

    //[from_to_did, from_to_key, to_from_did, to_from_key] = await indyUtils.setupconection(steward, trustAnchor)



    // log("from did " + from_to_did);
    // log("from to key " + from_to_key);
    await indyUtils.setDidMeta(steward,"Th7MpTaRZVRYnPiabds81Y","myDID")
    // await indyUtils.storeDIDwithMeta(steward,to_from_did,to_from_key, "steward")
    // log("to from did " + to_from_did);
    // log("to from key " + to_from_key);

    var temp = await indyUtils.getDIDswithMeta(steward)
    log(steward)
    log(temp);
    log("trustanchor")
    var temp2= await indyUtils.getDIDswithMeta(trustAnchor)
    log(temp2)
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
    await indyUtils.closeWallet(trustAnchor);
    await indyUtils.closeWallet(steward);
 //   await indyUtils.deleteWallet(walletConfig, walletCredentials);
 //   await indyUtils.deleteWallet(walletConfig2, walletCredentials2);
    await indyUtils.closePool();
}

try {
    main();
} catch (e) {
    console.log("ERROR occured : " + e.toString())
}
