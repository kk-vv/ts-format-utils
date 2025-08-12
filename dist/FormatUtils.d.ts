export declare namespace FormatUtils {
    function toUnits(src: number | string | bigint, decimal?: number): bigint;
    function fromUnits(src: number | string | bigint, decimal?: number): string;
    function deformatNumberToPureString(shitNumber: string): string;
    function quantityDivideDecimal(quantity: string, decimal: number): string;
    function quantityMultiplyDecimal(quantity: string, decimal: number): string;
    function shitNumber(number: string | number, tailValidNumberCount?: number, limitZeroCount?: number): string;
    function compactNumber(number: string | number, digits?: number): string;
    function fixToSubSymbol(v: string): string;
    function revertSubSymbol(v: string): string;
    function toTradingViewNumber(text: string | number, tailValidNumberCount?: number, limitZeroCount?: number): string;
    function groupBy3Numbers(text: string | number | undefined | null): string;
    function removeDecimalTailZeros(text: string): string;
    function formatTokenPrice(price: string | number | undefined | null, placeholder?: string): string;
    function formatMCap(amount: string | number | undefined | null, symbol?: string, placeholder?: string): string;
    function formatQuantity(balance: string | number | undefined | null, placeholder?: string): string;
    function formatTokenSupply(supply: string | number): string;
}
