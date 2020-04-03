import { SlotSymbol, SlotDefinition } from "./../data/ApplicationData";

export function getSymbolByField(fieldId: string, fieldValue: string | number, slotDefinition: SlotDefinition): SlotSymbol {
    let symbol: SlotSymbol;
    for (let i = 0; i < slotDefinition.symbols.length; i++) {
        if (slotDefinition.symbols[i][fieldId] === fieldValue) {
            symbol = slotDefinition.symbols[i];
            break;
        }
    }
    return symbol;
}

export function copyObject(target: any, source: any): void {
    for (let i in source) {
        target[i] = source[i];
    }
}