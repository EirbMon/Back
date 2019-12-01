module.exports = function(app,User) {
    const truffle_connect = require('../connection/app.js');
    const blockchainCtrl = require('../controllers/blockchain.controller.js');


    /*
    partie blockchain
    */
    // renvoi tout les comptes
    app.get('/api/getAccounts', (req, res) => {
        blockchainCtrl.getAccounts(req, res);
    });

    // afficher mes eirbmon
    app.get('/api/getMyEirbmon', (req, res) => {
      blockchainCtrl.getMyEirbmon(req, res);
    });

    // afficher eirbmon seuls
    app.get('/api/getEirbmonWithoutOwner', (req, res) => {
      blockchainCtrl.getEirbmonWithoutOwner(req, res);
    });

    

    // afficher tous les eirbmons
    app.get('/api/getAllEirbmons', (req, res) => {
      blockchainCtrl.getAllEirbmons(req, res, User, 'user');
    });
}
