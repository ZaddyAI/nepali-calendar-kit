import {
  NepaliDaysData,
  NepaliMonthsData,
  NP_INITIAL_YEAR,
  NP_MONTHS_DATA,
} from "./metadata";
import { BSDate, DateFormat, DisplayType } from "./types";


/** Nepal Standard Time offset (UTC +05:45) */
const NEPAL_OFFSET_MIN = 5 * 60 + 45;

/**
 * Normalize AD date to UTC midnight
 * This prevents double timezone offset bugs when dates are manually provided
 */
function normalizeToUtc(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

/**
 * Base reference:
 * 1943-04-14 AD (UTC midnight) === NP_INITIAL_YEAR-01-01 BS
 */
const AD_REFERENCE = new Date(Date.UTC(1943, 3, 14));

/**
 * AD → BS Converter
 */
export function adToBs(adDate: Date): BSDate {
  if (!(adDate instanceof Date) || isNaN(adDate.getTime())) {
    throw new Error("Invalid AD date");
  }

  const adUtc = normalizeToUtc(adDate);

  let totalDays = Math.floor(
    (adUtc.getTime() - AD_REFERENCE.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (totalDays < 0) {
    throw new Error("AD date is before supported Nepali calendar range");
  }

  let bsYear = NP_INITIAL_YEAR;
  let yearIndex = 0;

  while (yearIndex < NP_MONTHS_DATA.length) {
    const yearMonths = NP_MONTHS_DATA[yearIndex][0];
    const yearDays = yearMonths.reduce((a, b) => a + b, 0);

    if (totalDays < yearDays) break;

    totalDays -= yearDays;
    yearIndex++;
    bsYear++;
  }

  const monthsData = NP_MONTHS_DATA[yearIndex][0];
  let bsMonth = 1;

  for (let i = 0; i < 12; i++) {
    if (totalDays < monthsData[i]) break;
    totalDays -= monthsData[i];
    bsMonth++;
  }

  return {
    year: bsYear,
    month: bsMonth,
    day: totalDays + 1,
  };
}

/**
 * BS → AD Converter
 */
export function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  const yearIndex = bsYear - NP_INITIAL_YEAR;

  if (!NP_MONTHS_DATA[yearIndex]) {
    throw new Error("BS year out of supported range");
  }

  let totalDays = 0;

  for (let y = 0; y < yearIndex; y++) {
    totalDays += NP_MONTHS_DATA[y][0].reduce((a, b) => a + b, 0);
  }

  const months = NP_MONTHS_DATA[yearIndex][0];

  for (let m = 0; m < bsMonth - 1; m++) {
    totalDays += months[m];
  }

  totalDays += bsDay - 1;

  const adUtc = new Date(AD_REFERENCE);
  adUtc.setUTCDate(adUtc.getUTCDate() + totalDays);

  return adUtc;
}

//
// ──────────────────────────────────────────────
// Formatting Utilities (User Choice)
// ──────────────────────────────────────────────
//

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatBs(
  date: BSDate,
  format: DateFormat = "YYYY-MM-DD",
  displayMonth: DisplayType = "numeric",
  displayDay: DisplayType = "numeric"
): string {
  const y = convertToNepaliNumber(date.year); // convert year to Nepali digits
  const monthName = getNepaliMonth(date.month, displayMonth);
  const dayName = getNepaliDayName(date, displayDay);

  let m =
    displayMonth === "numeric" ? convertToNepaliNumber(date.month) : monthName;
  let d = displayDay === "numeric" ? convertToNepaliNumber(date.day) : dayName;

  switch (format) {
    case "DD-MM-YYYY":
      return `${d}-${m}-${y}`;
    case "DD/MM/YYYY":
      return `${d}/${m}/${y}`;
    case "YYYY/MM/DD":
      return `${y}/${m}/${d}`;
    default:
      return `${y}-${m}-${d}`;
  }
}

/** Convert 1,2,3.. to Nepali digits १,२,३.. */
function convertToNepaliNumber(num: number): string {
  return num
    .toString()
    .split("")
    .map((d) => String.fromCharCode(0x0966 + parseInt(d)))
    .join("");
}

/** Get Nepali month name */
function getNepaliMonth(month: number, type: DisplayType): string {
  const name = NepaliMonthsData[month - 1].np; // full name
  if (type === "long") return name;
  if (type === "short") return name.slice(0, 3); // first 3 chars as short
  return convertToNepaliNumber(month); // numeric
}

/** Get Nepali day name */
function getNepaliDayName(bsDate: BSDate, type: DisplayType): string {
  // Convert BS date to AD to get the correct weekday
  const adDate = bsToAd(bsDate.year, bsDate.month, bsDate.day);
  const index = adDate.getUTCDay(); // 0=Sunday, 1=Monday, ... 6=Saturday
  const name = NepaliDaysData[index].np;
  if (type === "long") return name;
  if (type === "short") return name.slice(0, 3); // first 3 chars
  return convertToNepaliNumber(bsDate.day); // numeric
}

/**
 * Format AD Date
 */
export function formatAd(
  date: Date,
  format: DateFormat = "YYYY-MM-DD"
): string {
  const y = date.getUTCFullYear();
  const m = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());

  switch (format) {
    case "DD-MM-YYYY":
      return `${d}-${m}-${y}`;
    case "DD/MM/YYYY":
      return `${d}/${m}/${y}`;
    case "YYYY/MM/DD":
      return `${y}/${m}/${d}`;
    default:
      return `${y}-${m}-${d}`;
  }
}
