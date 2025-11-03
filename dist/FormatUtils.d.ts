export declare const FormatUtils: {
    toUnits(src: number | string | bigint, decimal?: number): bigint;
    fromUnits(src: number | string | bigint, decimal?: number): string;
    deformatNumberToPureString(shitNumber: string): string;
    quantityDivideDecimal(quantity: string, decimal: number): string;
    quantityMultiplyDecimal(quantity: string, decimal: number): string;
    shitNumber(number: string | number, tailValidNumberCount?: number, limitZeroCount?: number): string;
    compactNumber(number: string | number, digits?: number): string;
    fixToSubSymbol(v: string): string;
    revertSubSymbol(v: string): string;
    shitNumber2(text: string | number, tailValidNumberCount?: number, limitZeroCount?: number): string;
    groupBy3Numbers(text: string | number | undefined | null): string;
    removeDecimalTailZeros(text: string): string;
    formatByShorten(amount: string | number | undefined | null, currencySymbol?: string | null | boolean, placeholder?: string): string;
    formatByGrouped(amount: string | number | undefined | null, currencySymbol?: string | null | boolean, placeholder?: string): string;
    formatReadable(amount: string | number | undefined | null, tailValidNumberCount?: number, placeholder?: string): string;
    numberScale(price: string | number | bigint, scale: number): string;
};
