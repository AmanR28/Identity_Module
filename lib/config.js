const contractAbi = require("./contract/abi.json");

const CONTRACT_ADDRESS = "0xEcdFD53eBCbD4f18a46e003b22cfb061c55da80e";
const CONTRACT_JSON_RPC_URL = "HTTP://127.0.0.1:7545";

module.exports = {
	CONTRACT: {
		ABI: contractAbi.abi,
		ADDRESS: CONTRACT_ADDRESS,
		JSON_RPC_URL: CONTRACT_JSON_RPC_URL,
	},
};
