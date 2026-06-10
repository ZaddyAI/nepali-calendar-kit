import React from 'react';

type LanguageCode = "en" | "np";
interface BSDate {
    year: number;
    month: number;
    day: number;
}
type DateFormat = "YYYY-MM-DD" | "DD-MM-YYYY" | "DD/MM/YYYY" | "YYYY/MM/DD";
type FormatPart = "numeric" | "short" | "long";
interface DatePickerResult {
    bs: string;
    ad: Date;
    nepali: string;
}
interface Theme {
    primary?: string;
    hoverBg?: string;
    surfaceBg?: string;
    inputBg?: string;
    text?: string;
    border?: string;
    radius?: string;
    fontFamily?: string;
    shadow?: string;
}

declare function adToBs(adDate: Date): BSDate;
declare function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date;
declare function formatBs(date: BSDate, format?: DateFormat, monthFormat?: FormatPart, dayFormat?: FormatPart): string;
declare function formatAd(date: Date, format?: DateFormat): string;

/**
 * Converts English digits (0-9) in a string to Nepali numerals (०-९)
 */
declare function toNepaliNumeral(str: string | number): string;
/**
 * Converts Nepali numerals (०-९) in a string to English digits (0-9)
 */
declare function toEnglishNumeral(str: string): string;

interface Props {
    onChange?: (result: DatePickerResult | null) => void;
    theme?: Theme;
    value?: string;
    format?: DateFormat;
    calLan?: LanguageCode;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}
declare const NepaliDatePicker: React.FC<Props>;

declare class NepaliDate {
    private bs;
    constructor(date?: Date | BSDate);
    static today(): NepaliDate;
    getYear(): number;
    getMonth(): number;
    getDate(): number;
    getDay(): number;
    toAD(): Date;
    toBS(): BSDate;
    format(format?: DateFormat, monthFormat?: FormatPart, dayFormat?: FormatPart): string;
}

export { type BSDate, type DateFormat, type DatePickerResult, type FormatPart, type LanguageCode, NepaliDate, NepaliDatePicker, type Theme, adToBs, bsToAd, formatAd, formatBs, toEnglishNumeral, toNepaliNumeral };
