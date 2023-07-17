# libraries
- contract 내에서 공통으로 사용하는 lib

## lib-app-store
- custom facet lib
- struct
  - Transaction: 인증 및 완료 후 실행할 트랜잭션 정보
  - AppStorage: facet들에서 참조하는 공용 storage
- function
  - appStorage: 저장소 불러오기
  - setGateway: 게이트웨이 설정
  - setBoundary: 인증 조건 설정
  - addApprovers: 승인자 추가
  - removeApprovers: 승인자 해제
  - setDeployedContract: ERC-20 설정
  - addTransaction: 트랜잭션 추가
  - removeTransaction: 트랜잭션 삭제

## lib-diamond
- diamond proxy를 위한 lib
