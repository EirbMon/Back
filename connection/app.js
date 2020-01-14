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
        console.log("error with account");
      }
    });
    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        console.log(err.message);
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
    }).then(function(eirbmonsCount) {
      var response = [];
      var tabProm = [];
      for (var i = 1; i <= eirbmonsCount; i++) {
        tabProm[i] = eirbmonInstance._Eirbmons(i);
        tabProm[i].then(function(pokemon) {
          if(account.toLowerCase() == pokemon[2].toLowerCase()){
            response.push(pokemon);
          }
         })
      }
      Promise.all(tabProm).then(()=>callback(response),()=>console.log('error'));
    })

  },
  getEirbmonWithoutOwner: function(callback) {
    var self = this;

    // Bootstrap the Eirbmon abstraction for Use.
    Eirbmon.setProvider(self.web3.currentProvider);

    Eirbmon.deployed().then(function(instance) {
      eirbmonInstance = instance;
      return eirbmonInstance.getEirbmonCount();
    }).then(function(eirbmonsCount) {
      var response = [];
      var tabProm = [];
      var breakFor = false;
      for (var i = 1; i <= eirbmonsCount; i++) {
        tabProm[i] = eirbmonInstance._Eirbmons(i);
        tabProm[i].then(function(pokemon) {
          if("0x0000000000000000000000000000000000000000".toLowerCase() == pokemon[2].toLowerCase()){
            response.push(pokemon);
            console.log(breakFor);
          }
         })
         if(breakFor)
          break;
      }
      Promise.all(tabProm).then(()=>callback(response[0]),()=>console.log('error'));
    })

  },
  getAllEirbmons: function(callback) {
    var self = this;
    Eirbmon.setProvider(self.web3.currentProvider);
    Eirbmon.deployed().then(function(instance) {
      eirbmonInstance = instance;
      return eirbmonInstance.getEirbmonCount();
    }).then(function(eirbmonsCount) {
      var response = [];
      var tabProm = [];
      for (var i = 1; i <= eirbmonsCount; i++) {
        tabProm[i] = eirbmonInstance._Eirbmons(i);
        tabProm[i].then(function(pokemon) {
            response.push(pokemon);
         })
      }
      Promise.all(tabProm).then(()=>callback(response),()=>console.log('error'));
    })

  },
  getEirbmonById: function(idEirbmon,callback) {
    var self = this;
    Eirbmon.setProvider(self.web3.currentProvider);
    Eirbmon.deployed().then((instance) =>{
      eirbmonInstance = instance;
      return eirbmonInstance._Eirbmons(idEirbmon);
    }).then(_Eirbmon=>{
       callback([_Eirbmon])
    })
  },

  parseEirbmon : function(Eirbmons,callback){
    var parseEirbmonTab = [];
    var tabProm = [];
    Eirbmon.deployed().then((instance) =>{
      return instance;
    }).then(eirbmonInstance=>{
      Eirbmons.forEach(element => {
        var prom = eirbmonInstance.getAtks(element[0].toNumber())
        tabProm.push(prom)
        prom.then(atk=>{
          parseEirbmonTab.push({
            id : element[0].toNumber(),
            name : element[1],
            owner : element[2],
            evolve : element[3].toNumber(),
            field : element[4], 
            atk : [atk[0].toNumber(),atk[1].toNumber(),atk[2].toNumber()],
            hp : element[5].toNumber(),
            canBeExhangedTo : element[6].toNumber(),
            price : element[7].toNumber(),
            canBeSelled : element[8],
            value : element[9].toNumber(),
            birthDate : element[10].toNumber(),
          })
        })
        
      });
      Promise.all(tabProm).then(()=>{console.log("parseEirbmonTab");callback(parseEirbmonTab)},()=>console.log('error'));
    })


  },

  _getEirbmonCount:function(callback){
    var self = this;
    Eirbmon.setProvider(self.web3.currentProvider);
    Eirbmon.deployed().then((instance) =>{
      eirbmonInstance = instance;
      return eirbmonInstance.getEirbmonCount();
    }).then(count=>{
       callback(count)
    })
  }
}


