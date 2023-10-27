const { getNodesByIds } = require("./contract");

class Identity {
	constructor({ host, site, callback, vp }) {
		if (!host || !site || !callback)
			throw new Error("Missing Host or Site or Callback");
		if (!vp || !vp.vc || !vp.vc.length) throw new Error("Missing Vc Data");

		this.host = host;
		this.site = site;
		this.callback = callback;

		this.defaultScore = vp.defaultScore || 1;
		this.defaultExpiry = vp.defaultExpiry || 60 * 60;

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
		this.vp = {
			vc: vcData,
			minScore: this.minScore,
		};

		this.url = this.#genUrl();
	}

	#genUrl() {
		const url =
			this.host +
			"vp/request?" +
			"site=" +
			this.site +
			"&vp=" +
			JSON.stringify(this.vp) +
			"&callback=" +
			this.callback;

		return url;
	}

	verify(vp) {
		console.log(vp);
	}
}

module.exports = Identity;
