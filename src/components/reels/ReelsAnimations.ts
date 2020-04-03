import { Outcome } from "./../../data/PlayerData";
import { ticker, Sprite, Point, Container } from "pixi.js";
import { TweenFactory } from "../../utils/tween/TweenFactory";
import { SymbolAppearPayload } from "./ReelsComponent";

export class ReelsAnimations {

    private tweenFactory: TweenFactory;
    private appearAnimationsEnd: () => void;
    private disappearAnimationsEnd: () => void;
    private decepticonsList: string[] = ["R3S0", "R3S1", "R3S2", "R2S0", "R2S1"];
    private autobotsList: string[] = ["R0S0", "R0S1", "R0S2", "R1S0", "R1S1"];
    private currentIndex: number = 0;
    private currentIsAutobot: boolean = true;
    private onSymbolAppearCallback: (SymbolAppearPayload) => void;
    private symbolAppearPayload: SymbolAppearPayload | boolean;

    constructor(ticker: ticker.Ticker, private container: Container) {
        this.tweenFactory = new TweenFactory(ticker);
    }

    onSymbolAppear(callback: (payload: SymbolAppearPayload) => void): void {
        this.onSymbolAppearCallback = callback;
    }

    appearScenario(): Promise<void> {
        this.shuffle(this.decepticonsList);
        this.shuffle(this.autobotsList);
        this.currentIndex = 0;
        this.currentIsAutobot = true;
        this.symbolAppearPayload = false;
        this.onAppear();

        return new Promise(resolve => {
            this.appearAnimationsEnd = resolve;
        });
    }

    private onAppear(): void {
        if (this.currentIndex === this.autobotsList.length) {
            this.processSymbolAppearCallback(null);
            this.appearAnimationsEnd();
            return
        }
        let sprite = this.currentIsAutobot ? this.getCurrentAutobot() : this.getCurrentDecepticon();
        this.processSymbolAppearCallback(sprite);
        this.appaerAnimation(sprite);
        this.currentIndex = this.currentIsAutobot ? this.currentIndex : this.currentIndex + 1;
        this.currentIsAutobot = !this.currentIsAutobot;
    }

    private processSymbolAppearCallback(sprite: Sprite): void {
        if (this.symbolAppearPayload) {
            this.onSymbolAppearCallback(this.symbolAppearPayload);
        }
        if (sprite) {
            this.symbolAppearPayload = {
                position: new Point(sprite.position.x, sprite.position.y),
                asset: sprite.texture.textureCacheIds[0],
                isAutobot: this.currentIsAutobot
            };
        }
    }

    private appaerAnimation(sprite: Sprite): void {
        let center: Point = new Point(640, 360);
        this.tweenFactory.scaleOut(sprite, () => { });
        this.tweenFactory.fromPoint(sprite, center, this.onAppear.bind(this));
        this.tweenFactory.startFadeIn(sprite, () => { });
    }

    private shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    private getCurrentDecepticon(): Sprite {
        return this.container.getChildByName(this.decepticonsList[this.currentIndex]);
    }

    private getCurrentAutobot(): Sprite {
        return this.container.getChildByName(this.autobotsList[this.currentIndex]);
    }

    disappearScenario() {
        return new Promise(resolve => {
            this.disappearAnimationsEnd = resolve;
            this.currentIndex = 0;
            this.tweenFactory.startFadeOut(this.getCurrentDecepticon(), this.disappearAnimationsEnd.bind(this));
            this.tweenFactory.startFadeOut(this.getCurrentAutobot(), () => { });
            for (let i = 1; i < this.autobotsList.length; i++) {
                this.currentIndex = i;
                this.tweenFactory.startFadeOut(this.getCurrentDecepticon(), () => { });
                this.tweenFactory.startFadeOut(this.getCurrentAutobot(), () => { });
            }
        });
    }

    disappearLosersScenario(outcome: Outcome) {
        return new Promise(resolve => {
            let getCurrentBot;
            if (outcome.autobotsPointsSummary > outcome.decepticonsPointsSummary) {
                getCurrentBot = this.getCurrentDecepticon.bind(this);
            } else if (outcome.autobotsPointsSummary < outcome.decepticonsPointsSummary) {
                getCurrentBot = this.getCurrentAutobot.bind(this);
            } else {
                return;
            }
            for (let i = 0; i < this.autobotsList.length; i++) {
                this.currentIndex = i;
                this.tweenFactory.startFadeOut(getCurrentBot(), () => { });
            }
        });
    }

}