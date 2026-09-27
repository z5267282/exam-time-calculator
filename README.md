# Overview

This project is a time calculator for exam invigilation. Enter the exam
starting time and exam duration to compute the ending time and time reminders.
ELS extensions in increments of 15, 30 and 45 extra minutes per hour are also
shown. Standard time reminders are half time, 30 minutes remaining, 10 minutes
remaining and exam end.

You will be shown a table of time reminders that looks like this.

| -       | +0  | +15 | +30 | +45 |
| ------- | --- | --- | --- | --- |
| start   | ..  | ..  | ..  | ..  |
| half    | ..  | ..  | ..  | ..  |
| 30 mins | ..  | ..  | ..  | ..  |
| 10 mins | ..  | ..  | ..  | ..  |
| end     | ..  | ..  | ..  | ..  |

There will also be a sequence of times in chronological order to help track the
next time reminder.

```txt
1130: (+15) half way
1145: (+30) half way
...
1700: exam end
```
