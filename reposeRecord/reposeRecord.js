const { getData } = require("./data");

// Part (Strategy) 1
exports.reposeRecord = (data) => {
	const sortedUpdates = sortUpdates(data);
	const record = makeRecord(sortedUpdates);
	const sleepyGuard = findSleepiestGuard(record);
	// return zero if none sleeping
	if (!sleepyGuard) return 0;

	// finding the most frequent sleepy slot
	const mostFrequentTime = findSleepiestTime(record[sleepyGuard].minsAsleep);

	return +sleepyGuard * mostFrequentTime;
};

// Part (Strategy) 2
exports.getGuardId = async () => {
	const data = await getData();
	const sortedData = sortUpdates(data);
	const record = makeRecord(sortedData);
	const updatedRecord = addSleepiestMins(record);
	const sleepyGuard = getSleepyGuard(updatedRecord);

	return sleepyGuard * record[sleepyGuard].sleepiestMin;
};

// Additional Funcs Used
const sortUpdates = (data) => {
	const guardUpdates = data.split("[");
	guardUpdates.shift();
	const sepUpdates = guardUpdates.map((update) => {
		const sepDates = update.split("] ");
		return sepDates;
	});
	const orderedUpdates = sepUpdates.sort((date1, date2) => {
		return new Date(date1[0]) - new Date(date2[0]);
	});
	return orderedUpdates;
};

const makeRecord = (updates) => {
	const record = {};
	let currentGuard = 0;
	updates.forEach((update) => {
		let guardNum = update[1].match(/\d/g);
		if (guardNum) {
			guardNum = guardNum.join("");
			currentGuard = guardNum;
			if (!record[guardNum]) {
				record[guardNum] = {
					sleepyTime: 0,
					minsAsleep: [],
					totalSleep: 0,
				};
			}
		}
		const [time] = update[0].match(/:\d{2}/);
		const min = +time.slice(1);

		const isAsleep = /(falls asleep)/.test(update[1]);
		if (isAsleep) record[currentGuard].sleepyTime = min;

		const isAwake = /(wakes up)/.test(update[1]);
		if (isAwake) {
			const lastSleepTime = record[currentGuard].sleepyTime;
			for (let i = lastSleepTime; i < min; i++) {
				record[currentGuard].minsAsleep.push(i);
			}
			record[currentGuard].totalSleep += min - lastSleepTime;
		}
	});
	return record;
};

const findSleepiestGuard = (record) => {
	let mostSleep = 0;
	let sleepyGuard;

	for (let guard in record) {
		if (record[guard].totalSleep > mostSleep) {
			mostSleep = record[guard].totalSleep;
			sleepyGuard = guard;
		}
	}
	return sleepyGuard;
};

const findSleepiestTime = (minsAsleep) => {
	const times = minsAsleep.reduce((timesSoFar, currTime) => {
		if (!timesSoFar[currTime]) timesSoFar[currTime] = 1;
		else timesSoFar[currTime]++;
		return timesSoFar;
	}, {});

	let noOfTimes = 0;
	let mostFrequentTime = 0;

	for (let time in times) {
		if (times[time] >= noOfTimes) {
			noOfTimes = times[time];
			mostFrequentTime = time;
		}
	}
	return mostFrequentTime;
};

const addSleepiestMins = (updatesRecord) => {
	const record = { ...updatesRecord };

	for (let guard in record) {
		const minsAsleep = record[guard].minsAsleep.reduce((minsTally, currMin) => {
			if (!minsTally[currMin]) minsTally[currMin] = 1;
			else minsTally[currMin]++;
			return minsTally;
		}, {});

		let mostFrequentMin = 0;
		let numTimesAsleep = 0;

		for (let mins in minsAsleep) {
			if (minsAsleep[mins] > numTimesAsleep) {
				numTimesAsleep = minsAsleep[mins];
				mostFrequentMin = mins;
			}
		}
		record[guard].sleepiestMin = mostFrequentMin;
		record[guard].timesAsleepAtSleepyMin = numTimesAsleep;
	}
	return record;
};

const getSleepyGuard = (record) => {
	let sleepyGuard;
	let numsTimesAsleep = 0;

	for (let guard in record) {
		if (record[guard].timesAsleepAtSleepyMin > numsTimesAsleep) {
			numsTimesAsleep = record[guard].timesAsleepAtSleepyMin;
			sleepyGuard = guard;
		}
	}
	return sleepyGuard;
};
