
/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param locale - The locale to use (default: 'en-IN')
 * @param currency - The currency to use (default: 'INR')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en-IN',
  currency: string = 'INR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
};
