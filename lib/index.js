const { getNodesByIds } = require("./contract");
const {
	verifyVcSignature,
	verifyVpSignature,
} = require("./utils/crypto.utils");
class Identity {
	constructor({ host, site, callback, vp }) {
		if (!host || !site || !callback)
			throw new Error("Missing Host or Site or Callback");
		if (!vp || !vp.vc || !vp.vc.length) throw new Error("Missing Vc Data");

		this.host = host;
		this.site = site;
		this.callback = callback;

		this.defaultScore = vp.defaultScore || 1;
		this.defaultExpiry = vp.defaultExpiry || 60 * 60 * 1000;

		this.minScore = vp.minScore || 1;

		this.#setNodes(vp.vc);
	}

	async #setNodes(vcs) {
		let ids = [];
		vcs.forEach((vc) => {
			const nodeId = vc.nodeId;
			if (!nodeId) throw new Error("NodeId Required");
			ids.push(nodeId);
		});

		const nodes = await getNodesByIds(ids);

		let vcData = [];
		let mapNode = {};

		ids.forEach((id, idx) => {
			let score = vcs[idx].score || this.defaultScore;
			let expiry = vcs[idx].expiry || this.defaultExpiry;
			mapNode[id] = {
				...nodes[idx],
				score,
				expiry,
			};
			vcData.push({
				nodeId: id,
				score,
				expiry,
			});
		});

		this.mapNode = mapNode;
		this.vpData = {
			vc: vcData,
			minScore: this.minScore,
		};
	}

	getUrl() {
		return (
			this.host +
			"vp/request?" +
			"site=" +
			this.site +
			"&vp=" +
			encodeURIComponent(JSON.stringify(this.vpData)) +
			"&callback=" +
			this.callback
		);
	}

	verify(vp) {
		try {
			const vcs = vp.data.vc;
			this.#verifySignature(vp);
			this.#verifyScore(vcs);
			this.#verifyExpiry(vcs);
			this.#verifyVc(vcs);
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	#verifySignature(vp) {
		const isSignatureValid = verifyVpSignature(vp);
		if (!isSignatureValid) throw new Error("Invalid VP signature");
	}
	#verifyScore(vcs) {
		let score = 0;
		vcs.forEach((vc) => (score += this.mapNode[vc.data.nodeId].score));
		console.log("score", score);
		if (score < this.minScore) throw new Error(`Insufficient score ${score}`);
	}
	#verifyExpiry(vcs) {
		vcs.forEach((vc) => {
			const expiry = vc.data.issuedAt + this.mapNode[vc.data.nodeId].expiry;
			if (Date.now() > expiry) throw new Error("Expired VC");
		});
	}
	#verifyVc(vcs) {
		vcs.forEach((vc) => {
			const status = verifyVcSignature(vc, this.mapNode[vc.data.nodeId][3]);
			if (!status) throw new Error("Invalid signature on VC");
		});
	}
}

module.exports = Identity;
