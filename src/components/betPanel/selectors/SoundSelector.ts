import { ViewFactory } from "../../../utils/ViewFactory";
import { BetpanelSelector } from "./BetpanelSelector";
import { Soundplayer } from "../../../services/Soundplayer";

export class SoundSelector {

    private selector: BetpanelSelector;

    constructor(viewFactory: ViewFactory, container, private soundplayer:Soundplayer) {
        this.selector = new BetpanelSelector(
            {
                currentOption: 1,
                allOptions: [0, 25, 50, 75, 100]
            },
            viewFactory,
            {
                plusButton: container.getChildByName("sound_button_plus"),
                minusButton: container.getChildByName("sound_button_minus"),
                selectorText: container.getChildByName("soundText")
            }
        );
        this.selector.setOnValueChangeCallback(this.setSoundVolume.bind(this));
        this.setSoundVolume();
    }

    private setSoundVolume() {
        this.soundplayer.setVolume(Math.pow(this.getVolume()/100, 3));
    }

    getVolume(): number {
        return this.selector.getCurrentOption();
    }

    disableAllButtons(): void {
        this.selector.disableAllButtons();
    }

    enableAllButtons(): void {
        this.selector.enableAllButtons();
    }

}