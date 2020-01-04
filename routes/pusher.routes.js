module.exports = function(app) {
    const PusherCtrl = require('../controllers/pusher.controller.js');

    app.post('/pusher/auth', (req, res) => {
        PusherCtrl.AuthenSalonExchange(req, res);
    });

    app.post('/pusher/users', (req, res) => {
        PusherCtrl.AuthenSalonChat(req, res);
    });

    app.post('/pusher/createUser', (req, res) => {
        PusherCtrl.CreateUser(req, res);
    });
}
