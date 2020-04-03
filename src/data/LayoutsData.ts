import { copyObject } from "./../utils/DataHelper";

export type  LayoutObject = LayoutSprite | LayoutText;

export type LayoutSprite = {
    id: string;
    x: number; 
    y: number; 
    type: "sprite";
    imageName: string;
}

export type LayoutText = {
    id: string;
    x: number; 
    y: number; 
    type: "text";
    textStyle:string;
}

export class GameLayout {
    BackgroundComponent: LayoutObject[];
    BetPanelComponent: LayoutObject[];
    ReelsComponent: LayoutObject[];
    WinMeterComponent: LayoutObject[];
    PaytableComponent: LayoutObject[];

    constructor (gameLayoutObj:GameLayout) {
        copyObject(this, gameLayoutObj);
    }
}