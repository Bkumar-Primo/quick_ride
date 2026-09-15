export type Country = {
  iso: string;
  name: string;
  dialCode: string;
  flag: string;
  length: number;
};

export const COUNTRIES: Country[] = [
  { iso: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', length: 10 },
  { iso: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', length: 10 },
  { iso: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', length: 10 },
  { iso: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', length: 9 },
  { iso: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', length: 8 },
  { iso: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', length: 9 },
  { iso: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', length: 10 },
  { iso: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', length: 10 },
  { iso: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', length: 10 },
  { iso: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', length: 10 },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatNationalNumber(digits: string, country: Country): string {
  const clipped = digits.slice(0, country.length);
  if (country.iso === 'IN' && clipped.length > 5) {
    return `${clipped.slice(0, 5)} ${clipped.slice(5)}`;
  }
  if ((country.iso === 'US' || country.iso === 'CA') && clipped.length > 6) {
    return `(${clipped.slice(0, 3)}) ${clipped.slice(3, 6)}-${clipped.slice(6)}`;
  }
  if (clipped.length > 5) {
    return `${clipped.slice(0, clipped.length - 4)} ${clipped.slice(-4)}`;
  }
  return clipped;
}

export function toE164(digits: string, country: Country): string {
  return `${country.dialCode}${digits.slice(0, country.length)}`;
}

export function isValidPhone(digits: string, country: Country): boolean {
  if (digits.length !== country.length) return false;
  if (country.iso === 'IN') return /^[6-9]\d{9}$/.test(digits);
  return /^\d+$/.test(digits);
}

export function formatE164Display(e164: string): string {
  const country = COUNTRIES.find((item) => e164.startsWith(item.dialCode));
  if (!country) return e164;
  const national = e164.slice(country.dialCode.length);
  return `${country.dialCode} ${formatNationalNumber(national, country)}`;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
