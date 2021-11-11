const { v4: uuidv4 } = require("uuid");
const params = (fileName) => {
	const myFile = fileName.originalname.split(".");
	const fileType = myFile[myFile.length - 1];

	const imageParams = {
		Bucket: "user-images-2cad34ab-e2e9-4bdd-bc8c-fbdd2d60937e",
		Key: `${uuidv4()}.${fileType}`,
		Body: fileName.buffer,
	};

	return imageParams;
};
module.exports = params;
