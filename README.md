# ecdsa_bitcoinaddr_nodejs

node.js로 구성하였습니다.

웹서버 구동방법은 node main.js 로 실행하시면 됩니다.

main.js는 express으로 간단한 웹서버를 구성하여 사용자 화면에서 볼 수 있게 구현하였습니다.

웹 화면에서 볼 수 있게 아래 주소 공유합니다.

접속 주소 : http://211.47.68.134:3000/
1. 생성하기 버튼 클릭
2. Message를 입력후 사인하기 버튼을 클릭

main.js 파일에서는 웹서버 및 기타 로직이 있어 복잡할 수 있어 아래 파일을 하나더 만들었습니다.
test.js 

구동 방법은 node test.js 입니다.


구현 내용

1. ECDSA 기반 key pair (private, public key) 생성
2. 비트코인의 주소 체계와 같은 주소 생성
3. 임의의 데이터(문자열)을 private key로 signature 생성,
4. Public key를 이용하여 검증
