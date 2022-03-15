const fs = require("fs/promises");

exports.getData = async () => {
	const data = await fs.readFile(
		"/Users/baines/Desktop/learn/logic-blocks/reposeRecord/data.txt",
		"utf8"
	);
	return data;
};
