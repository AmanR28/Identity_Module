const contractAbi = require("./contract/abi.json");

const CONTRACT_ADDRESS = "0x6F4C6cDFf36c57680d1aE9A86244786935869D49";

module.exports = {
	CONTRACT: {
		ABI: contractAbi.abi,
		ADDRESS: CONTRACT_ADDRESS,
	},
};
