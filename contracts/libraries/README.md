# libraries
- Common lib in contract

## lib-app-store
- custom facet lib
- struct
  - Transaction: transaction info
  - AppStorage: common storage
- function
  - appStorage: Get storage
  - setGateway: Setup gateway config
  - setBoundary: Setup boundary condition
  - addApprovers: Adds approvers
  - removeApprovers: Remove approver's permission
  - setDeployedContract: Setup ERC-20 contract
  - addTransaction: Add transaction
  - removeTransaction: Remove transaction

## lib-diamond
- diamond proxy lib
