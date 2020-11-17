var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const crypto = require('crypto');
const EC = require('elliptic').ec;
const RIPEMD160 = require('ripemd160');
const bs58 = require('bs58');
const buffer = require('buffer');
const ec = new EC('secp256k1');
const elliptic = require('elliptic');
const sha3     = require('js-sha3');



function hasha256(data) {
    return crypto.createHash('sha256').update(data).digest();
} 



 

app.post("/data.json", function (request, response) {

	//외부에서 호출시 OPEN
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.type("application/json");



	const addrVer = Buffer.alloc(1, 0x00); // 0x00 P2PKH Mainnet, 0x6f P2PKH Testnet
	const wifByte = Buffer.alloc(1, 0x80); // 0x80 Mainnet, 0xEF Testnet


	var key = ec.genKeyPair();
	var privKey = key.getPrivate().toString('hex');
	var pubPoint = key.getPublic();

	var x = pubPoint.getX(); // elliptic x
	var y = pubPoint.getY(); // elliptic y
	var bufPrivKey = Buffer.from(privKey, 'hex');
	var wifBufPriv = Buffer.concat([wifByte, bufPrivKey], wifByte.length + bufPrivKey.length);
	var wifHashFirst = hasha256(wifBufPriv);
	var wifHashSecond = hasha256(wifHashFirst);
	var wifHashSig = wifHashSecond.slice(0, 4);
	var wifBuf = Buffer.concat([wifBufPriv, wifHashSig], wifBufPriv.length + wifHashSig.length);
	var wifFinal = bs58.encode(wifBuf);
	var publicKey = pubPoint.encode('hex');
	var publicKeyInitialHash = hasha256(Buffer.from(publicKey, 'hex'));
	var publicKeyRIPEHash = new RIPEMD160().update(Buffer.from(publicKeyInitialHash, 'hex')).digest('hex');

	var hashBuffer = Buffer.from(publicKeyRIPEHash, 'hex');
	var concatHash = Buffer.concat([addrVer, hashBuffer], addrVer.length + hashBuffer.length);
	var hashExtRipe = hasha256(concatHash);
	var hashExtRipe2 = hasha256(hashExtRipe);
	var hashSig = hashExtRipe2.slice(0, 4);
	var bitcoinBinaryStr = Buffer.concat([concatHash, hashSig], concatHash.length + hashSig.length);
	var bitcoinWifAddress = wifFinal.toString('hex');
	var bitcoinAddress = bs58.encode(Buffer.from(bitcoinBinaryStr));


	/*
	1. ECDSA 기반 key pair (private, public key) 생성

	console.log("publicKey Key : %s", publicKey );
	console.log("private Key : %s", privKey );

	2. 비트코인의 주소 체계와 같은 주소 생성
	console.log("Bitcoin Address : %s", bitcoinAddress.toString('hex'));

	*/

	var items = {
	   publicKey : publicKey, 
	   privKey     : privKey, 
	   WIF_PrivateKey      : bitcoinWifAddress.toString('hex'), 
	   bitcoinAddress      : bitcoinAddress.toString('hex'), 


	};


    response.send(JSON.stringify(items));

});


app.post("/data_signature.json", function (request, response) {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.type("application/json");

	var publicKey = request.body.publicKey ;
	var privKey = request.body.privateKey ;
	var bitcoinWifAddress = request.body.WIF_PrivateKey ;
	var bitcoinAddress = request.body.bitcoinAddr ;
	var sgMsg = request.body.sgMsg ;



	/**
	3. 임의의 데이터(문자열)을 private key로 signature 생성
       * 임의의 데이터는 html에서 입력받음

	console.log('Msg:'+ msg);
	console.log('Msg hash:'+msgHash);
	console.log("Signature:", signature);

	**/




	//let msg      = '하이! 인경일입니다.';

	let msg      = sgMsg ;
	let msgHash = sha3.keccak256(msg);
	let signature = ec.sign(msgHash, privKey, "hex", {canonical: true});





	/*
	4. Public key를 이용하여 검증

	console.log("pubKey (복구):", pubKeyRecovered.encodeCompressed("hex"));
	*/



	let hexToDecimal = (x) => ec.keyFromPrivate(x, "hex").getPrivate().toString(10);
	let pubKeyRecovered = ec.recoverPubKey(
		hexToDecimal(msgHash), signature, signature.recoveryParam, "hex");

	let validSig = ec.verify(msgHash, signature, pubKeyRecovered);


	// console.log("서명 유효성 체크: ", validSig);

	/*

	실행 OUT PUT

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



	html에 출력하기 위해 json 형식으로 변환
	*/
	var items = {
	   publicKey		   : publicKey, 
	   privKey			   : privKey, 
	   WIF_PrivateKey      : bitcoinWifAddress, 
	   bitcoinAddress      : bitcoinAddress, 
	   msg				   : msg, 
	   msgHash			   : msgHash, 
	   pubKeyRecovered     : pubKeyRecovered.encodeCompressed("hex"), 
	   validSig			   : validSig, 

	};


    response.send(JSON.stringify(items));

});





app.listen(3000, function(){
    console.log("App is running on port 3000");
});

app.get("/", function(req, res){
    res.sendfile("index.html");
});