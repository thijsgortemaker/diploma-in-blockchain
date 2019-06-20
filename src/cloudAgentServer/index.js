const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ledgerHandler = require('./src/ledgerHandler');

const PORT = 3001;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('public'));

run();

async function run(){
    await ledgerHandler.init(PORT);

    //doe een request om de veriynyms te schrijven naar de ledger.
    request.post({
        headers: {'content-type' : 'application/json"'},
        url:     'http://127.0.0.1:3000/api/makeMeATrustAnchor',
        form:    {verinymDID: ledgerHandler.dids.veriynimDid , verinymverKey: ledgerHandler.dids.veriynimVerkey}
      }, async function (err, res) {
        if (err) return console.error(err.message);
            
        console.log(res.body);

        await ledgerHandler.createPortAndIpLedgerAttr(PORT);
    })

}

app.listen(PORT, function () {
    console.log('Listening on port: ' + PORT);
});

async function cleanup(){
    await ledgerHandler.close();
    console.log("cleanup");
    process.exit();
}

//do something when app is closing
process.on('exit', function() {
    cleanup();
});

//catches ctrl+c event
process.on('SIGINT', function() {
    cleanup();
});

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', function() {
    cleanup();
});

process.on('SIGUSR2', function() {
    cleanup();
});

//catches uncaught exceptions
process.on('uncaughtException', function() {
    cleanup();
});




