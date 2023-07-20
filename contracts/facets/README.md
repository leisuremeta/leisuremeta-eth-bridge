# facet
- config and logic for contract

## control-facet
- Setup config by owner
- function
  - setGateway: Setup gateway
  - addApprovers: Adds approvers
  - removeApprovers: Remove approver's permission
  - setBoundary: Setup boundary condition
  - setDeployedContract: Setup ERC-20 contract

## trasfer-facet
- Facet for transaction management
- modifier
  - onlyGateway: Check valid gateway
  - onlySigner: Check valid approver
  - txExists: Check transaction exist
- function
  - addTransaction: Add transaction
  - confirmTransaction: Confirm transaction
  - (internal)executeTransaction: Execute and remove transaction

## cut, loupe, ownership facet
- Facet for diamond proxy
