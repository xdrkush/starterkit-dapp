# starterkit-dapp
Repo made with hardhat, next, ethers, wagmi, rainbowkit, openzepplin, ...

___

# Install

```sh
git clone https://github.com/xdrkush/starterkit-dapp.git
cd starterkit-dapp
yarn
```

### Run Blockchain localhost:8545 (hardhat)
```sh
yarn blockchain
```

### Front
(new terminal)
```sh
yarn dapp:dev
```

### Deploy contract
(new terminal)
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
