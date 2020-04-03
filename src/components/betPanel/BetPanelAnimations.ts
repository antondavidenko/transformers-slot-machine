import { ticker, Sprite, Text } from "pixi.js";
import { TweenFactory } from "../../utils/tween/TweenFactory";


export class BetPanelAnimations {

    private tweenFactory: TweenFactory;
    private allAnimationsEnd: () => void;
    private winerSprite:Sprite;

    constructor(ticker: ticker.Ticker) {
        this.tweenFactory = new TweenFactory(ticker);
    }

    appearScenario(sprite1: Sprite, sprite2: Sprite) {
        this.tweenFactory.startFadeIn(sprite1, () => {});
        this.tweenFactory.startFadeIn(sprite2, () => {});
    }

    choseSideScenario(spriteSelected: Sprite, spriteNotSelected: Sprite, callback: () => void) {
        this.allAnimationsEnd = callback;
        this.winerSprite = spriteSelected;
        this.tweenFactory.startRotation(spriteSelected, this.onCompleteRotation.bind(this));
        this.tweenFactory.startFadeOut(spriteNotSelected, () => {});
    }

    private onCompleteRotation():void {
        this.tweenFactory.startFadeOut(this.winerSprite, this.allAnimationsEnd.bind(this));
    }
}