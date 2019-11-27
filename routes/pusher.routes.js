module.exports = function(app) {
    const PusherCtrl = require('../controllers/pusher.controller.js');

    app.post('/pusher/auth', (req, res) => {
        PusherCtrl.AuthenSalon(req, res);
    });
}
