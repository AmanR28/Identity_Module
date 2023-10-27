const contractAbi = require("./contract/abi.json");

const CONTRACT_ADDRESS = "0x0d0c0c08b04737d1423d2d6650b9de82c3f11a93";
const CONTRACT_JSON_RPC_URL = "HTTP://127.0.0.1:7545";

module.exports = {
	CONTRACT: {
		ABI: contractAbi.abi,
		ADDRESS: CONTRACT_ADDRESS,
		JSON_RPC_URL: CONTRACT_JSON_RPC_URL,
	},
};
