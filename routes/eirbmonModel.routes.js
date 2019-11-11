module.exports = function(app,EirbmonModel) {
    const EirbmonModelCtrl = require('../controllers/eirbmonModel.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');
    const truffle_connect = require('../connection/app.js');


    // Create a new EirbmonModel
    app.post('/api/createEirbmonModel', (req, res) => {
        EirbmonModelCtrl.CreateEirbmonModel(req, res, EirbmonModel, 'eirbmonModel');
    });

    app.get('/api/eirbmonModel', (req, res) => {
        GlobalCtrl.GetAll(req, res, EirbmonModel, 'eirbmonModel');
    });

    app.get('/api/eirbmonModel/id/:_id', (req, res) => {
        GlobalCtrl.GetById(req, res, EirbmonModel, 'eirbmonModel');
    });

    app.get('/api/eirbmonModel/name/:name', (req, res) => {
        EirbmonModelCtrl.GetByNameEirbmonModel(req, res, EirbmonModel, 'eirbmonModel');
    });

   // Update a EirbmonModel with Id
    app.put('/api/eirbmonModel', (req, res) => {
        GlobalCtrl.Update(req, res, EirbmonModel, 'eirbmonModel');
    });

    // Delete a EirbmonModel with Id
    app.delete('/api/eirbmonModel/:_id', (req, res) => {
        GlobalCtrl.Delete(req, res, EirbmonModel, 'eirbmonModel');
    });
}
 