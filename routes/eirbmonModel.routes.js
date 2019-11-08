module.exports = function(app,EirbmonModel) {
    //const EirbmonModelCtrl = require('../controllers/eirbmonModel.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');
    const truffle_connect = require('../connection/app.js');


    // Create a new User
    app.post('/api/createEirbmonModel', (req, res) => {
        GlobalCtrl.CreateEirbmonModel(req, res, EirbmonModel, 'eirbmonModel');
    });

}