const nepaliNumerals: string[] = [
  "०",
  "१",
  "२",
  "३",
  "४",
  "५",
  "६",
  "७",
  "८",
  "९",
];

/**
 * Converts English digits (0-9) in a string to Nepali numerals (०-९)
 */
export function toNepaliNumeral(str: string | number): string {
  return String(str).replace(/\d/g, (d) => nepaliNumerals[parseInt(d)]);
}

/**
 * Converts Nepali numerals (०-९) in a string to English digits (0-9)
 */
export function toEnglishNumeral(str: string): string {
  return String(str).replace(/[०-९]/g, (d) => {
    const index = nepaliNumerals.indexOf(d);
    // If for some reason the character isn't found, return it as is,
    // otherwise return the string version of its index
    return index !== -1 ? index.toString() : d;
  });
}
