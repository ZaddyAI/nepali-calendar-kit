export type LanguageCode = "en" | "np";

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

export type FormatPart = "numeric" | "short" | "long";

export interface DatePickerResult {
  bs: string;
  ad: Date;
  nepali: string;
}

export interface Theme {
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
