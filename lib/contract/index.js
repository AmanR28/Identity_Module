const { ethers } = require("ethers");
const config = require("../config");

const { ADDRESS, ABI, JSON_RPC_URL } = config.CONTRACT;
const provider = new ethers.JsonRpcProvider(JSON_RPC_URL);
const contract = new ethers.Contract(ADDRESS, ABI, provider);

const getNodesByIds = async (ids) => {
	const nodes = await contract.getNodesByIds(ids);
	return nodes;
};

module.exports = {
	getNodesByIds,
};
