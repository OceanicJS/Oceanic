/** @module Time */

type unixStyles = "t" | "T" | "d" | "d" | "f" | "F" | "R";

/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
export default class Time {
    date: Date;

    /**
     * @param {Date} date
     * @returns {string}
     */

    constructor(date: Date) {
        this.date = date;
    }

    /** Get how many days in the requested month. */
    daysInMonth(): number {
        const d = this.date;

        d.setDate(1);
        d.setMonth(d.getMonth() + 1);
        d.setDate(0);

        return d.getDate();
    }

    // src: https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa
    // Style	Input	Output (12-hour clock)	Output (24-hour clock)
    // Default	<t:1543392060>	November 28, 2018 9:01 AM	28 November 2018 09:01
    // Short Time	<t:1543392060:t>	9:01 AM	09:01
    // Long Time	<t:1543392060:T>	9:01:00 AM	09:01:00
    // Short Date	<t:1543392060:d>	11/28/2018	28/11/2018
    // Long Date	<t:1543392060:D>	November 28, 2018	28 November 2018
    // Short Date/Time	<t:1543392060:f>	November 28, 2018 9:01 AM	28 November 2018 09:01
    // Long Date/Time	<t:1543392060:F>	Wednesday, November 28, 2018 9:01 AM	Wednesday, 28 November 2018 09:01
    // Relative Time	<t:1543392060:R>	3 years ago	3 years ago

    /** Get the passed string to be a string that discord treat like a date counter. */
    dsTime(timeOrSeconds: Date | number , style?: unixStyles): string {
        if (typeof timeOrSeconds !== "number") {
            timeOrSeconds = Math.floor(
                (timeOrSeconds?.getTime() ?? Date.now()) / 1e3
            );
        }
        return typeof style === "string"
            ? `<t:${timeOrSeconds}:${style}>`
            : `<t:${timeOrSeconds}>`;

    }

    /** Get the time between two dates, ex: just to conform if an account has been alive for a long/short periods of time. */
    timeBetween(datumDate: Date, returns?: "object" | "array" | "string"): {days: number;months: number;years: number;} | string | Array<number> | null {
        const birthDate = this.date;
        const pointed = new Date(datumDate);
        // Make sure birthDate is before datumDate
        if (birthDate.getTime() - pointed.getTime() > 0) return null;

        const dob = new Date(+birthDate),
            now = new Date(+pointed),
            nowY = now.getFullYear();

        let tDate = new Date(+dob),
            dobY = dob.getFullYear(),
            years, months, days;

        // Initial estimate of years
        years = nowY - dobY;
        dobY = (dobY + years);
        tDate.setFullYear(dobY);

        // Correct if too many
        if (now < tDate) {
            --years;
            --dobY;
        }
        dob.setFullYear(dobY);

        // Repair tDate
        tDate = new Date(+dob);

        // Initial month estimate
        months = now.getMonth() - tDate.getMonth();

        // Adjust if needed
        if (months < 0) {
            months = 12 + months;

        } else if (months === 0 && tDate.getDate() > now.getDate()) {
            months = 11;
        }
        tDate.setMonth(tDate.getMonth() + months);

        if (now < tDate) {
            --months;
            dob.setMonth(tDate.getMonth() - 1);
        }

        // Repair tDate
        tDate = new Date(+dob);

        // Initial day estimate
        days = now.getDate() - tDate.getDate();

        // Adjust if needed
        if (days < 0) {
            days = days + this.daysInMonth();
        }
        dob.setDate(dob.getDate() + days);

        if (now < dob) {
            --days;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        if (returns === "array") return [days, months, years];
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (returns === "string") return years + "y " + months + "m " + days + "d";

        return { days, months, years };
    }

}

