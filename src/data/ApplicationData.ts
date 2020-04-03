import { Application } from "pixi.js";
import { GameLayout } from "./LayoutsData";
import { LocalizationManager } from "../services/LocalizationManager";
import { StylesManager } from "../services/StylesManager";
import { copyObject } from "./../utils/DataHelper";

export class SlotDefinition {
    curencySign: string;
    defaultBalance: number;
    betOptions: number[];
    defaultBetOption: number;
    reelPictureSize: number[];
    stripes: string[][];
    symbols: SlotSymbol[];

    constructor(slotDefinitionObj: SlotDefinition) {
        copyObject(this, slotDefinitionObj);
    }
}

export type SlotSymbol = {
    id: string;
    description: string;
    asset: string;
    points: number;
}

export class ApplicationData {
    pixiAplication: Application;
    gamelayout: GameLayout;
    slotDefinition: SlotDefinition;
    localization: LocalizationManager;
    styles: StylesManager;
}