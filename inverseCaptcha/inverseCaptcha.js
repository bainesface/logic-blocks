const inverseCaptcha = (num) => {
	const nums = num.toString();
	let sum = 0;

	const lastInd = nums.length - 1;

	for (let i = 0; i < nums.length; i++) {
		if (nums[i] === nums[i + 1]) {
			sum += +nums[i];
		}
	}

	if (nums[lastInd] === nums[0]) {
		sum += +nums[lastInd];
	}

	return sum;
};

module.exports = inverseCaptcha;
