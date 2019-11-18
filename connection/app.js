const contract = require('truffle-contract');
const eirbmon_artifact = require('../../Blockchain/build/contracts/Eirbmon.json');
var Eirbmon = contract(eirbmon_artifact);

module.exports = {
  start: function(callback) {
    var self = this;

    // Bootstrap the Eirbmon abstraction for Use.
    Eirbmon.setProvider(self.web3.currentProvider);

    self.web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        console.log(account);
      }else{
        console.log("account");

      }
    });
    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  getMyEirbmon: function(account,callback) {
    var self = this;

    // Bootstrap the Eirbmon abstraction for Use.
    Eirbmon.setProvider(self.web3.currentProvider);

    Eirbmon.deployed().then(function(instance) {
      eirbmonInstance = instance;
      return eirbmonInstance.getEirbmonCount();
    }).then(function(pokemonsCount) {
      var response = [];
      var tabProm = [];
      for (var i = 1; i <= pokemonsCount; i++) {
        tabProm[i] = eirbmonInstance._Eirbmons(i);
        tabProm[i].then(function(pokemon) {
          if(account == pokemon[2]){
            response.push(pokemon);
          }
         })
      }
      Promise.all(tabProm).then(()=>callback(response),()=>console.log('error'));

      
    })

  },

}


