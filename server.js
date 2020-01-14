const ConfParam = require('./conf.js');

const express = require('express');
const app = express();
const port = 4000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');
const ip = ConfParam.ip;
const ipBlockchain = ConfParam.ipBlockchain;
var schedule = require('node-schedule');

// parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static('src'));

var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Cross-origin resource sharing (CORS)
const cors = require('cors')
const corsOptions = {
  origin: "*",
  methods: "OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204
}
app.use(cors(corsOptions))

// Configuring the database: MongoDB Cloud
//const url = "mongodb+srv://damien:damien@cluster0-fwwwo.mongodb.net/enseirbmon?ssl=true&retryWrites=true"
const url = "mongodb+srv://vmalay:1234@cluster0-4ygx9.mongodb.net/enseirbmon?ssl=true&retryWrites=true"; // url de MongoDB Cloud
const mongoose = require('mongoose'); // import des fonctions du module 'mongoose' (module de MongoDB Cloud pour NodeJS)
mongoose.set('useFindAndModify', false); // [OPTINAL] Empeche certains warnings inutiles

// Connecting to the database en http.
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Successfully connected to MongoDB.");     // Print in console.
}).catch(err => {
    console.log('Could not connect to MongoDB, error: ' + err); // Print in console.
    process.exit();
});

//Schemas : correspond à la structure des "Documents", même s'ils sont dynamiques ça permet de controler les données, le type, ou autre verification.
var User = require('./schemas/user.schema.js');
var Eirbmon = require('./schemas/eirbmon.schema.js');
var Skill = require('./schemas/skill.schema.js');
var Key = require('./schemas/key.schema.js');
var Eirbdex = require('./schemas/eirbdex.schema.js');
const EirbmonCtrl = require('./controllers/eirbmon.controller.js');

// Correspond aux routes emprumter par les requètes. Ceci permet au Frontend de déclencher des requètes grâce au route.
require('./routes/user.routes.js')(app,User);
require('./routes/eirbmon.routes.js')(app,Eirbmon, Eirbdex);
require('./routes/skill.routes.js')(app,Skill);
require('./routes/blockchain.routes.js')(app,User);
require('./routes/pusher.routes.js')(app);
require('./routes/key.routes.js')(app,Key);
require('./routes/eirbdex.routes.js')(app,Eirbdex);
// Options du serveur. En cas de bonne réception du message, on envoie le message "200: OK" au front end). Ce sera utilisé à la création du serveur ci-dessous.
app.options('*', function (request, response) {
  response.send(200);
});


app.listen(port,ip, () => {
  // mise à jour de la base de données tous les jours à minuit
  schedule.scheduleJob('0 0 0 * * *', function(){
    EirbmonCtrl.UpdateEirbmonTable(Eirbmon)
  });
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider(ipBlockchain));

  console.log("Express Listening at http://localhost:" + port);
});
