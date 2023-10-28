const Identity = require("../");

const express = require("express");

const app = express();

const HOST = "http://localhost:3001/";
const SITE = "localhost";
const CALLBACK = "http://localhost:3030/callback";

const VcInfo = [
	{
		nodeId: 6,
		expiry: 60 * 60 * 1000,
		score: 1,
	},
];

const identity = new Identity({
	host: HOST,
	site: SITE,
	callback: CALLBACK,
	vp: {
		vc: VcInfo, // Req
		minScore: 1,
		defaultExpiry: 60 * 60 * 1000,
		defaultScore: 1,
	},
});

app.get("/", (req, res) => {
	res.send(
		`<a href="${identity.getUrl()}" target="_blank">${identity.getUrl()}</a>`
	);
});

app.get("/callback", (req, res) => {
	const vp = JSON.parse(decodeURIComponent(req.query.vp));

	const verify = identity.verify(vp);

	let vcData = "<ui>";
	vp.data.vc.forEach((v) => {
		vcData += `<li>Node: ${v.data.nodeId} | Identifier: ${v.data.identifier} | Issued At: ${v.data.issuedAt}</li>`;
	});
	vcData += `</ui>`;

	res.send(`
	<html><body>
	<h1>Received VP</h1>
	${vcData}
	<h3>Verified: ${verify}</h3>
	</body></html>
	`);
});

const crypto = require("crypto");

app.listen(3030, async () => {
	console.log("Server is running on port ", 3030);

	const RAW_VP = `%7B"data"%3A%7B"vc"%3A%5B%7B"data"%3A%7B"nodeId"%3A"6"%2C"identifier"%3A"102590703358000716698"%2C"address"%3A"0xb433e4ac3967101524f35bfc48113c200b1c2430"%2C"issuedAt"%3A1698509377915%7D%2C"sign"%3A"7b091bbcc878d6d35dccd484a514bff30846a1e11c41777680e86e6f36504e1209e85c628d4abae8e437e81a942791355531dbf71804e18da819184cddacca058eae1a8f6a0dcee5252d54beeb608c370600b171b5a5c0f17c33dde936a407196cd31f5405918eec6d985dea13367edaf4610d17748ed0c2b6fef28ec4a0671509ee2763e8da9ed50de9223e7f8bef7c9f6bfe35531e8f46001b85ce960db4ac58a9a6932691c8c32ba89ba60185eaae95137f55ac10f63b207330f8b010fc723559ba47ed11a8558a041f014ee67999dccea65f91590d2fd71f30a8e50dcd52dce9c8a674dca730ea85d7230e0c86e928d1241453179c3edc52c4972d224ba5"%7D%5D%2C"site"%3A"localhost"%2C"issuedAt"%3A"2023-10-28T16%3A10%3A31.967Z"%7D%2C"sign"%3A"sign"%7D`;

	const KEY = `30820122300d06092a864886f70d01010105000382010f003082010a0282010100b53b510c968072affeac36105112ab2cb358acfecbf2382fb0393112b2bf8f7047668be8993c458f01b0ee96fc45c142ae5cd70aa93ecc1fbe8a96c7fea01357f0f7a069ea226fee0e53ddb5d9f8ac2052d398bec1130fb050c0a34e41beffdbc2d60d630f52437317e99c8a0d317282e734d2fb8a0fce43fdae603f754b6eee8ad7918a354983672d80a76df8272f7c785e81c9b9d88aa1097dc8bc5a3f138a780871473c1d41851f7f7c3512596ec59823510a15e716c6d4f33057cc5407c2c237faa4b782bea4056039b58a803642607ff0f8ec5e5838820fa7fa32aae42fb82e3eebdcfff78a6f583dc363c32223213fa37c7a79adafae0fc1e2c9abbec90203010001`;

	const vp = JSON.parse(decodeURIComponent(RAW_VP));

	const vc = vp.data.vc[0];

	const vcData = vc.data;
	const vcSign = vc.sign;

	const publicKey = Buffer.from(KEY, "hex");

	const verify = crypto.createVerify("SHA256");
	verify.update(JSON.stringify(vcData));
	verify.end();
	const isVerified = verify.verify(
		{ key: publicKey, format: "der", type: "spki" },
		Buffer.from(vcSign, "hex")
	);
	console.log("verify", isVerified);
});
