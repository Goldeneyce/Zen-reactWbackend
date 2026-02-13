/**
 * Format a number as Nigerian Naira with thousands separators.
 * e.g. 2014984.5 → "₦2,014,984.50"
 */
export function formatPrice(amount: number): string {
  const parts = amount.toFixed(2).split(".");
  const whole = parts[0] ?? "0";
  const decimal = parts[1] ?? "00";
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₦${withCommas}.${decimal}`;
}
