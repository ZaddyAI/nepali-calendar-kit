import React from 'react';

type BSMetadata = Record<string, number[]>;
type LanguageCode = "en" | "np";
type ADDate = Date;
interface BSDate {
    year: number;
    month: number;
    day: number;
}
type DateFormat = "YYYY-MM-DD" | "DD-MM-YYYY" | "DD/MM/YYYY" | "YYYY/MM/DD";
type DisplayType = "numeric" | "short" | "long";
interface DatePickerResult {
    /** The date string in BS (e.g., "2082-09-30") */
    bs: string;
    /** The equivalent JavaScript Date object in AD */
    ad: Date;
    /** The Nepali numeral version of the BS date (e.g., "२०८२-०९-३०") */
    nepali: string;
}
interface Theme {
    /** Main primary color for selections and borders (default: #2563eb) */
    primary?: string;
    /** Lighter version of primary for hover states (default: #eff6ff) */
    primaryLight?: string;
    /** Accent color for special highlights (default: #f59e0b) */
    accent?: string;
    /** Border radius for inputs and panels (default: 12px) */
    radius?: string;
    /** Custom font family (default: Inter, system-ui, sans-serif) */
    fontFamily?: string;
    /** Custom shadow for the dropdown panel */
    shadow?: string;
    /** Background color for the input field */
    inputBg?: string;
}

/**
 * AD → BS Converter
 */
declare function adToBs(adDate: Date): BSDate;
/**
 * BS → AD Converter
 */
declare function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date;
declare function formatBs(date: BSDate, format?: DateFormat, displayMonth?: DisplayType, displayDay?: DisplayType): string;
/**
 * Format AD Date
 */
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
    dateLan?: LanguageCode;
    monthLan?: LanguageCode;
    dayLan?: LanguageCode;
    yearLan?: LanguageCode;
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
    format(format?: DateFormat, displayMonth?: DisplayType, displayDay?: DisplayType): string;
}

export { type ADDate, type BSDate, type BSMetadata, type DateFormat, type DatePickerResult, type DisplayType, type LanguageCode, NepaliDate, NepaliDatePicker, type Theme, adToBs, bsToAd, formatAd, formatBs, toEnglishNumeral, toNepaliNumeral };
