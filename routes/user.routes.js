module.exports = function(app,User) {
    const UserCtrl = require('../controllers/user.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');

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

    // Retrieve a single User by Token
    app.get('/api/users/token/:token', (req, res) => {
        UserCtrl.GetByToken(req, res, User, 'token');
    });
    

   // Update a User with Id
    app.put('/api/users', (req, res) => {
      a = UserCtrl.VerifyRights(req.body._id, req.body.token, User, "user");
      a.then(val => 
      {
        if (val) {
          if(req.body.owner_id != undefined)
          {
            req.body.owner_id = req.body.owner_id.toLowerCase();
          }
          UserCtrl.Update(req, res, User, 'user');
        } else {
          console.log("ERROR NO RIGHTS");
          res.status(500).json({
            msg: "ERROR NO RIGHTS"
          })
        }
      });
    });

    // Delete a User with Id
    app.delete('/api/users/:_id', (req, res) => {
      a = UserCtrl.VerifyRights(req.body._id, req.body.token, User, "user");
      a.then(val => 
      {
        if (val) {
          GlobalCtrl.Delete(req, res, User, 'user');
        } else {
          console.log("ERROR NO RIGHTS");
          res.status(500).json({
            msg: "ERROR NO RIGHTS"
          })
        }
      })
      .catch(err => {console.log(err.message)});
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
