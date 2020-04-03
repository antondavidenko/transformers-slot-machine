import { Container, Text } from "pixi.js";
import { ViewFactory } from "../../utils/ViewFactory";
import { LayoutObject, GameLayout } from "./../../data/LayoutsData";
import { LocalizationManager } from "../../services/LocalizationManager";
import { SlotDefinition, SlotSymbol } from "./../../data/ApplicationData";
import { getSymbolByField } from "./../../utils/DataHelper";
import { InjectableClass } from "./../../utils/Injector";
import { StylesManager } from "../../services/StylesManager";

@InjectableClass()
export class PaytableComponent {

    private container: Container;
    private onClosePressedCallback: () => void;

    constructor(private app: PIXI.Application, 
                layout: GameLayout, 
                private slotDefinition: SlotDefinition, 
                localizationManager: LocalizationManager, 
                stylesManager: StylesManager) {

        let viewFactory = new ViewFactory(stylesManager);
        this.container = viewFactory.renderComponent(app.stage, layout.PaytableComponent);
        this.setSide("a");
        (this.container.getChildByName("exitText") as Text).text = localizationManager.getByKey("exit");
        (this.container.getChildByName("autobotText") as Text).text = localizationManager.getByKey("autobots");
        (this.container.getChildByName("decepticonText") as Text).text = localizationManager.getByKey("decepticons");

        viewFactory.buttonFromSprite(this.container.getChildByName("exit_button"), this.onClickExit.bind(this));
        viewFactory.buttonFromSprite(this.container.getChildByName("autobot_button"), this.onClickAutobots.bind(this));
        viewFactory.buttonFromSprite(this.container.getChildByName("decepticon_button"), this.onClickDecepticons.bind(this));

        this.hide();
    }

    private setSide(sidePrefixId: string): void {
        for (let i = 1; i <= 9; i++) {
            let symbol: SlotSymbol = getSymbolByField("id", sidePrefixId + i, this.slotDefinition);
            (this.container.getChildByName("text" + i) as Text).text = `${symbol.description}\n${symbol.points}`;
            (this.container.getChildByName("symbol" + i) as Text).texture = PIXI.Texture.fromImage(symbol.asset);
        }
    }

    private onClickAutobots() {
        this.setSide("a");
    }

    private onClickDecepticons() {
        this.setSide("d");
    }

    private onClickExit() {
        this.onClosePressedCallback();
    }

    show() {
        this.container.visible = true;
    }

    hide() {
        this.container.visible = false;
    }

    setOnClosePressedCallback(callback: () => (void)): void {
        this.onClosePressedCallback = callback;
    }

}