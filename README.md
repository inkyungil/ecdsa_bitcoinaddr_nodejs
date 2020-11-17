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


/*
출력 결과: 

Private key: 150677f750d32aeb3f5fc4f911423dc067416a8092849d6d289b93a668079c3e

Public key : 23f8c3fd5e2cf43fa96e25f251f8a8cd800d7b1a4bda99761551d1632a7de7676be20371b5e3d1fd6423a15378721f6f049c0d2ea83bd41de2f5eb39bcea2646

Public key (compressed): 0223f8c3fd5e2cf43fa96e25f251f8a8cd800d7b1a4bda99761551d1632a7de767


Msg: 하이! 인경일입니다.

Msg hash: 6160211cb7352faaf39a40705e7e4031b1047c8a84a5ae0a5f25ad15c53a9bff


Signature: Signature {
  r: BN {
    negative: 0,
    words: [
      34019230, 14621981,
      27492855,   712943,
      46925343, 34576163,
      63994476, 23673030,
      52970430,  3744226
    ],
    length: 10,
    red: null
  },
  s: BN {
    negative: 0,
    words: [
      23023216, 22227993,
      53761006, 32583689,
      46363458, 64556529,
      43365978, 18405643,
        902736,   772405
    ],
    length: 10,
    red: null
  },
  recoveryParam: 0
}



Recovered pubKey: 0223f8c3fd5e2cf43fa96e25f251f8a8cd800d7b1a4bda99761551d1632a7de767

Signature valid? true

*/



구현 내용

1. ECDSA 기반 key pair (private, public key) 생성
2. 비트코인의 주소 체계와 같은 주소 생성
3. 임의의 데이터(문자열)을 private key로 signature 생성,
4. Public key를 이용하여 검증
