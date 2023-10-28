const Identity = require("../");

const express = require("express");

const app = express();

const HOST = "http://localhost:3001/";
const SITE = "localhost";
const CALLBACK = "http://localhost:3030/callback";
const ALCHEMY =
	"https://eth-sepolia.g.alchemy.com/v2/KXMjMNaCDSmH0KcMcaSSoYu1w7Dua2-U";

const VcInfo = [
	{
		nodeId: 1,
		expiry: 60 * 60 * 1000,
		score: 1,
	},
];

const identity = new Identity({
	alchemy: ALCHEMY,
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

app.listen(3030, async () => {
	console.log("Server is running on port ", 3030);
});
