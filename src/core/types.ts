export type BSMetadata = Record<string, number[]>;
export type LanguageCode = "en" | "np";
export interface NepaliDate {
  year: number;
  month: number;
  day: number;
  monthName?: string;
  formatted?: string;
}
export type ADDate = Date;
export interface BSDate {
  year: number;
  month: number;
  day: number;
}
export type DateFormat =
  | "YYYY-MM-DD"
  | "DD-MM-YYYY"
  | "DD/MM/YYYY"
  | "YYYY/MM/DD";
export type DisplayType = "numeric" | "short" | "long"; // numeric: numbers, short: abbreviated, long: full

export interface DatePickerResult {
  /** The date string in BS (e.g., "2082-09-30") */
  bs: string;
  /** The equivalent JavaScript Date object in AD */
  ad: Date;
  /** The Nepali numeral version of the BS date (e.g., "२०८२-०९-३०") */
  nepali: string;
}

export interface Theme {
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
