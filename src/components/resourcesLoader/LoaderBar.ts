import { Application, Graphics } from "pixi.js";

const barWidth = 400;
const barHeight = 10;
const emptyColor = 0x283751;
const fillColor = 0x324d7c;

export class LoaderBar {

    private graphics:Graphics;

    constructor(private app:Application) {
        this.graphics = new PIXI.Graphics();
    }

    showProgress(progres:number) {
        this.clear();
        this.graphics.beginFill(emptyColor);
        this.graphics.drawRect(
            (this.app.view.width - barWidth)/2,
            (this.app.view.height - barHeight)/2,
            barWidth,
            barHeight
        );
        this.graphics.beginFill(fillColor);
        this.graphics.drawRect(
            (this.app.view.width - barWidth)/2,
            (this.app.view.height - barHeight)/2,
            barWidth*progres/100,
            barHeight
        );        
        this.graphics.endFill();
        this.app.stage.addChild(this.graphics);
    }

    clear() {
        this.graphics.clear();
    }

}