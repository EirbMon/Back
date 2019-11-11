const express = require('express');
const app = express();
const port = 8080 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');
const contract = require('truffle-contract');
const eirbmon_artifact = require('./build/contracts/Eirbmon.json');
var Eirbmon = contract(eirbmon_artifact);

const fs = require('fs'); // module "File System" pour pouvoir intéragir avec le système, ici c'est pour récupéré/lire le contenu de fichiers txt (comme un "cat").
const https = require('https'); // module pour crée un serveur https.

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('src'));




// Express middleware to parse requests' body (les réponses sont au format JSON, bodyparser)
// Ceci permet d'utiliser les formats JSON (les décomposers d'ou "parser"). Dans les requètes SQL, on utilise des formats JSON.
// Exemple: POST http//..../users --data {name:"Valentin", age:"69"}


// Cross-origin resource sharing (CORS) adds HEADER to HTTP Request in order to allow an user
// to access to server ressources from different origins.
// De base les requètes provenant de source différente (téléphone vs ordinateur vs tablet vs etc) sont interdites.
// Avec le module CORS on peut modifier le header http et autorisé les requètes provenant de source différente.
const cors = require('cors')
const corsOptions = {
  origin: "*",
  methods: "OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204
}
app.use(cors(corsOptions))

// Configuring the database: MongoDB Cloud
const url = "mongodb+srv://vmalay:1234@cluster0-4ygx9.mongodb.net/enseirbmon?ssl=true&retryWrites=true"; // url de MongoDB Cloud
const mongoose = require('mongoose'); // import des fonctions du module 'mongoose' (module de MongoDB Cloud pour NodeJS)
mongoose.set('useFindAndModify', false); // [OPTINAL] Empeche certains warnings inutiles

// Base de donnée: enseirbmon (écrit dans l'url ci-dessus)
// Collections : users, pokemons, shops, etc..   : Nom de la table
// Documents : id_user, name, last name, etc..  : Nom des fields de la table (en NoSQL, on peut crée des fields dynamiquement au fur et a mesure)

// Connecting to the database en https. On se connecte via le protocole https. Ceci est indispensable pour avoir un serveur https.
mongoose.connect(url, {useNewUrlParser: true,
  ssl:true, sslValidate: true, // On active la connexion sécurisé en https.
  sslKey: fs.readFileSync('./security/mongodb.pem'),
  sslCert: fs.readFileSync('./security/mongodb-cert.crt'),
})
.then(() => {
    console.log("Successfully connected to MongoDB.");     // Print in console.
}).catch(err => {
    console.log('Could not connect to MongoDB, error: ' + err); // Print in console.
    process.exit();
});

//Schemas : correspond à la structure des "Documents", même s'ils sont dynamiques ça permet de controler les données, le type, ou autre verification.
var User = require('./schemas/user.schema.js');
var Eirbmon = require('./schemas/eirbmon.schema.js');
var EirbmonModel = require('./schemas/eirbmonModel.schema.js');
var Filiere = require('./schemas/filiere.schema.js');

// Correspond aux routes emprumter par les requètes. Ceci permet au Frontend de déclencher des requètes grâce au route.
// Create all CRUD SQL/Routing functions (GET,POST,PUT,DELETE). On traduit la requete HTTP envoyé par le front-end en des nouvelles fonctions gérées par le serveur.
// On utilise les fonctions dans le dossier controllers.
// Exemple: Le frontend envoie un "GET" (dans le header de la requète http) sur https://localhost:8080/api/users/ enclenche un GetAll de la part du serveur)
require('./routes/user.routes.js')(app,User);
require('./routes/eirbmon.routes.js')(app,Eirbmon);
require('./routes/eirbmonModel.routes.js')(app,EirbmonModel);
require('./routes/filiere.routes.js')(app,Filiere);


// Options du serveur. En cas de bonne réception du message, on envoie le message "200: OK" au front end). Ce sera utilisé à la création du serveur ci-dessous.
app.options('*', function (request, response) {
  response.send(200);
});

// Options http du serveur. On utilise un certificat de confiance pour avoir un serveur en https et pouvoir utiliser le protocole https en local. (Le certificat n'est valide que en local).
// Ce sera utilisé à la création du serveur ci-dessous.
var httpsOptions = {
    key: fs.readFileSync('./security/key.pem'),
    cert: fs.readFileSync('./security/cert.pem')
};


// GET :
//User.findOne({ name: 'Plastic Bricks' }, function (err, doc) {console.log(doc);});

// Création du serveur, on utilise les options ci-dessus. Le serveur est en écoute "infinie" / "permanente" sur le port 8080. On a crée un serveur HTTPS, donc on peut y avoir accès en httpS://localhost:8080/
// Pour crée un serveur https, il faut que toutes les url/connexion dans le serveur utilisés soit en https. C'est pour cela que la connexion à MongoDB au début est fait un ssl/https.
/*
https.createServer(httpsOptions, app).listen(server_port, function (){
  console.log('Listening on port: ' + server_port);
});
*/


app.listen(port, () => {

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  console.log("Express Listening at http://localhost:" + port);

});


