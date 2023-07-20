# facet
- 실행되는 contract 함수가 구현된 부분

## control-facet
- 컨트랙트 owner가 설정을 제어하는 facet
- function
  - setGateway: 게이트웨이 설정
  - addApprovers: 승인자 추가
  - removeApprovers: 승인자 해제
  - setBoundary: 인증 조건 설정
  - setDeployedContract: ERC-20 설정

## trasfer-facet
- gateway, approver가 transaction을 저장 및 승인하는 facet
- modifier
  - onlyGateway: 유효한 게이트웨이 확인
  - onlySigner: 유효한 승인자 확인
  - txExists: 트랜잭션 존재 확인
- function
  - addTransaction: 트랜잭션 저장
  - confirmTransaction: 트랜잭션 승인
  - (internal)executeTransaction: 트랜잭션 실행 및 삭제

## cut, loupe, ownership facet
- diamond proxy를 위한 facet
