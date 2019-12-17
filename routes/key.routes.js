module.exports = function(app,Key) {
    const KeyCtrl = require('../controllers/key.controller.js');

    app.get('/api/key/reset', (req, res) => {
        KeyCtrl.addKey(req, res,Key);
    });

    app.get('/api/key/update', (req, res) => {
        KeyCtrl.updateKey(req, res,Key);
    });

    app.get('/api/key', (req, res) => {
        KeyCtrl.availableKey(req, res,Key);
    });

    app.put('/api/key', (req, res) => {
        KeyCtrl.takeKey(req, res,Key);
    });
}

