import { Sprite } from "pixi.js";

export function disableButton(sprites: Sprite[]):void {
    for (let i in sprites) {
        sprites[i].interactive = false;
        sprites[i].buttonMode = false;
    }
}

export function enableButton(sprites: Sprite[]):void {
    for (let i in sprites) {
        sprites[i].interactive = true;
        sprites[i].buttonMode = true;
    }
}