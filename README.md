*now building
Near Payday (v1) is a dapp that can help you to send NEAR with a constant rate within a assigned time span.

Near-payday
  |- contract
  |- frontend

# Contract
## Create Near testnet account (skip if you already have one)
The following command are to manage child accounts: (the 'near' command is in "./node_modules/near-cli/bin/near", you may want to add it to PATH)
### create child account and fund (you may want three: one for contract, one for sender, and one for receiver)
near create-account ${NAME_OF_CHILD}.${NAME_OF_MAIN}.testnet --masterAccount ${NAME_OF_MAIN}.testnet --initialBalance ${NUM_OF_NEAR_TO_BE_FUNDED}
### check account details
near state ${NAME_OF_ACCOUNT}.testnet
### send NEAR
near send ${SENDER_ACCOUNT}.testnet ${RECEIVER_ACCOUNT}.testnet ${AMMOUNT_TO_SEND}

## Installation
After cloning, run the following commands to install:
cd contract/
yarn add near-cli
yarn add assemblyscript
yarn add asbuild
yarn init
yarn add -D near-sdk-as

Then use the following command to compile the program: (the 'near' command is in "./node_modules/near-cli/bin/near", you may want to add it to PATH)
yarn asb
near deploy --accountId=${ACCOUNT_ID} --wasmFile=${PATH_TO_WASM} (e.g. ./build/release/xxxx.wasm)

## Test function through CLI
Near-payday
  |- contract
        |- index.ts           dapp logics
        |- model.ts          core object for this dapp
        |- as_types.d.ts   
        |- tsconfig.json
        

