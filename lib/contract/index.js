const { ethers } = require("ethers");
const config = require("../config");

const { ADDRESS, ABI } = config.CONTRACT;

const getNodesByIds = async (url, ids) => {
	const provider = new ethers.JsonRpcProvider(url);
	const contract = new ethers.Contract(ADDRESS, ABI, provider);

	const nodes = await contract.getNodesByIds(ids);
	return nodes;
};

module.exports = {
	getNodesByIds,
};
