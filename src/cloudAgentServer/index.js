const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ledgerHandler = require('./src/ledgerHandler');
const userMap = require('./src/userMap');

// imports for in-code documentation
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

<<<<<<< HEAD
// Set port here
=======
>>>>>>> 32679239193b3563257b10577c8da83a81ef9d4f
const PORT = 3001;

// Defining base information for this route
const swaggerDefinition = {
    info: {
        title: 'CloudAgentServer API Documentation',
        version: '1.0.0',
        description: 'API Description for the back-end of the CloudAgentServer'
    },
    host: 'localhost:' + PORT,
    basePath: '/'
}

const options = {
    swaggerDefinition,
    apis: ['./routes/api/*.js'],
}

const swaggerSpec = swaggerJSDoc(options);


<<<<<<< HEAD
=======

>>>>>>> 32679239193b3563257b10577c8da83a81ef9d4f
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes'));
app.use(express.static('public'));

run();

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

async function run(){
    await ledgerHandler.init(PORT);
    userMap.init();

    app.listen(PORT, function () {
        console.log('Listening on port: ' + PORT);
    });
}

async function cleanup(){
    await ledgerHandler.close();
    console.log("cleanup");
    userMap.close();
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




