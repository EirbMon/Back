module.exports = function(app,Eirbmon) {
    //const EirbmonCtrl = require('../controllers/eirbmon.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');
    const truffle_connect = require('../connection/app.js');


    // Create a new User
    app.post('/api/createEirbmon', (req, res) => {
        GlobalCtrl.CreateEirbmon(req, res, Eirbmon, 'eirbmon');
    });

}