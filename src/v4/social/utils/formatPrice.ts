export function formatPrice(price: number | undefined, currency: string | undefined): string {
  if (price == null) return '';

  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency.toUpperCase(),
        trailingZeroDisplay: 'stripIfInteger',
      } as Intl.NumberFormatOptions).format(price);
    } catch {
      // Fallback if formatting fails
      return `${currency}${price}`;
    }
  }

  // Fallback for no currency
  return `$${price}`;
}
