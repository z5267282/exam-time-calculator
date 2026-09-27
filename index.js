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
        return `${String(this.hh).padStart(2, "0")}:${String(this.mm).padStart(2, "0")}:`
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
        rate = Math.floor(minsPerHour / 60);
        return new Duration(this.mins * rate);
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
            [Math.floor(this.duration.mins) / 2, "half time"],
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

        document
            .getElementById("chronological")
            .replaceChildren();

        exam
            .compReminders()
            .forEach((reminder) => {
                const node = document.createElement("li");
                node.textContent = reminder;
                document
                    .getElementById("chronological")
                    .appendChild(node);
                });
    }
