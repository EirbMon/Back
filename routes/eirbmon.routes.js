module.exports = function(app,Eirbmon, Eirbdex) {
    const EirbmonCtrl = require('../controllers/eirbmon.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');

    // Retreive all Eirbmon
    app.get('/api/eirbmon/all', (req, res) => {
        EirbmonCtrl.GetAllEirbmons(req, res, Eirbmon, 'eirbmon');
    });

    // get all eirbmon for sale
    app.get('/api/eirbmon/forsale', (req, res) => {
        EirbmonCtrl.getEirmonForSale(req, res, Eirbmon);
    });

    // sal an eirbmon for sale
    app.put('/api/eirbmon/forsale', (req, res) => {
        EirbmonCtrl.setEirmonForSale(req, res, Eirbmon);
    });

    
    // update mongo with blockchain Eirbmon
    app.get('/api/eirbmon/update', (req, res) => {
        EirbmonCtrl.UpdateEirbmonTable(res,Eirbmon);
    });

    // reset mongo with blockchain Eirbmon
    app.get('/api/eirbmon/reset', (req, res) => {
        EirbmonCtrl.resetEirbmonTable(res,Eirbmon);
    });
 
    // evolve eirbmon
    app.get('/api/eirbmon/evolve/:idInBlockchain', (req, res) => {
        EirbmonCtrl.getEvolve(req,res,Eirbmon,Eirbdex,'Eirbmon');
    });

    // find my next evolution
    app.get('/api/eirbmon/evolution/:idInBlockchain', (req, res) => {
        EirbmonCtrl.findMyEvolution(req,res,Eirbmon,Eirbdex,'Eirbmon');
    });

    // update Eirbmon Owner in mongo accordingly to the blockchain and add the new Eirbmon
    app.put('/api/eirbmon/catch', (req, res) => {
        // prend en argument l'id de l'eirbmon dans la chaine
        EirbmonCtrl.catchEirbmon(req, res,Eirbmon);
    });

    // update Eirbmon Owner in mongo accordingly to the blockchain
    app.put('/api/eirbmon/updateOwner', (req, res) => {
        // prend en argument l'id de l'eirbmon dans la chaine idEirbmonBlockchain et l'adresse de wallet
        EirbmonCtrl.updateOwner(req, res,Eirbmon);
    });

    //add the first Eirbmon of a user
    app.post('/api/eirbmon/addFirstEirbmon', (req, res) => {
        EirbmonCtrl.addFirstEirbmon(req, res,Eirbmon);
    });
    
    // update Eirbmon Owner in mongo accordingly to the blockchain of the 2 users
    app.put('/api/eirbmon/exchange', (req, res) => {
        // prend en argument 2 id d'eirbmons dans la chaine idEirbmon idEirbmonBlockchain1 et idEirbmonBlockchain2
        EirbmonCtrl.exchangeEirbmon(req, res,Eirbmon);
    });
  
    // Retrieve n eirbmons by User, :number? signifie que le paramètre est optionnel.
    app.get('/api/eirbmon/owner/:owner_id/:number?', (req, res) => {
        EirbmonCtrl.GetAnyEirbmonsByOwner(req, res, Eirbmon, 'eirbmon');
    });
       
    // Retrieve a single Eirbmon by Id
    app.get('/api/eirbmon/:idInBlockchain', (req, res) => {
        EirbmonCtrl.GetEirbmonByidInBlockchain(req, res,  Eirbmon, 'eirbmon');
    });

    // Retrieve All Eirbmon 
    app.get('/api/eirbmon', (req, res) => {
        GlobalCtrl.GetAll(req, res, Eirbmon, 'eirbmon');
    });

    // Update a Eirbmon with Id
    app.put('/api/eirbmon', (req, res) => {
        EirbmonCtrl.Update(req, res,  Eirbmon, 'eirbmon');
    });

    // Delete a Eirbmon with Id
    app.delete('/api/eirbmon/:_id', (req, res) => {
        GlobalCtrl.Delete(req, res, Eirbmon, 'eirbmon');
    });
    
}
