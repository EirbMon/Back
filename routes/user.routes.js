module.exports = function(app,User) {
    const UserCtrl = require('../controllers/user.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');
    const truffle_connect = require('../connection/app.js');


    // Create a new User
    app.post('/api/users', (req, res) => {
        UserCtrl.Create(req, res, User, 'user');
    });

    // Retrieve all User
    app.get('/api/users', (req, res) => {
        GlobalCtrl.GetAll(req, res, User, 'user');
    });

    // Retrieve a single User by Id
    app.get('/api/users/:_id', (req, res) => {
        GlobalCtrl.GetById(req, res, User, 'user');
    });

    // Retrieve a single User by Name
    app.get('/api/users/name/:name', (req, res) => {
         GlobalCtrl.GetByName(req, res, User, 'name');
    });

    // Retrieve a single User by Email
    app.get('/api/users/email/:email', (req, res) => {
        UserCtrl.GetByEmail(req, res, User, 'email');
    });

    // Send mail to an user
    app.post('/api/users/send/', (req, res) => {
        UserCtrl.SendEmail(req, res);
    });

   // Update a User with Id
    app.put('/api/users', (req, res) => {
      if (UserCtrl.VerifyRights(req.body._id, req.body.token)) {
        GlobalCtrl.Update(req, res, User, 'user');
      } else {
        console.log("ERROR NO RIGHTS");
        res.status(500).json({
          msg: "ERROR NO RIGHTS"
        })
      }
    });

    // Delete a User with Id
    app.delete('/api/users/:_id', (req, res) => {
      if (UserCtrl.VerifyRights(req.body._id, req.body.token)) {
        GlobalCtrl.Delete(req, res, User, 'user');
      } else {
        console.log("ERROR NO RIGHTS");
        res.status(500).json({
          msg: "ERROR NO RIGHTS"
        })
      }
    });

    // Authentification
    app.post('/api/auth', (req, res) => {
        UserCtrl.Auth(req, res, User, 'user');
    });

    // Test token
    app.post('/api/test', (req, res) => {
      UserCtrl.TestToken(req, res, User, 'user');
    });

}
