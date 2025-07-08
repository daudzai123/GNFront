export const persianToEnglishDigits = (persianStr) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const str = String(persianStr);

  return str.replace(/[۰-۹]/g, (w) => englishDigits[persianDigits.indexOf(w)]);
};

export const englishToPersianDigits = (englishStr) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const str = String(englishStr);

  return str.replace(/[0-9]/g, (w) => persianDigits[englishDigits.indexOf(w)]);
};
