module.exports = function(app,Eirbdex) {
    const EirbdexCtrl = require('../controllers/eirbdex.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');

    // Create a new Eirbdex
    app.post('/api/eirbdex', (req, res) => {
        GlobalCtrl.Create(req, res, Eirbdex, 'eirbdex');
    });

    // Retrieve all Eirbdex
    app.get('/api/eirbdex', (req, res) => {
        GlobalCtrl.GetAll(req, res, Eirbdex, 'eirbdex');
    });

    // Retrieve a single Eirbdex by Type
    app.get('/api/eirbdex/:type', (req, res) => {
         EirbdexCtrl.GetByType(req, res, Eirbdex, 'type');
    });

}
