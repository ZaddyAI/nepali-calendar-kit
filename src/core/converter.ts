import {
  NepaliDaysData,
  NepaliMonthsData,
  NP_INITIAL_YEAR,
  NP_MONTHS_DATA,
} from "./metadata";
import { BSDate, DateFormat, FormatPart } from "./types";

function normalizeToUtc(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

const AD_REFERENCE = new Date(Date.UTC(1943, 3, 14));

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

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toNepaliNum(num: number): string {
  return num
    .toString()
    .split("")
    .map((d) => String.fromCharCode(0x0966 + parseInt(d)))
    .join("");
}

function getNepaliMonth(month: number, type: FormatPart): string {
  const name = NepaliMonthsData[month - 1].np;
  if (type === "long") return name;
  if (type === "short") return name.slice(0, 3);
  return toNepaliNum(month);
}

function getNepaliDayName(bsDate: BSDate, type: FormatPart): string {
  const adDate = bsToAd(bsDate.year, bsDate.month, bsDate.day);
  const index = adDate.getUTCDay();
  const name = NepaliDaysData[index].np;
  if (type === "long") return name;
  if (type === "short") return name.slice(0, 3);
  return toNepaliNum(bsDate.day);
}

export function formatBs(
  date: BSDate,
  format: DateFormat = "YYYY-MM-DD",
  monthFormat: FormatPart = "numeric",
  dayFormat: FormatPart = "numeric"
): string {
  const y = toNepaliNum(date.year);
  const monthName = getNepaliMonth(date.month, monthFormat);
  const dayName = getNepaliDayName(date, dayFormat);

  let m = monthFormat === "numeric" ? toNepaliNum(date.month) : monthName;
  let d = dayFormat === "numeric" ? toNepaliNum(date.day) : dayName;

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
