module.exports = function(app,Filiere) {
    const FiliereCtrl = require('../controllers/filiere.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');
    const truffle_connect = require('../connection/app.js');


    // Create a new Filiere
    app.post('/api/createFiliere', (req, res) => {
        FiliereCtrl.Create(req, res, Filiere, 'filiere');
    });

    app.get('/api/filiere', (req, res) => {
        GlobalCtrl.GetAll(req, res, Filiere, 'filiere');
    });

    app.get('/api/filiere/id/:_id', (req, res) => {
        GlobalCtrl.GetById(req, res, Filiere, 'filiere');
    });

    app.get('/api/filiere/name/:name', (req, res) => {
        FiliereCtrl.GetByNameFiliere(req, res, Filiere, 'filiere');
    });

   // Update a Filiere with Id
    app.put('/api/filiere', (req, res) => {
        GlobalCtrl.Update(req, res, Filiere, 'filiere');
    });

    // Delete a Filiere with Id
    app.delete('/api/filiere/:_id', (req, res) => {
        GlobalCtrl.Delete(req, res, Filiere, 'filiere');
    });
}
 