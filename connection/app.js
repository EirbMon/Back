const contract = require('truffle-contract');
const PATH_TO_BLOCKCHAIN = "../Blockchain/";
// const eirbmon_artifact = require('../' + PATH_TO_BLOCKCHAIN + 'build/contracts/Eirbmon.json');
// var Eirbmon = contract(eirbmon_artifact);

module.exports = {
  PATH_TO_BLOCKCHAIN : PATH_TO_BLOCKCHAIN,
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
      return eirbmonInstance.eirbmonsCount();
    }).then(function(eirbmonsCount) {
      console.log(eirbmonsCount)
      var response = {"Pokemons":[]};
      var tabProm = [];
      for (var i = 0; i < eirbmonsCount; i++) {
        tabProm[i] = eirbmonInstance._Eirbmons(i);
        tabProm[i].then(function(eirbmon) {
          console.log(eirbmon[2],account)
          // console.log(eirbmon)
          let item = {"type":eirbmon[7],"name":eirbmon[1],"color":eirbmon[4],"position_x":Number(eirbmon[5]),"position_y":Number(eirbmon[6])};
          console.log(item)
          response.Pokemons.push(item);

          // if(eirbmon[2] == account){
          //   console.log('ok')
          //   response.push(eirbmon);
          // }
         })
      }
      Promise.all(tabProm).then(()=>callback(response),()=>console.log('error'));

      
    })

  },
}


