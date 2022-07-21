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

## On-chain contract
The contract already deployed is called "ffpay.looksrare.testnet."

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

## Source codes
contract
  |- assembly  
        |- index.ts          dapp logics  
        |- model.ts          define an object for this dapp  
        |- as_types.d.ts     
        |- tsconfig.json  

### Functions
1. Replace "ffpay.looksrare.testnet" with your own contract name if you want to test the one you deployed yourself  
2. All datetime should be formatted into ISO8601 and be presented in UTC timezone: yyyy-mm-ddThh:mm:ss (capital T is required to separate "date" and "time")  

#### getTimeRatio(beginTime: string, endTime: string): u128[]
Return a list of [nomiator, denominator] so that you can compute the time passed during payment by nomiator/denominator.  
`near call ffpay.looksrare.testnet getTimeRatio '{"beginTime":"2023-04-05T06:12:34.123456789", "endTime":"2023-04-05T07:12:34.123456789"}' --  accountId=${YOUR_ACCOUNT}`  
#### setPayflow(payflow: Payflow): void  
Create a job. First deposition is required.  
`near call ffpay.looksrare.testnet setPayflow '{"payflow":{"id": "1"}}' --accountId=${SENDER_ACCOUNT} --depositYocto=1000000000000000000000000  // 1.0 NEAR`  
#### getPayflow(id: string): Payflow | null
Return a job with id.  
`near view ffpay.looksrare.testnet getPayflow '{"id":"1"}' --accountId=${YOUR_ACCOUNT}`
#### getPayflows(): Payflow[]
Return all existing jobs.  
`near view ffpay.looksrare.testnet getPayflows --accountId=${YOUR_ACCOUNT}`
#### depositAssets(id: string): void
Deposit more into a existing job.  
`near call ffpay.looksrare.testnet depositAssets '{"id":"1"}' --accountId=${SENDER_ACCOUNT} --depositYocto=10000000000000000000000`
#### withdrawAssets(id: string, ammount: u128): void
Withdraw from a existing job.  
`near call ffpay.looksrare.testnet withdrawAssets '{"id":"1", "ammount":"5000000"}' --accountId=${SENDER_ACCOUNT}`
#### startPayment( id: string, beginTime: string, endTime: string, numofpay: i32, receiver: string ): void  
Set up the time span of paying, the receiver account, a placeholder. No modification or cancellation is available after the job starts.  
`near call ffpay.looksrare.testnet startPayment '{"id":"1", "beginTime":"2022-06-02T01:00:00.000000000","endTime":"2022-06-03T10:00:00.000000000", "numofpay":2, "receiver":"employee.looksrare.testnet"}' --accountId=${SENDER_ACCOUNT}`
#### killPayflow(id: string): void
Remove a non-start job.  
`near call ffpay.looksrare.testnet killPayflow '{"id":"1"}'  --accountId=${YOUR_ACCOUNT}`
#### updateAvailable(beginTime: string, endTime: string, initBalance: u128, taken: u128): u128
To know how much is currently available to withdraw.  
`near call ffpay.looksrare.testnet updateAvailable '{"beginTime":"2022-06-06T10:45:00.123456789", "endTime":"2022-06-06T20:45:00.123456789", "initBalance":"100", "taken":"0"}' --accountId=${YOUR_ACCOUNT}`
#### getPayment(id: string, ammount: u128): void
Claim the available ammount of pay.  
`near call ffpay.looksrare.testnet getPayment '{"id":"1", "ammount":"50"}' --accountId=${RECIEVER_ACCOUNT}`
















