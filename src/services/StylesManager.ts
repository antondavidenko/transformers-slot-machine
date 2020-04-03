import { TextStyleOptions } from "pixi.js";

export class StylesManager {

    constructor(private styles: any) {};

    getStyle(key: string): TextStyleOptions {
        return this.styles[key];
    }

}