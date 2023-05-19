# StarterKit-dApp
Repo made with hardhat, next, ethers, wagmi, rainbowkit, openzepplin, ...

___

# Install
```sh
git clone https://github.com/xdrkush/starterkit-dapp.git
cd starterkit-dapp
yarn
```
Or in 1 line
```sh
git clone https://github.com/xdrkush/starterkit-dapp.git; cd starterkit-dapp; yarn;
```

#### Run Blockchain localhost:8545 (hardhat)
```sh
yarn blockchain
```

#### Run Front
(new terminal), ctrl+shift+t
```sh
yarn dapp:dev
```

#### Run Test / Deploy contract / ...
(new terminal), ctrl+shift+t
```sh
yarn sc:test
yarn sc:deploy:local
```
____

# Create architecture
```shell
mkdir starterkit-dapp
cd  starterkit-dapp
mkdir hardhat-project
cd hardhat-project
npx hardhat
cd ..
npx create-next-app dapp
```
Or in 1 line
```sh
mkdir starterkit-dapp; cd  starterkit-dapp; mkdir hardhat-project; cd hardhat-project; npx hardhat; cd ..; npx create-next-app dapp;
```

#### About
  - [Workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces) is created in `./packages` for manage multi-packages node easily.

#### Docs
  - [NextJs](https://nextjs.org/) 
  - [Chakra-UI](https://chakra-ui.com/) 
  - [Hardhat](https://hardhat.org/) 
  - [Ethers.js](https://docs.ethers.org/v5/) 
  - [Wagmi](https://wagmi.sh/)
  - [Rainbow-Kit](https://www.rainbowkit.com/)  
  - [Solidity](https://soliditylang.org/)

___

###### Create By [xDrKush](https://github.com/xdrkush)
