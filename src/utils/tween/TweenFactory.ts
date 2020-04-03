import { ticker, Sprite, Text, Point } from "pixi.js";
import { Tweener } from "./Tweener";
import { Ease } from "./ease";

export type RegularTweenOptions = {
    object: any;
    property: string;
    initialValue: number;
    finalValue: number;
    duration: number;
    onComplete: () => void;
}

const animationDuration = 1000;

export class TweenFactory {

    private tweener: Tweener;

    constructor(ticker: ticker.Ticker) {
        this.tweener = new Tweener(ticker);
    }

    private startReqularTween(options: RegularTweenOptions) {
        options.object[options.property] = options.initialValue;
        this.tweener.new().tween(
            options.object,
            options.property,
            options.finalValue,
            options.duration,
            Ease.noEasing(),
            (x) => x,
            options.initialValue,
            () => { },
            options.onComplete
        ).start();
    }

    startRotation(sprite: Sprite, onComplete): void {
        this.startReqularTween({
            object: sprite.scale,
            property: "x",
            initialValue: 1,
            finalValue: -1,
            duration: animationDuration,
            onComplete: onComplete
        });
    }

    startFadeOut(sprite: Sprite, onComplete): void {
        this.startReqularTween({
            object: sprite,
            property: "alpha",
            initialValue: sprite.alpha,
            finalValue: 0,
            duration: animationDuration,
            onComplete: onComplete
        });
    }

    fromPoint(sprite: Sprite, point:Point, onComplete): void {
        let tweenX = {
            object: sprite,
            property: "x",
            initialValue: point.x,
            finalValue: sprite.x,
            duration: animationDuration,
            onComplete: onComplete
        };
        let tweenY = {
            object: sprite,
            property: "y",
            initialValue: point.y,
            finalValue: sprite.y,
            duration: animationDuration,
            onComplete: ()=>{}
        };
        this.startReqularTween(tweenX);
        this.startReqularTween(tweenY);
    }

    scaleOut(sprite: Sprite, onComplete): void {
        let tweenX = {
            object: sprite.scale,
            property: "x",
            initialValue: 0.01,
            finalValue: 1,
            duration: animationDuration,
            onComplete: onComplete
        };
        let tweenY = {
            object: sprite.scale,
            property: "y",
            initialValue: 0.01,
            finalValue: 1,
            duration: animationDuration,
            onComplete: ()=>{}
        };
        this.startReqularTween(tweenX);
        this.startReqularTween(tweenY);
    }    

    startFadeIn(sprite: Sprite, onComplete): void {
        this.startReqularTween({
            object: sprite,
            property: "alpha",
            initialValue: 0,
            finalValue: 1,
            duration: animationDuration,
            onComplete: onComplete
        });
    }

}

export function textCount(textField: Text, newValue: number, prefix: string = "", onComplete: () => void): void {
    let valueString = textField.text.substr(prefix.length, textField.text.length);
    let value:number = parseInt(valueString);

    if (value === newValue) {
        onComplete();
        return;
    }

    let range:number = value - newValue;
    let current = value;
    let increment = newValue > value ? 1 : -1;
    let stepTime = Math.abs(Math.floor(animationDuration / range));
    let timer = setInterval(function () {
        current += increment;
        textField.text = prefix + current.toString();
        if (current == newValue) {
            clearInterval(timer);
            onComplete();
        }
    }, stepTime);
}