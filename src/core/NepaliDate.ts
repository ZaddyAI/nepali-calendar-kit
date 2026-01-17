import { adToBs, bsToAd, formatBs } from "./converter";
import { BSDate, DateFormat, DisplayType } from "./types";

export class NepaliDate {
  private bs: BSDate;

  constructor(date?: Date | BSDate) {
    if (!date) {
      this.bs = adToBs(new Date());
    } else if (date instanceof Date) {
      this.bs = adToBs(date);
    } else {
      this.bs = date;
    }
  }

  static today(): NepaliDate {
    return new NepaliDate(new Date());
  }

  getYear(): number {
    return this.bs.year;
  }

  getMonth(): number {
    return this.bs.month;
  }

  getDate(): number {
    return this.bs.day;
  }

  getDay(): number {
    return bsToAd(this.bs.year, this.bs.month, this.bs.day).getUTCDay();
  }

  toAD(): Date {
    return bsToAd(this.bs.year, this.bs.month, this.bs.day);
  }

  toBS(): BSDate {
    return { ...this.bs };
  }

  format(
    format: DateFormat = "YYYY-MM-DD",
    displayMonth: DisplayType = "numeric",
    displayDay: DisplayType = "numeric"
  ): string {
    return formatBs(this.bs, format, displayMonth, displayDay);
  }
}
