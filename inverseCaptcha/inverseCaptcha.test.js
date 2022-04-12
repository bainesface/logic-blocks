const inverseCaptcha = require("./inverseCaptcha");

describe("inverseCaptcha", () => {
	test("returns 0 when no digits match the next", () => {
		expect(inverseCaptcha(1234)).toBe(0);
	});

	test("returns the sum of matched numbers", () => {
		expect(inverseCaptcha(1122)).toBe(3);
	});
	test("returns the sum of matched numbers including matches from the end to the beginning", () => {
		expect(inverseCaptcha(1111)).toBe(4);
		expect(inverseCaptcha(91212129)).toBe(9);
	});
});
