module.exports = function(app) {
    const truffle_connect = require('../connection/app.js');
    const blockchainCtrl = require('../controllers/blockchain.controller.js');


    /*
    partie blockchain
    */
    // renvoi tout les comptes
    app.get('/getAccounts', (req, res) => {
        blockchainCtrl.getAccounts(req, res);
    });

    // afficher mes eirbmon
    app.get('/getMyEirbmon', (req, res) => {
      blockchainCtrl.getMyEirbmon(req, res);
    });
}
