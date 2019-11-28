# Back
To deploy corrcectly the back server you need to run the Blockchain network (Ganache) and migrate your smart-contracts(you can find the instructions in README.md to do so)
Directory connection connect the back server to our Blockchain
You need to run the initBlockchain.sh file in the Blockchain directory to deploy the Ethereum Blockchain before using the back server.

----------dans le fichier conf.js----------------
const ip = 'localhost';
const ipBlockchain = "http://127.0.0.1:8545"
--------------------------------------

#install dependecies
npm install
 

#run server
npm start


open a browser in (for example) :
 http://localhost:8080/getAccounts 
 http://localhost:8080/api/users


UTILISATION EN LOCAL:

dans server.js : 

Commenter la ligne 7 et décommenter la ligne 8.
Autrement dit: Il faut commenter "const ip = '192.168.0.23';" et décommenter  "const ip = 'localhost';"

