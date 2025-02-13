export interface CronPartsType {
  minutes: string[];
  everyMinutes: boolean;
  hours: string[];
  everyHours: boolean;
  dayOfMonth: string[];
  month: string[];
  dayOfWeek: string[];
}

export const CronDecode = (cronString: string): CronPartsType => {
  const cronArray = cronString.split(" ");

  let minutes: string[] = [];
  let hours: string[] = [];
  let dayOfMonth: string[] = [];
  let month: string[] = [];
  let dayOfWeek: string[] = [];

  let everyMinutes = false;
  let everyHours = false;

  const [minuteStr, hourStr, dayOfMonthStr, monthStr, dayOfWeekStr] = cronArray;

  if (minuteStr === "*") {
    everyMinutes = true;
    minutes = ["*"];
  } else if (minuteStr.startsWith("*/")) {
    everyMinutes = true;
    minutes = [minuteStr.split("/")[1]];
  } else if (minuteStr.includes(",")) {
    minutes = minuteStr.split(",");
  } else {
    minutes = [minuteStr];
  }

  if (hourStr === "*") {
    hours = ["*"];
  } else if (hourStr.startsWith("*/")) {
    everyHours = true;
    hours = [hourStr.split("/")[1]];
  } else if (hourStr.includes(",")) {
    hours = hourStr.split(",");
  } else {
    hours = [hourStr];
  }

  dayOfMonth = dayOfMonthStr === "*" ? ["*"] : dayOfMonthStr.split(",");

  month = monthStr === "*" ? ["*"] : monthStr.split(",");

  dayOfWeek = dayOfWeekStr === "*" ? ["*"] : dayOfWeekStr.split(",");

  return {
    minutes,
    everyMinutes,
    hours,
    everyHours,
    dayOfMonth,
    month,
    dayOfWeek,
  };
};

export const CronEncode = (cron: CronPartsType): string => {
  const encodePart = (part: string[], every: boolean): string => {
    if (every) {
      return `*/${part[0]}`;
    }
    if (part.includes("*")) {
      return "*";
    }
    return part.join(",");
  };

  const minutes = encodePart(cron.minutes, cron.everyMinutes);
  const hours = encodePart(cron.hours, cron.everyHours);
  const dayOfMonth = cron.dayOfMonth.join(",");
  const month = cron.month.join(",");
  const dayOfWeek = cron.dayOfWeek.join(",");

  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
};
