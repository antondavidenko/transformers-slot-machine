import { SlotDefinition } from "./../../../data/ApplicationData";
import { ViewFactory } from "../../../utils/ViewFactory";
import { BetpanelSelector } from "./BetpanelSelector";

export class BetSelector {

    private selector: BetpanelSelector;

    constructor(viewFactory: ViewFactory, container, slotDefinition: SlotDefinition) {
        slotDefinition.betOptions;
        slotDefinition.defaultBetOption;
        this.selector = new BetpanelSelector(
            {
                currentOption: slotDefinition.defaultBetOption,
                allOptions: slotDefinition.betOptions
            },
            viewFactory,
            {
                plusButton: container.getChildByName("bet_button_plus"),
                minusButton: container.getChildByName("bet_button_minus"),
                selectorText: container.getChildByName("betText")
            }
        );
    }

    getBet():number {
        return this.selector.getCurrentOption();
    }

    disableAllButtons():void {
        this.selector.disableAllButtons();
    }

    enableAllButtons():void {
        this.selector.enableAllButtons();
    }    

}