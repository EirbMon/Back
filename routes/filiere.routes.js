module.exports = function(app,Filiere) {
    //const EirbmonCtrl = require('../controllers/filiere.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');
    const truffle_connect = require('../connection/app.js');


    // Create a new User
    app.post('/api/createFiliere', (req, res) => {
        GlobalCtrl.CreateFiliere(req, res, Filiere, 'filiere');
    });

}