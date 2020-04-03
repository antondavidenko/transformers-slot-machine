import { Text, Sprite } from "pixi.js";
import { ViewFactory } from "../../../utils/ViewFactory";
import { disableButton, enableButton } from "../../../utils/ViewHelper";

const plusDisabled = "images/betpanel_plus.png";
const minusDisabled = "images/betpanel_minus.png";
const plusEnabled = "images/betpanel_plus_active.png";
const minusEnabled = "images/betpanel_minus_active.png";

export type SelectorProperties = {
    currentOption: number;
    allOptions: number[];
}

export type SelectorView = {
    plusButton: Sprite;
    minusButton: Sprite;
    selectorText: Text;
}

export class BetpanelSelector {

    private currentOption: number;
    private allOptions: number[];
    private selectorText: Text;
    private plusButton: Sprite;
    private minusButton: Sprite;
    private onValueChange: (value) => void;

    constructor(selectorProperties: SelectorProperties, viewFactory: ViewFactory, selectorView: SelectorView) {

        this.currentOption = selectorProperties.currentOption;
        this.allOptions = selectorProperties.allOptions;

        this.plusButton = viewFactory.buttonFromSprite(selectorView.plusButton, this.onClickPlus.bind(this));
        this.minusButton = viewFactory.buttonFromSprite(selectorView.minusButton, this.onClickMinus.bind(this));
        this.selectorText = selectorView.selectorText;

        this.updateBetText();
    }

    setOnValueChangeCallback(callback: (value: number) => void) {
        this.onValueChange = callback;
    }

    private updateBetText(): void {
        this.selectorText.text = this.allOptions[this.currentOption].toString();
        this.updateButtonsState();
        if (this.onValueChange) {
            this.onValueChange(this.getCurrentOption());
        }
    }

    private updateButtonsState() {
        let maxBetOption = this.allOptions.length - 1;
        if (this.currentOption === 0) {
            disableButton([this.minusButton]);
            this.minusButton.texture = PIXI.Texture.fromImage(minusDisabled);
        } else if (this.currentOption === maxBetOption) {
            disableButton([this.plusButton]);
            this.plusButton.texture = PIXI.Texture.fromImage(plusDisabled);
        } else {
            this.enableAllButtons();
        }
    }

    private onClickMinus() {
        this.currentOption--;
        this.currentOption = this.currentOption < 0 ? 0 : this.currentOption;
        this.updateBetText();
    }

    private onClickPlus() {
        let maxBetOption = this.allOptions.length - 1;
        this.currentOption++;
        this.currentOption = this.currentOption > maxBetOption ? maxBetOption : this.currentOption;
        this.updateBetText();
    }

    getCurrentOption(): number {
        return this.allOptions[this.currentOption];
    }

    disableAllButtons(): void {
        disableButton([this.plusButton, this.minusButton]);
        this.plusButton.texture = PIXI.Texture.fromImage(plusDisabled);
        this.minusButton.texture = PIXI.Texture.fromImage(minusDisabled);
    }

    enableAllButtons(): void {
        enableButton([this.plusButton, this.minusButton]);
        this.plusButton.texture = PIXI.Texture.fromImage(plusEnabled);
        this.minusButton.texture = PIXI.Texture.fromImage(minusEnabled);
    }

}