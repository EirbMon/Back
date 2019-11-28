module.exports = function(app,Eirbmon) {
    const EirbmonCtrl = require('../controllers/eirbmon.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');

    // Create a new Eirbmon
    app.post('/api/eirbmon', (req, res) => {
        EirbmonCtrl.CreateEirbmon(req, res, Eirbmon, 'eirbmon');
    });

    //Update Eirbmon table with the blockchain
    app.get('/api/eirbmon/all', (req, res) => {
        EirbmonCtrl.GetAllEirbmons(req, res, Eirbmon, 'eirbmon');
    });

    // Retrieve all User
    app.get('/api/eirbmon/owner/:owner_id', (req, res) => {
        console.log("Route Eirbmon by Owner (or Orphelin)")
        EirbmonCtrl.GetOwnerEirbmons(req, res, Eirbmon, 'eirbmon');
    });
       
    // Retrieve a single Eirbmon by Id
    app.get('/api/eirbmon/:_id', (req, res) => {
        GlobalCtrl.GetById(req, res,  Eirbmon, 'eirbmon');
    });

    // Retrieve All Eirbmon 
    app.get('/api/eirbmon', (req, res) => {
        GlobalCtrl.GetAll(req, res, Eirbmon, 'eirbmon');
    });

    // Retrieve a single Eirbmon by name
    app.get('/api/eirbmon/name/:name', (req, res) => {
        GlobalCtrl.GetByName(req, res, Eirbmon, 'eirbmon');
    });

    // Update a Eirbmon with Id
    app.put('/api/eirbmon', (req, res) => {
        GlobalCtrl.Update(req, res,  Eirbmon, 'eirbmon');
    });

    // Delete a Eirbmon with Id
    app.delete('/api/eirbmon/:_id', (req, res) => {
        GlobalCtrl.Delete(req, res, Eirbmon, 'eirbmon');
    });

    
}
