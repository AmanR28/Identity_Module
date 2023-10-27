const Identity = require("../");

const express = require("express");

const app = express();

const HOST = "http://localhost:3001/";
const SITE = "localhost";
const CALLBACK = "http://localhost:3030/callback";

const VcInfo = [
	{
		nodeId: 1,
		expiry: 60 * 60,
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
		defaultExpiry: 60 * 60,
		defaultScore: 1,
	},
});

app.get("/", (req, res) => {
	res.send(`<a href="${identity.url}">${identity.url}</a>`);
});

app.get("/callback", (req, res) => {
	const vp = req.query.vp;
	const status = identity;
	res.send(JSON.stringify({ vp, status }));
});

app.listen(3030, async () => {
	console.log("Server is running on port ", 3030);
});
