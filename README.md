Bootstrap 3.3.7
https://www.youtube.com/watch?v=XdKv5uwEk5A&list=PLS5SEs8ZftgUNcUVXtn2KXiE1Ui9B5UrY&index=17

**Notes:**
- `truffle init`
- sudo add-apt-repository -y ppa:ethereum/ethereum
- sudo apt-get update
- sudo apt-get install ethereum
- sudo npm install -g ethereumjs-testrpc
- geth --rinkeby --rpc --rpcapi="personal,eth,network,web3,net" --ipcpath="~/Library/Ethereum/geth.ipc"
- geth --rinkeby --rpc --rpcapi="personal,eth,net,web3,net,admin,debug,txpool,clique,miner" --ipcpath="~/Library/Ethereum/geth.ipc"
- geth attach ~/Library/Ethereum/geth.ipc
- geth --rinkeby account new
- 07:15:00 in tutorial
- --allow-insecure-unlock option at the start of the node