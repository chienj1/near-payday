now building

# Contract
After cloning, run the following commands to install:
cd contract/
yarn add near-cli
yarn add assemblyscript
yarn add asbuild
yarn init
yarn add -D near-sdk-as

Then use the following command to compile the program:
yarn asb
near deploy --accountId=${ACCOUNT_ID} --wasmFile=${PATH_TO_WASM} (e.g. build/release/xxxx.wasm)