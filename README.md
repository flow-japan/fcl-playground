# fcl-playground

- **GetAccount**: Get the account information for any specified account address
- **Script**: Executes a simple script (read-only)
- **Authenticate**: Handles sign in/out logic with FCL wallet
- **UserInfo**: Subscribes to `fcl.currentUser()` and shows the connected user account information
- **SendTransaction**: Sends a simple transaction to Flow. This requires the signatures from the connected user
- **DeployContract**: Deploys a contract to the current user's code storage

## Special thanks

We made this based on the below projects.
https://github.com/portto/fcl-demo

https://github.com/onflow/flow-js-sdk/tree/master/examples/react-fcl-demo
