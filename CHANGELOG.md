# Changelog

## [2.0.0] - 2026-06-10

### Breaking changes

- **Removed** `dateLan`, `monthLan`, `dayLan`, `yearLan` props. Replaced by single `calLan` (`"en" | "np"`) which controls all calendar labels.
- **Removed** `primaryLight` from `Theme`. Replaced by `hoverBg`.
- **Removed** `accent` from `Theme`. Use `primary` for all accent needs.
- **Removed** `BSMetadata`, `ADDate`, `NepaliDate` types from public API — unused or redundant.
- **Removed** dead constants: `NEPAL_OFFSET_MIN`, `EN_MONTHS`, `EN_LEAP_YEAR_MONTHS`, `NewYearMappingData`, `NepaliMonthsNameEn`, `REFERENCE_EN_DATE`.
- **Renamed** `DisplayType` → `FormatPart` (`"numeric" | "short" | "long"`).
- **Renamed** `displayMonth` → `monthFormat` in `formatBs()` and `NepaliDate.format()`.
- **Renamed** `displayDay` → `dayFormat` in `formatBs()` and `NepaliDate.format()`.
- **Theme** interface reduced from 15+ properties to 9 focused properties.

### Features

- **Editable input** — users can type dates directly into the picker (no longer `readOnly`).
- **AD/BS auto-detection** — typing a year < 2000 is treated as AD and auto-converted to BS internally.
- **`format` prop** — control display and input format (`YYYY-MM-DD`, `DD-MM-YYYY`, etc.).
- **`disabled` / `placeholder` / `className` props** added.
- **Keyboard support** — Enter commits, Escape reverts and closes.
- **Smart blur** — commits valid input on blur, reverts to last valid value if invalid.
- **Nepali numeral input** — users can type dates in Nepali numerals (e.g. `२०८२-१०-०१`).

### Theming

- Every CSS color now uses a CSS variable, making every visual element customizable.
- Theme properties map directly to specific UI parts via descriptive names (`primary`, `hoverBg`, `surfaceBg`, `inputBg`, `text`, `border`, `radius`, `fontFamily`, `shadow`).

### Styling

- Refined animations (smoother slide/fade on popover).
- Better focus rings using `color-mix` for semi-transparent primary glow.
- Cleaner hover/active states on calendar cells.
- Disabled state styling.
- All hardcoded colors replaced with CSS custom properties.

### API cleanup

- `formatBs(date, format, monthFormat, dayFormat)` — clearer parameter names.
- `NepaliDate.format(format, monthFormat, dayFormat)` — consistent with `formatBs`.
- Exported types reduced from 17 to 12 — only what consumers need.

## [1.0.8] - 2026-01-17

### Added

- **`NepaliDate` class** with a Date-like API (`NepaliDate.today()`, `getYear()`, `getMonth()`, `getDate()`, `getDay()`, `format()`, `toAD()`, `toBS()`).
- Public exports updated to include `NepaliDate`.
- README documentation updated with usage examples for the new API.

### Compatibility

- Fully backward compatible — no breaking changes.
- Supports React `>=18 <20`.

## [1.0.7] - 2026-01-14

- Initial release.
