module.exports = function(app,Filiere) {
    const FiliereCtrl = require('../controllers/filiere.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');
    const truffle_connect = require('../connection/app.js');


    // Create a new Filiere
    app.post('/api/createFiliere', (req, res) => {
        FiliereCtrl.CreateFiliere(req, res, Filiere, 'filiere');
    });

    app.get('/api/filiere', (req, res) => {
        FiliereCtrl.GetAll(req, res, Filiere, 'filiere');
    });

    app.get('/api/filiere/id/:idname', (req, res) => {
        FiliereCtrl.GetByIdFiliere(req, res, Filiere, 'filiere');
    });

    app.get('/api/filiere/name/:name', (req, res) => {
        FiliereCtrl.GetByNameFiliere(req, res, Filiere, 'filiere');
    });

    // Send mail to an filiere
    app.post('/api/filiere/send/', (req, res) => {
        FiliereCtrl.SendMailFiliere(req, res, Filiere, 'filiere');
    });

   // Update a Filiere with Id
    app.put('/api/filiere', (req, res) => {
        FiliereCtrl.UpdateFiliere(req, res, Filiere, 'filiere');
    });

    // Delete a Filiere with Id
    app.delete('/api/filiere/:_id', (req, res) => {
        FiliereCtrl.DeleteFiliere(req, res, Filiere, 'filiere');
    });
}
 