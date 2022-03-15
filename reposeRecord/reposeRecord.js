const reposeRecord = (data) => {
	const sortedUpdates = sortUpdates(data);
	const record = {};
	let currentGuard = 0;

	// adding data to record object
	sortedUpdates.forEach((update) => {
		let guardNum = update[1].match(/\d/g);
		if (guardNum !== null) {
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
		if (isAsleep) {
			record[currentGuard].sleepyTime = min;
		}

		const isAwake = /(wakes up)/.test(update[1]);
		if (isAwake) {
			const lastSleepTime = record[currentGuard].sleepyTime;
			for (let i = lastSleepTime; i < min; i++) {
				record[currentGuard].minsAsleep.push(i);
			}
			record[currentGuard].totalSleep += min - lastSleepTime;
		}
	});

	// getting the sleepiest guard
	let sleepiest = 0;
	let sleepyGuard;

	for (let guard in record) {
		if (record[guard].totalSleep > sleepiest) {
			sleepiest = record[guard].totalSleep;
			sleepyGuard = guard;
		}
	}

	// return zero if no sleeping
	if (!record[sleepyGuard]) return 0;

	// finding the most frequent sleepy slot
	const times = record[sleepyGuard].minsAsleep.reduce(
		(timesSoFar, currTime) => {
			if (!timesSoFar[currTime]) {
				timesSoFar[currTime] = 1;
			} else {
				timesSoFar[currTime]++;
			}
			return timesSoFar;
		},
		{}
	);

	let noOfTimes = 0;
	let mostFrequentTime = 0;

	for (let time in times) {
		if (times[time] >= noOfTimes) {
			noOfTimes = times[time];
			mostFrequentTime = time;
		}
	}
	return +sleepyGuard * mostFrequentTime;
};

// sorting updates chronologically
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

module.exports = { reposeRecord, sortUpdates };
