module.exports = function(app,Key) {
    const KeyCtrl = require('../controllers/key.controller.js');

    app.get('/api/addkey', (req, res) => {
        KeyCtrl.addKey(req, res,Key);
    });

    app.get('/api/getKey', (req, res) => {
        KeyCtrl.addKey(req, res,Key);
    });

    app.get('/api/availableKey', (req, res) => {
        KeyCtrl.availableKey(req, res,Key);
    });

    app.put('/api/takeKey', (req, res) => {
        KeyCtrl.takeKey(req, res,Key);
    });
}

