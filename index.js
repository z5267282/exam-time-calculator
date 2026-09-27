/**
 * A class to represent a time.
 * Can be added with a duration.
 */
class Time {
    constructor(hh, mm) {
        this.hh = hh;
        this.mm = mm;
    }

    /**
     * Find the time after an elapsed duration
     * @param {Duration} duration 
     * @returns {Time} time after the elapsed duration
     */
    addDuration(duration) {
        const [hrs, mins] = duration.compHoursAndMins();

        const nextHrs = this.hh + hrs;
        const carry = Math.floor((this.mm + mins) / 60);

        return new Time((nextHrs + carry) % 24, (this.mm + mins) % 60);
    }

    toStr() {
        return `${String(this.hh).padStart(2, "0")}:${String(this.mm).padStart(2, "0")}`
    }
}

/**
 * A period of time to be elapsed
 */
class Duration {
    constructor(mins) {
        this.mins = mins;
    }

    /**
     * @returns {[number, number]} representing number of full hours and leftover minutes
     */
    compHoursAndMins() {
        return [Math.floor(this.mins / 60), this.mins % 60];
    }

    computeBonus(minsPerHour) {
        const rate = minsPerHour / 60;
        return new Duration(this.mins + Math.floor(this.mins * rate));
    }
}

class ExamTime {
    /**
     * @param {Time} start 
     * @param {Duration} duration 
     */
    constructor(start, duration) {
        this.start = start;
        this.duration = duration;
    }

    /**
     * @returns {[string]}
     */
    compReminders() {
        const reminders = [
            [Math.floor(this.duration.mins / 2), "half time"],
            [this.duration.mins - 30, "30 mins"],
            [this.duration.mins - 10, "10 mins"],
            [this.duration.mins, "end"]
        ];

        return reminders.map(([mins, desc]) => {
            const duration = new Duration(mins);
            const time = this.start.addDuration(duration);
            return `${time.toStr()} - ${desc}`
        });
    }
}

class ExamWithBonus {
    constructor(start, duration, bonus) {
        this.exam = new ExamTime(start, duration.computeBonus(bonus));
        this.bonus = bonus;
    }

    compReminders() {
        return this
            .exam
            .compReminders()
            .map((old) => `${old} (bonus +${this.bonus})`);
    }
}

function badExamTime() {
    const rawTime = document.getElementById("exam-time").value;
    return ! rawTime.match(/[0-9]{2}:[0-9]{2}/);
}

function badExamDuration() {
    const rawDuration = document.getElementById("exam-duration").value;
    return ! rawDuration.match(/[0-9]{2}:[0-9]{2}/);
}

function parseExamTime() {
    const rawTime = document.getElementById("exam-time").value;
    const [hrs, mins] = rawTime.split(":", 2);
    return new Time(parseInt(hrs), parseInt(mins));
}

function parseExamDuration() {
    const rawDuration = document.getElementById("exam-duration").value;
    const [hrs, mins] = rawDuration.split(":", 2);
    return new Duration(parseInt(hrs) * 60 + parseInt(mins));
}

document.getElementById("exam-inputs")
    .onsubmit = (event) => {
        // stop the form's default action to reload the page
        event.preventDefault();
        if (badExamTime() || badExamDuration()) {
            alert("bad exam time or duration");
            return;
        }

        const start = parseExamTime();
        const duration = parseExamDuration();

        const exam = new ExamTime(start, duration);

        const exams = [
            new ExamWithBonus(start, duration, 0),
            new ExamWithBonus(start, duration, 15),
            new ExamWithBonus(start, duration, 30),
            new ExamWithBonus(start, duration, 45),
        ];

        const times = exams
            .map((exam) => exam.compReminders())
            .flatMap(times => [...times])

        document
            .getElementById("bonus")
            .replaceChildren();
        times
            .forEach((reminder) => {
                const node = document.createElement("li");
                node.textContent = reminder;
                if (reminder.includes("end")) node.classList.add("red");
                document
                    .getElementById("bonus")
                    .appendChild(node);
                });

        document
            .getElementById("chronological")
            .replaceChildren();
        exams
            .sort()
            .map((exam) => exam.compReminders())
            .flatMap(times => [...times])
            .sort()
            .forEach((reminder) => {
                const node = document.createElement("li");
                node.textContent = reminder;
                if (reminder.includes("end")) node.classList.add("red");
                document
                    .getElementById("chronological")
                    .appendChild(node);
                });
    }
