const { reposeRecord } = require("./reposeRecord");
const { getData } = require("./data");
const { expect } = require("@jest/globals");

describe("reposeRecord", () => {
	it("returns 0 when passed no sleeping guard", () => {
		expect(reposeRecord("[1518-04-16 00:04] Guard #1993 begins shift")).toBe(0);
	});
	it("returns the  correct number when passed one guard", async () => {
		const guardPattern =
			"[1518-02-10 00:01] Guard #1637 begins shift[1518-02-10 00:19] falls asleep[1518-02-10 00:20] wakes up";
		expect(reposeRecord(guardPattern)).toBe(31103);
	});
	it("returns the correct number for the sleepiest guard when passed two guards", () => {
		let guardPattern =
			"[1518-02-10 00:01] Guard #1637 begins shift[1518-02-10 00:19] falls asleep[1518-02-10 00:20] wakes up[1518-02-10 00:30] Guard #2 begins shift[1518-02-10 00:35] falls asleep[1518-02-10 00:40] wakes up";
		expect(reposeRecord(guardPattern)).toBe(78);
		guardPattern =
			"[1518-02-10 00:01] Guard #2 begins shift[1518-02-10 00:35] falls asleep[1518-02-10 00:40] wakes up[1518-02-10 00:41] Guard #1637 begins shift[1518-02-10 00:49] falls asleep[1518-02-10 00:50] wakes up";
		expect(reposeRecord(guardPattern)).toBe(78);
	});
	it("returns the correct number for the sleepiest guard when passed two guards who have multiple shifts", () => {
		const guardPattern =
			"[1518-02-10 00:01] Guard #1637 begins shift[1518-02-10 00:19] falls asleep[1518-02-10 00:20] wakes up[1518-02-10 00:30] Guard #2 begins shift[1518-02-10 00:40] falls asleep[1518-02-10 00:41] wakes up[1518-02-11 00:30] Guard #2 begins shift[1518-02-11 00:35] falls asleep[1518-02-11 00:40] wakes up [1518-02-12 00:30] Guard #2 begins shift[1518-02-12 00:35] falls asleep[1518-02-12 00:40] wakes up";
		expect(reposeRecord(guardPattern)).toBe(78);
	});
	it("CHANGE ME", async () => {
		const data = await getData();
		expect(reposeRecord(data)).toBe(146622);
	});
});
