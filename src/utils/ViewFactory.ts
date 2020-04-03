import { Sprite, Container, Text, TextStyleOptions, Point } from "pixi.js";
import { LayoutObject, LayoutSprite, LayoutText } from "./../data/LayoutsData";
import { StylesManager } from "../services/StylesManager";

export class ViewFactory {

    private mainContainer: Container = new Container();

    constructor(private stylesManager: StylesManager) {}

    renderComponent(rootContainer: Container, layout: LayoutObject[] = []):Container {
        rootContainer.addChild(this.mainContainer);
        for (let i in layout) {
            if (layout[i].type === "sprite") {
                this.renderImage(layout[i] as LayoutSprite);
            } else if (layout[i].type === "text") {
                this.renderText(layout[i] as LayoutText);
            }
        }
        return this.mainContainer;
    }

    private renderImage(layoutSprite:LayoutSprite) {
        let spritePoint = new Point(layoutSprite.x, layoutSprite.y);
        this.addSprite(layoutSprite.imageName, spritePoint).name = layoutSprite.id;
    }

    private renderText(layoutText:LayoutText) {
        let textPoint = new Point(layoutText.x, layoutText.y);
        let textStyle = this.stylesManager.getStyle(layoutText.textStyle);
        let text = this.addText(textStyle, textPoint, "");
        text.name = layoutText.id;
    }

    private addSprite(imageName: string, position: Point): Sprite {
        let sprite = PIXI.Sprite.fromImage(`images/${imageName}.png`);
        sprite.anchor.set(0.5);
        sprite.position = position;
        this.mainContainer.addChild(sprite);
        return sprite;
    }

    buttonFromSprite(sprite: Sprite, callback: () => void): Sprite {
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('pointerdown', callback);
        return sprite;
    }

    addText(textStyle: TextStyleOptions, position: Point, label: string = ""): Text {
        let text = new PIXI.Text(label, textStyle);
        text.position = position;
        text.anchor.set(0.5);
        this.mainContainer.addChild(text);
        return text;
    }

}