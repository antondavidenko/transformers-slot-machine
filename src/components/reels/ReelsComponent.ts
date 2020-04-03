import { SlotDefinition } from "./../../data/ApplicationData";
import { Outcome } from "./../../data/PlayerData";
import { Application, Point, Texture, Container, Sprite } from "pixi.js";
import { ViewFactory } from "../../utils/ViewFactory";
import { getSymbolByField } from "../../utils/DataHelper";
import { ReelsAnimations } from "./ReelsAnimations";
import { Soundplayer } from "../../services/Soundplayer";
import { LayoutObject, GameLayout } from "./../../data/LayoutsData";
import { InjectableClass } from "./../../utils/Injector";

export type SymbolAppearPayload = {
    position: Point;
    asset: string;
    isAutobot: boolean;
};

@InjectableClass()
export class ReelsComponent {

    private container: Container;
    private reelPictureSize: number[];
    private reelsAnimation: ReelsAnimations;

    constructor(private app: Application,
                layout: GameLayout,
                private slotDefinition: SlotDefinition,
                private soundplayer: Soundplayer) {

        let viewFactory = new ViewFactory(null);
        this.container = viewFactory.renderComponent(app.stage, layout.ReelsComponent);

        this.reelPictureSize = slotDefinition.reelPictureSize;
        this.reelsAnimation = new ReelsAnimations(app.ticker, this.container);
        this.container.visible = false;
    }

    showReelPicture(reelPicture: string[][]): Promise<void> {
        this.container.visible = true;
        this.forAllSymbols((i, j, key) => {
            (this.container.getChildByName(key) as Sprite).texture = this.getTextureBySymbolId(reelPicture[i][j]);
            this.container.getChildByName(key).alpha = 0;
        });
        this.soundplayer.onSpin();
        return this.reelsAnimation.appearScenario();
    }

    private getTextureBySymbolId(symbolId: string): Texture {
        let assetId = getSymbolByField("id", symbolId, this.slotDefinition).asset;
        return PIXI.Texture.fromImage(assetId);
    }

    private forAllSymbols(callback: (reel: number, symbol: number, key: string) => void) {
        for (let i = 0; i < this.reelPictureSize.length; i++) {
            for (let j = 0; j < this.reelPictureSize[i]; j++) {
                let key = `R${i}S${j}`;
                callback(i, j, key);
            }
        }
    }

    hideLosers(outcome: Outcome) {
        return this.reelsAnimation.disappearLosersScenario(outcome);
    }

    hide() {
        return this.reelsAnimation.disappearScenario();
    }

    onSymbolAppear(callback: (SymbolAppearPayload) => void): void {
        this.reelsAnimation.onSymbolAppear(callback);
    }

}