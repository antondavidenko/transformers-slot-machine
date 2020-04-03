import { BetState, BetLines } from "./../../data/PlayerData";
import { SlotDefinition } from "./../../data/ApplicationData";
import { Sprite, Text, Application, Container } from "pixi.js";
import { ViewFactory } from "../../utils/ViewFactory";
import { BetSelector } from "./selectors/BetSelector";
import { SoundSelector } from "./selectors/SoundSelector";
import { BetPanelAnimations } from "./BetPanelAnimations";
import { disableButton, enableButton } from "../../utils/ViewHelper";
import { textCount } from "../../utils/tween/TweenFactory";
import { Soundplayer } from "../../services/Soundplayer";
import { GameLayout } from "./../../data/LayoutsData";
import { LocalizationManager } from "../../services/LocalizationManager";
import { InjectableClass } from "./../../utils/Injector";
import { StylesManager } from "../../services/StylesManager";

@InjectableClass()
export class BetPanelComponent {

    private container: Container;
    private onSpinPressedCallback: (betState: BetState) => void;
    private onPaytablePressedCallback: () => void;
    private autobotSpin: Sprite;
    private decepticonSpin: Sprite;
    private betSelector: BetSelector;
    private balanceText: Text;
    private betPanelAnimations: BetPanelAnimations;
    private curencySign: string;

    constructor(app: Application,
                layout: GameLayout,
                slotDefinition: SlotDefinition,
                private soundplayer: Soundplayer,
                stylesManager: StylesManager,
                localizationManager: LocalizationManager) {

        let viewFactory = new ViewFactory(stylesManager);
        this.container = viewFactory.renderComponent(app.stage, layout.BetPanelComponent);
        this.curencySign = slotDefinition.curencySign;

        this.betPanelAnimations = new BetPanelAnimations(app.ticker);

        this.autobotSpin = viewFactory.buttonFromSprite(this.container.getChildByName("autobots_spin"), this.onClickAutobots.bind(this));
        this.decepticonSpin = viewFactory.buttonFromSprite(this.container.getChildByName("decepticons_spin"), this.onClickDecepticons.bind(this));

        (this.container.getChildByName("balanceTextHeader") as Text).text = localizationManager.getByKey("balance");
        this.balanceText = this.container.getChildByName("balanceText");
        this.balanceText.text = this.curencySign + slotDefinition.defaultBalance.toString();

        (this.container.getChildByName("soundTextHeader") as Text).text = localizationManager.getByKey("sound");
        new SoundSelector(viewFactory, this.container, soundplayer);

        (this.container.getChildByName("paytableText") as Text).text = localizationManager.getByKey("paytable");
        viewFactory.buttonFromSprite(this.container.getChildByName("paytable_button"), this.onClickPaytable.bind(this));

        (this.container.getChildByName("betTextHeader") as Text).text = localizationManager.getByKey("bet");
        this.betSelector = new BetSelector(viewFactory, this.container, slotDefinition);

        this.hideSpin();
    }

    setBalance(balance: number): Promise<void> {
        return new Promise(resolve => {
            textCount(this.balanceText, balance, this.curencySign, resolve);
        });
    }

    setOnSpinPressedCallback(callback: (betState: BetState) => void) {
        this.onSpinPressedCallback = callback;
    }

    setOnPaytablePressedCallback(callback: () => void) {
        this.onPaytablePressedCallback = callback;
    }

    private onClickAutobots() {
        this.onSpin(this.autobotSpin, this.decepticonSpin, BetLines.AUTOBOTS);
    }

    private onClickDecepticons() {
        this.onSpin(this.decepticonSpin, this.autobotSpin, BetLines.DECEPTICONS);
    }

    private onSpin(chosenSprite:Sprite, notChosenSprite:Sprite, betLines:BetLines) {
        this.soundplayer.onBet();
        this.disableAllButtons();
        this.betPanelAnimations.choseSideScenario(chosenSprite, notChosenSprite, () => {
            let betState: BetState = { betLines: betLines, betAmount: this.betSelector.getBet() };
            this.onSpinPressedCallback(betState);
        });
    }

    private onClickPaytable() {
        this.onPaytablePressedCallback();
    }

    showSpin() {
        this.enableAllButtons();
        this.autobotSpin.visible = true;
        this.decepticonSpin.visible = true;
        this.betPanelAnimations.appearScenario(this.autobotSpin, this.decepticonSpin);
    }

    hideSpin() {
        this.autobotSpin.visible = false;
        this.decepticonSpin.visible = false;
    }

    private disableAllButtons(): void {
        disableButton([this.autobotSpin, this.decepticonSpin]);
        this.betSelector.disableAllButtons();
    }

    private enableAllButtons(): void {
        enableButton([this.autobotSpin, this.decepticonSpin]);
        this.betSelector.enableAllButtons();
    }

}