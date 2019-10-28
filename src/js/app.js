App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();},

  initWeb3: function() {

  // TODO: refactor conditional
  if (typeof web3 !== 'undefined') {
    // If a web3 instance is already provided by Meta Mask.
    App.web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);
  } else {
    // Specify default instance if no web3 instance provided
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
  }
  return App.initContract();
},

  initContract: function() {
    $.getJSON("Eirbmon.json", function(eirbmon) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Eirbmon = TruffleContract(eirbmon);
      // Connect provider to interact with contract
      App.contracts.Eirbmon.setProvider(App.web3Provider);

      return App.render();
    });

  },

  render: function() {
    var eirbmonInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        console.log(account);

        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Eirbmon.deployed().then(function(instance) {
      eirbmonInstance = instance;
      return eirbmonInstance.pokemonsCount();
    }).then(function(pokemonsCount) {
      var pokemonsResults = $("#pokemonsResults");
      pokemonsResults.empty();

      // var pokemonSelect = $('#pokemonSelect');
      // pokemonSelect.empty();

      for (var i = 1; i <= pokemonsCount; i++) {
        eirbmonInstance.pokemons(i).then(function(pokemon) {
          var id = pokemon[0];
          var name = pokemon[1];
          var pokemonAccount = pokemon[2];
          var level = pokemon[3];

          // Render candidate Result
          var pokemonTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" +pokemonAccount + "</td><td>" + level + "</td></tr>"
          pokemonsResults.append(pokemonTemplate);

         });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});