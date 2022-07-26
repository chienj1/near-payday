*now building  
Near Payday (v1) is a dapp that can help you to send NEAR with a delayed, constant rate within a assigned time span.  

There are two parts in this project: smart contract and the corresponding React frontend. Click the link below for description.
  - ROOT of project  
    - [frontend](https://github.com/chienj1/near-payday/edit/main/README.md#Front-end)
    - [contract](https://github.com/chienj1/near-payday/edit/main/README.md#Contract)
    - doc

# Front-end
The website is accessible [here](https://chienj1.github.io/near-payday/)

create a .env file and add Contractname=...
 src/utils/config.js
 const CONTRACT_NAME = process.env.CONTRACT_NAME || "${CONTRACT_NAME}";
https://chienj1.github.io/near-payday.



# Contract
1. A contract can be interact through `near-cli` or through a front-end, whose code is provided in ./frontend.  
2. Install `near-cli` with `yarn add near-cli` (or `yarn global add near-cli` if you want to install globally)    
3. the 'near' command is in "./node_modules/near-cli/bin/near", you may want to add it to PATH. 
4. The deployed contract is called `ffpay.looksrare.testnet`. 

## Installation
After cloning, run the following commands to install:  
```
cd contract/  
yarn init 
yarn add near-cli        
yarn add assemblyscript  
yarn add asbuild  
yarn add -D near-sdk-as  
```
Then use the following command to compile and deploy the program on NEAR testnet:   
```
yarn asb  
near deploy --accountId=${CONTRACT_ACCOUNT} --wasmFile=${PATH_TO_WASM} (e.g. ./build/release/xxxx.wasm)  
```
## Create Near testnet account (skip if you already have one)
The following command are to manage child accounts:  
### create child account and fund (you may want three: one for contract, one for sender, and one for receiver)
`near create-account ${NAME_OF_CHILD}.${NAME_OF_MAIN}.testnet --masterAccount ${NAME_OF_MAIN}.testnet --initialBalance ${NUM_OF_NEAR_TO_BE_FUNDED}`
### check account details
`near state ${NAME_OF_ACCOUNT}.testnet`
### send NEAR
`near send ${SENDER_ACCOUNT}.testnet ${RECEIVER_ACCOUNT}.testnet ${AMMOUNT_TO_SEND}`

## Source codes
  - contract  
    - assembly  
      - index.ts          (dapp logics)
      - model.ts          (define an object for this dapp)
      - as_types.d.ts     
      - tsconfig.json
        
### Functions
1. All datetime should be formatted into ISO8601 and be presented in UTC timezone: yyyy-mm-ddThh:mm:ss (capital T is required to separate "date" and "time")  
2. Functions has limited accessibility considering the account's status and the time right now. Please refer to source codes or returned message from blockchain.
3. The dapp workflow is as below. Not all functions are included.

![image](https://github.com/chienj1/near-payday/blob/main/doc/workflow.png)

#### getTimeRatio(beginTime: string, endTime: string): u128[]
Return a list of [nominator, denominator] so that you can compute the time passed during payment by nomiator/denominator. If the end time is already passed, it will return [1, 1].  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet getTimeRatio '{"beginTime":"2023-04-05T06:12:34.123456789", "endTime":"2023-04-05T07:12:34.123456789"}' --  accountId=${YOUR_ACCOUNT}`  
#### setPayflow(payflow: Payflow): void  
Create a job. First deposition is required.  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet setPayflow '{"payflow":{"id": "123"}}' --accountId=${SENDER_ACCOUNT} --depositYocto=1000000000000000000000000  // 1.0 NEAR`  
#### getPayflow(id: string): Payflow | null
Return a job with id.  
e.g. `near view ${CONTRACT_ACCOUNT}.testnet getPayflow '{"id":"123"}' --accountId=${YOUR_ACCOUNT}`
#### getPayflows(): Payflow[]
Return all existing jobs.  
e.g. `near view ${CONTRACT_ACCOUNT}.testnet getPayflows --accountId=${YOUR_ACCOUNT}`
#### depositAssets(id: string): void
Deposit more into a existing job.  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet depositAssets '{"id":"123"}' --accountId=${SENDER_ACCOUNT} --depositYocto=10000000000000000000000`
#### withdrawAssets(id: string, ammount: u128): void
Withdraw from a existing job.  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet withdrawAssets '{"id":"123", "ammount":"5000000"}' --accountId=${SENDER_ACCOUNT}`
#### startPayment( id: string, beginTime: string, endTime: string, numofpay: i32, receiver: string ): void  
Set up the time span of paying, the receiver account, a placeholder. No modification or cancellation is available after the job starts.  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet startPayment '{"id":"123", "beginTime":"2023-04-05T06:12:34.123456789","endTime":"2023-04-05T07:12:34.123456789", "numofpay":2, "receiver":"employee.looksrare.testnet"}' --accountId=${SENDER_ACCOUNT}`
#### killPayflow(id: string): void
Remove a non-start job.  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet killPayflow '{"id":"123"}'  --accountId=${YOUR_ACCOUNT}`
#### updateAvailable(beginTime: string, endTime: string, initBalance: u128, taken: u128): u128
To know how much is currently available to withdraw.  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet updateAvailable '{"beginTime":"2023-04-05T06:12:34.123456789", "endTime":"2023-04-05T07:12:34.123456789", "initBalance":"100", "taken":"0"}' --accountId=${YOUR_ACCOUNT}`
#### getPayment(id: string, ammount: u128): void
Claim the available ammount of pay.  
e.g. `near call ${CONTRACT_ACCOUNT}.testnet getPayment '{"id":"123", "ammount":"500000000"}' --accountId=${RECIEVER_ACCOUNT}`




