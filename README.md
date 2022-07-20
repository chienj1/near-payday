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
        |- model.ts          define an object for this dapp
        |- as_types.d.ts   
        |- tsconfig.json

### Functions
#### getTimeRatio(beginTime: string, endTime: string): u128[]
near call ffpay.looksrare.testnet getTimeRatio '{"beginTime":"2022-06-06T10:45:00.123456789", "endTime":"2022-06-06T20:45:00.123456789"}' --accountId=employee.looksrare.testnet
#### setPayflow(payflow: Payflow): void
near call ffpay.looksrare.testnet setPayflow '{"payflow":{"id": "1"}}' --accountId=boss.looksrare.testnet --depositYocto=100000000000000000000000
// 0.1 NEAR
#### getPayflow(id: string): Payflow | null
near view ffpay.looksrare.testnet getPayflow '{"id":"1"}' --accountId=boss.looksrare.testnet
#### getPayflows(): Payflow[]
near view ffpay.looksrare.testnet getPayflows --accountId=boss.looksrare.testnet
#### depositAssets(id: string): void
near call ffpay.looksrare.testnet depositAssets '{"id":"1"}' --accountId=boss.looksrare.testnet --depositYocto=10000000000000000000000
#### withdrawAssets(id: string, ammount: u128): void
near call ffpay.looksrare.testnet withdrawAssets '{"id":"1", "ammount":"5000000"}' --accountId=boss.looksrare.testnet
#### startPayment( id: string, beginTime: string, endTime: string,   numofpay: i32,   receiver: string ): void
near call ffpay.looksrare.testnet startPayment '{"id":"1", "beginTime":"2022-06-02T01:00:00.000000000","endTime":"2022-06-03T10:00:00.000000000", "numofpay":2, "receiver":"employee.looksrare.testnet"}' --accountId=boss.looksrare.testnet
#### killPayflow(id: string): void                              
near call ffpay.looksrare.testnet killPayflow '{"id":"1"}'  --accountId=looksrare.testnet
#### updateAvailable(beginTime: string, endTime: string, initBalance: u128, taken: u128): u128
near call ffpay.looksrare.testnet updateAvailable '{"beginTime":"2022-06-06T10:45:00.123456789", "endTime":"2022-06-06T20:45:00.123456789", "initBalance":"100", "taken":"0"}' --accountId=employee.looksrare.testnet
#### getPayment(id: string, ammount: u128): void
near call ffpay.looksrare.testnet getPayment '{"id":"1", "ammount":"50"}' --accountId=employee.looksrare.testnet
















