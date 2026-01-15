# Nepali Calendar Kit

A lightweight React library for Nepali calendar operations, including **AD ↔ BS conversion**, date formatting, and a **Nepali Date Picker** component.

**Package:** [`@gambhirpoudel/nepali-calendar-kit`](https://www.npmjs.com/package/@gambhirpoudel/nepali-calendar-kit)

```bash
npm install @gambhirpoudel/nepali-calendar-kit
```

---

## Features

- Convert **AD (Gregorian) dates to BS (Bikram Sambat)** and vice versa.
- Format dates in multiple formats (`YYYY-MM-DD`, `DD-MM-YYYY`, `DD/MM/YYYY`, etc.).
- Display Nepali dates with:

  - Numeric, short, or long month names
  - Numeric, short, or long weekday names
  - Nepali numerals (१, २, ३…)

- React **NepaliDatePicker** component with theming and localization support.
- Fully TypeScript typed.

---

## Live Demo

Try the **Nepali Date Picker** and conversion functions directly in your browser:

[<img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/google-chrome.svg" alt="Google Chrome" height="20" />](https://nepalicalendarkit.gambhirpoudel.com.np/)

> Click the link to open a live demo with interactive examples.

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
console.log(bsDate);
// Output: { year: 2082, month: 10, day: 1 }

// Convert BS → AD
const adDate = bsToAd(2082, 10, 1);
console.log(adDate);
// Output: Thu Jan 15 2026 00:00:00 GMT+0000 (UTC)

// Format BS Date
console.log(formatBs(bsDate, "DD-MM-YYYY", "long", "short"));
// Output: "१-१०-२०८२"

// Format AD Date
console.log(formatAd(adDate, "YYYY/MM/DD"));
// Output: "2026/01/15"
```

---

## 2. Nepali Date Picker

```tsx
import React from "react";
import { NepaliDatePicker } from "@gambhirpoudel/nepali-calendar-kit";

export const MyComponent = () => {
  const handleChange = (result: any | null) => {
    console.log("Selected Date:", result);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select a Nepali Date</h2>
      <NepaliDatePicker
        onChange={handleChange}
        theme={{
          primary: "#2563eb",
          primaryLight: "#eff6ff",
          radius: "12px",
          fontFamily: "'Inter', system-ui, sans-serif",
          shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          inputBg: "#ffffff",
        }}
        value="2082-10"
        dateLan="en"
        monthLan="en"
        dayLan="en"
        yearLan="en"
      />
    </div>
  );
};
```

---

## Props

| Prop       | Type                                         | Default     | Description                      |
| ---------- | -------------------------------------------- | ----------- | -------------------------------- |
| `onChange` | `(result: DatePickerResult \| null) => void` | `undefined` | Callback when a date is selected |
| `theme`    | `Theme`                                      | `undefined` | Custom theming options           |
| `value`    | `string`                                     | `""`        | Initial date value               |
| `dateLan`  | `LanguageCode`                               | `"en"`      | Language for date numbers        |
| `monthLan` | `LanguageCode`                               | `"en"`      | Language for month names         |
| `dayLan`   | `LanguageCode`                               | `"en"`      | Language for day names           |
| `yearLan`  | `LanguageCode`                               | `"en"`      | Language for year numbers        |

---

## Theme Options

```ts
interface Theme {
  primary?: string; // Primary color
  primaryLight?: string; // Light primary color
  radius?: string; // Border radius
  fontFamily?: string; // Font family
  shadow?: string; // Box shadow
  inputBg?: string; // Input background color
}
```

---

## Supported Date Formats

- `YYYY-MM-DD` (default)
- `DD-MM-YYYY`
- `DD/MM/YYYY`
- `YYYY/MM/DD`

---

## Example Output

```ts
adToBs(new Date("2026-01-15"));
// { year: 2082, month: 10, day: 1 }

formatBs({ year: 2082, month: 10, day: 1 }, "DD-MM-YYYY", "long", "numeric");
// "१-१०-२०८२"
```

## License

MIT © [Gambhir Poudel](https://github.com/gambhirpoudel)

---
