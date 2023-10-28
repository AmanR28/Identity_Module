const crypto = require("crypto");
const ethers = require("ethers");

const verifyVcSignature = (vc, key) => {
	const data = vc.data;
	const sign = vc.sign;

	const publicKey = Buffer.from(key, "hex");

	const verify = crypto.createVerify("SHA256");
	verify.update(JSON.stringify(data));
	verify.end();

	const isVerified = verify.verify(
		{ key: publicKey, format: "der", type: "spki" },
		Buffer.from(sign, "hex")
	);

	console.log("verify", isVerified);
	return isVerified;
};

const verifyVpSignature = (vp) => {
	const data = JSON.stringify(vp.data);
	const sign = vp.sign;
	const address = vp.data.issuer;

	const recoveredAddress = ethers.verifyMessage(data, sign);

	const isValid = recoveredAddress.toLowerCase() === address.toLowerCase();
	return isValid;
};

module.exports = { verifyVcSignature, verifyVpSignature };
