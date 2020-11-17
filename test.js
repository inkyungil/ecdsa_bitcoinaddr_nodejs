let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');

let keyPair = ec.genKeyPair();
let privKey = keyPair.getPrivate("hex");
let pubKey = keyPair.getPublic();
console.log(`Private key: ${privKey}`);
console.log("Public key :", pubKey.encode("hex").substr(2));
console.log("Public key (compressed):",
    pubKey.encodeCompressed("hex"));

console.log();

let msg = '하이! 인경일입니다.';
let msgHash = sha3.keccak256(msg);
let signature = ec.sign(msgHash, privKey, "hex", {canonical: true});
console.log(`Msg: ${msg}`);
console.log(`Msg hash: ${msgHash}`);
console.log("Signature:", signature);

console.log();

let hexToDecimal = (x) => ec.keyFromPrivate(x, "hex").getPrivate().toString(10);
let pubKeyRecovered = ec.recoverPubKey(
    hexToDecimal(msgHash), signature, signature.recoveryParam, "hex");
console.log("Recovered pubKey:", pubKeyRecovered.encodeCompressed("hex"));

let validSig = ec.verify(msgHash, signature, pubKeyRecovered);
console.log("Signature valid?", validSig);



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