import { Application } from "pixi.js";
import { SlotMachineEvents } from "./Config";
import { TransitionsLogicEngine } from "./TransitionsLogicEngine";
import { ISlotMachineContext } from "./ISlotMachineContext";
import { ComponentsHolder } from "./../components/ComponentsHolder";
import { promiseDelay } from "./../utils/PromiseHelpers";
import { getSymbolByField } from "./../utils/DataHelper";
import { ApplicationData, SlotDefinition } from "./../data/ApplicationData";
import { PlayerData } from "./../data/PlayerData";
import { SymbolAppearPayload } from "./../components/reels/ReelsComponent";
import { GameLayout } from "../data/LayoutsData";
import { LocalizationManager } from "../services/LocalizationManager";
import { StylesManager } from "../services/StylesManager";

export class SlotMachineFlow extends ComponentsHolder implements ISlotMachineContext {

    private battleStateMachine: TransitionsLogicEngine = new TransitionsLogicEngine(this);
    private applicationData: ApplicationData;
    private playerData: PlayerData = new PlayerData();

    constructor(private app: Application) {
        super();
        this.battleStateMachine.run();
    }

    async onLoading(): Promise<void> {
        await this.resourcesLoaderComponent.loadAllResources(this.app);
        this.applicationData = {
            pixiAplication: this.app,
            gamelayout: new GameLayout(this.resourcesLoaderComponent.getGamelayout()),
            slotDefinition: new SlotDefinition(this.resourcesLoaderComponent.getSlotDefinition()),
            localization: new LocalizationManager(this.resourcesLoaderComponent.getLocalization()),
            styles: new StylesManager(this.resourcesLoaderComponent.getStyles())
        }
        this.playerData.balance = this.applicationData.slotDefinition.defaultBalance;
        this.battleStateMachine.dispatchEvent(SlotMachineEvents.LOADING_COMPLETED_EVENT);
    };

    onInit(): void {
        this.initAllComponents(this.applicationData);
        this.betpanel.setOnSpinPressedCallback((betState) => {
            this.playerData.betState = betState;
            this.battleStateMachine.dispatchEvent(SlotMachineEvents.START_SPIN_EVENT);
        });
        this.betpanel.setOnPaytablePressedCallback(() => {
            this.battleStateMachine.dispatchEvent(SlotMachineEvents.SHOW_PAYTABLE);
        });
        this.reels.onSymbolAppear((payload: SymbolAppearPayload) => {
            let points = getSymbolByField("asset", payload.asset, this.applicationData.slotDefinition).points;
            this.winMeter.showPointsAccumulation({ ...payload, points: points });
        });
        this.paytable.setOnClosePressedCallback(() => {
            this.battleStateMachine.dispatchEvent(SlotMachineEvents.HIDE_PAYTABLE);
        });
        this.battleStateMachine.dispatchEvent(SlotMachineEvents.SPIN_ENABLED_EVENT);
    };

    onIdle(): void {
        this.betpanel.showSpin();
        this.paytable.hide();
    };

    async onSpinStarting(): Promise<void> {
        this.betpanel.hideSpin();
        this.playerData = await this.serverApi.serverRequest(this.playerData);
        this.battleStateMachine.dispatchEvent(SlotMachineEvents.SPIN_STARTED_EVENT);
    };

    async onSpinning(): Promise<void> {
        await this.reels.showReelPicture(this.playerData.outcome.reelPicture);
        this.battleStateMachine.dispatchEvent(SlotMachineEvents.STOP_REEL_EVENT);
    };

    async onStopping(): Promise<void> {
        await promiseDelay(500);
        await this.winAnimations.showSkirmish()
        this.reels.hideLosers(this.playerData.outcome);
        await this.winAnimations.showExplosions(this.playerData.outcome);
        await promiseDelay(1500);
        this.winMeter.showResult(this.playerData.outcome);
        await this.betpanel.setBalance(this.playerData.balance);
        await promiseDelay(2500);
        this.battleStateMachine.dispatchEvent(SlotMachineEvents.PRESENT_SPIN_OUTCOME_EVENT);
    };

    async onBasegameOutcome(): Promise<void> {
        this.winMeter.hide();
        this.reels.hide();
        await promiseDelay(1500);
        this.battleStateMachine.dispatchEvent(SlotMachineEvents.SPIN_OUTCOME_PRESENTED_EVENT);
    };

    onPaytable(): void {
        this.betpanel.hideSpin();
        this.paytable.show();
    };

}