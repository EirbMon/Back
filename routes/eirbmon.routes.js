module.exports = function(app,Eirbmon) {
    const EirbmonCtrl = require('../controllers/eirbmon.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');

    // Create a new Eirbmon
    app.post('/api/eirbmon', (req, res) => {
        EirbmonCtrl.CreateEirbmon(req, res, Eirbmon, 'eirbmon');
    });

    // Retreive all Eirbmon
    app.get('/api/eirbmon/all', (req, res) => {
        EirbmonCtrl.GetAllEirbmons(req, res, Eirbmon, 'eirbmon');
    });

    // update mongo with blockchain Eirbmon
    app.get('/api/eirbmon/update', (req, res) => {
        EirbmonCtrl.UpdateEirbmonTable(Eirbmon);
    });

    // update Eirbmon Owner in mongo
    app.put('/api/eirbmon/updateowner', (req, res) => {
        EirbmonCtrl.updateMongoEirbmonOwner(req, res,Eirbmon);
    });
  
    // Retrieve n eirbmons by User, :number? signifie que le paramètre est optionnel.
    app.get('/api/eirbmon/owner/:owner_id/:number?', (req, res) => {
        EirbmonCtrl.GetAnyEirbmonsByOwner(req, res, Eirbmon, 'eirbmon');
    });
       
    // Retrieve a single Eirbmon by Id
    app.get('/api/eirbmon/:idInBlockchain', (req, res) => {
        EirbmonCtrl.GetEirbmonByidInBlockchain(req, res,  Eirbmon, 'eirbmon');
    });

    // Retrieve All Eirbmon 
    app.get('/api/eirbmon', (req, res) => {
        GlobalCtrl.GetAll(req, res, Eirbmon, 'eirbmon');
    });

    // Update a Eirbmon with Id
    app.put('/api/eirbmon', (req, res) => {
        EirbmonCtrl.Update(req, res,  Eirbmon, 'eirbmon');
    });

    // Delete a Eirbmon with Id
    app.delete('/api/eirbmon/:_id', (req, res) => {
        GlobalCtrl.Delete(req, res, Eirbmon, 'eirbmon');
    });

    
}
