# Nepali Calendar Kit

A lightweight React library for Nepali calendar operations, including **AD ↔ BS conversion**, date formatting, and a **Nepali Date Picker** component.

**Package:** [`@gambhirpoudel/nepali-calendar-kit`](https://www.npmjs.com/package/@gambhirpoudel/nepali-calendar-kit)

```bash
npm install @gambhirpoudel/nepali-calendar-kit
```

---

## Features

- Convert **AD (Gregorian) dates to BS (Bikram Sambat)** and vice versa.
- Editable **NepaliDatePicker** — type dates in BS or AD, auto-detected and converted.
- Multiple display formats (`YYYY-MM-DD`, `DD-MM-YYYY`, `DD/MM/YYYY`, `YYYY/MM/DD`).
- Nepali numeral support (१, २, ३…) via single `calLan` toggle.
- Fully themeable — every visual element customizable via `Theme`.
- Keyboard-friendly — Enter to confirm, Escape to dismiss.
- Fully TypeScript typed.

---

## Live Demo

Try the interactive playground in your browser:

[Chrome](https://nepalicalendarkit.gambhirpoudel.com.np/)

---

## 1. Date Conversion

```ts
import {
  adToBs,
  bsToAd,
  formatBs,
  formatAd,
} from "@gambhirpoudel/nepali-calendar-kit";

// Convert AD → BS
const bsDate = adToBs(new Date("2026-01-15"));
// { year: 2082, month: 10, day: 1 }

// Convert BS → AD
const adDate = bsToAd(2082, 10, 1);
// Thu Jan 15 2026 00:00:00 GMT+0000 (UTC)

// Format BS Date (Nepali numerals, month name, weekday name)
formatBs(bsDate, "DD-MM-YYYY", "long", "short");
// "१-१०-२०८२"

// Format AD Date (English digits)
formatAd(adDate, "YYYY/MM/DD");
// "2026/01/15"
```

### formatBs

```ts
formatBs(date, format?, monthFormat?, dayFormat?)
```

| Param        | Type                         | Default     | Description                                   |
|-------------|------------------------------|-------------|-----------------------------------------------|
| `date`       | `BSDate`                     | —           | The BS date to format                         |
| `format`     | `DateFormat`                 | `YYYY-MM-DD`| Structural arrangement of Y, M, D             |
| `monthFormat`| `FormatPart`                 | `"numeric"` | Month: `"numeric"` (१२), `"short"` (पु), `"long"` (पुष) |
| `dayFormat`  | `FormatPart`                 | `"numeric"` | Day: `"numeric"` (१), `"short"` (सोम), `"long"` (सोमबार) |

All numeric output uses Nepali numerals.

---

## 2. Nepali Date Picker

```tsx
import { NepaliDatePicker } from "@gambhirpoudel/nepali-calendar-kit";

export const MyComponent = () => {
  const handleChange = (result) => {
    console.log("BS:", result.bs);      // "2082-10-01"
    console.log("AD:", result.ad);       // Date object
    console.log("Nepali:", result.nepali); // "२०८२-१०-०१"
  };

  return (
    <NepaliDatePicker
      onChange={handleChange}
      value="2082-10-01"
      format="YYYY-MM-DD"
      calLan="en"
      theme={{
        primary: "#6366f1",
        surfaceBg: "#ffffff",
        inputBg: "#ffffff",
        text: "#0f172a",
        border: "#e2e8f0",
        radius: "12px",
      }}
    />
  );
};
```

### Props

| Prop          | Type                                         | Default        | Description                                    |
|---------------|----------------------------------------------|----------------|------------------------------------------------|
| `onChange`    | `(result: DatePickerResult \| null) => void` | `undefined`    | Callback with BS, AD, and Nepali numeral date |
| `value`       | `string`                                     | `""`           | Initial BS date (`"2082-10-01"` or `"2082-10"`) |
| `format`      | `DateFormat`                                 | `"YYYY-MM-DD"` | Display and input format                       |
| `calLan`      | `"en" \| "np"`                               | `"en"`         | Language for all calendar labels               |
| `placeholder` | `string`                                     | format-based   | Input placeholder text                         |
| `disabled`    | `boolean`                                    | `false`        | Disable the picker                             |
| `className`   | `string`                                     | `undefined`    | Additional CSS class on wrapper                |
| `theme`       | `Theme`                                      | `undefined`    | Visual customization (see below)               |

### Result object

```ts
interface DatePickerResult {
  bs: string;     // "2082-10-01"
  ad: Date;       // equivalent AD Date
  nepali: string; // "२०८२-१०-०१"
}
```

### Input behavior

- **Type a BS date** (year ≥ 2000) — accepted as-is.
- **Type an AD date** (year < 2000) — auto-converted to BS internally.
- **Press Enter** — commit the typed date.
- **Press Escape** — revert to last valid date and close.
- **Click a day** in the calendar — selects that BS date.
- Supports Nepali numerals in input (e.g. `२०८२-१०-०१`).

---

## Theme

Every visual aspect is customizable via the `theme` prop.

```ts
interface Theme {
  primary?: string;     // Accent color — active selections, focus rings, buttons
  hoverBg?: string;     // Tint for hover, selected, and highlighted states
  surfaceBg?: string;   // Popover panel and dropdown menu background
  inputBg?: string;     // Input field background
  text?: string;        // Default text color
  border?: string;      // Border color for input, popover, and selects
  radius?: string;      // Outer border radius for input and popover
  fontFamily?: string;  // Font family
  shadow?: string;      // Popover dropdown box shadow
}
```

Example dark theme:

```tsx
<NepaliDatePicker
  theme={{
    primary: "#818cf8",
    hoverBg: "#1e1b4b",
    surfaceBg: "#0f172a",
    inputBg: "#0f172a",
    text: "#f1f5f9",
    border: "#1e293b",
    radius: "12px",
    fontFamily: "'Inter', sans-serif",
    shadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
  }}
/>
```

---

## 3. NepaliDate (Date-like API)

Object-oriented wrapper for BS dates.

```ts
import { NepaliDate } from "@gambhirpoudel/nepali-calendar-kit";

// Today
const today = NepaliDate.today();
console.log(today.getYear(), today.getMonth(), today.getDate());

// From AD
const fromAd = new NepaliDate(new Date("2026-01-15"));

// From BS
const fromBs = new NepaliDate({ year: 2082, month: 10, day: 1 });

// Format (all Nepali numerals/names)
today.format();                            // "२०८२-१०-०१"
today.format("DD/MM/YYYY", "long", "short"); // "०१/माघ/२०८२"

// Convert back
const ad = today.toAD();
const bs = today.toBS();
```

### Methods

| Method               | Description                            |
|----------------------|----------------------------------------|
| `NepaliDate.today()` | Today's Nepali (BS) date               |
| `getYear()`          | BS year                                |
| `getMonth()`         | BS month (1–12)                        |
| `getDate()`          | BS day                                 |
| `getDay()`           | Weekday (0=Sunday, 6=Saturday)         |
| `format(format?, monthFormat?, dayFormat?)` | Format BS date |
| `toAD()`             | Convert BS → AD                        |
| `toBS()`             | Return raw BS object                   |

### FormatPart

```ts
type FormatPart = "numeric" | "short" | "long";
```

| Value       | Month example | Day example    |
|-------------|---------------|----------------|
| `"numeric"` | १०            | १              |
| `"short"`   | पुष           | सोम            |
| `"long"`    | पुष           | सोमबार         |

---

## Supported Date Formats

- `YYYY-MM-DD` (default)
- `DD-MM-YYYY`
- `DD/MM/YYYY`
- `YYYY/MM/DD`

---

## License

MIT © [Gambhir Poudel](https://github.com/gambhirpoudel)
