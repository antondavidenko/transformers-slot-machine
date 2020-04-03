import { Text, Container, Application, Point } from "pixi.js";
import { OutcomeStatus, Outcome } from "./../../data/PlayerData";
import { ViewFactory } from "../../utils/ViewFactory";
import { Soundplayer } from "../../services/Soundplayer";
import { LayoutObject, GameLayout } from "./../../data/LayoutsData";
import { LocalizationManager } from "../../services/LocalizationManager";
import { InjectableClass } from "./../../utils/Injector";
import { StylesManager } from "../../services/StylesManager";

export type PointsAccumulationPayload = {
    position: Point;
    points: number;
    isAutobot: boolean;
};

@InjectableClass()
export class WinMeterComponent {

    private container: Container;
    private autobotsPoints: Text;
    private decepticonPoints: Text;
    private labelsMap = new Map();

    private autobotTemplarySum: number;
    private decepticonTemplarySum: number;

    constructor(private app: Application,
                layout: GameLayout,
                private soundplayer: Soundplayer,
                localizationManager:LocalizationManager,
                stylesManager: StylesManager) {

        let viewFactory = new ViewFactory(stylesManager);
        this.container = viewFactory.renderComponent(app.stage, layout.WinMeterComponent);

        let winText = this.container.getChildByName("winText") as Text;
        winText.text = localizationManager.getByKey("win");
        this.labelsMap.set(OutcomeStatus.WIN, winText);

        let loseText = this.container.getChildByName("loseText") as Text;
        loseText.text = localizationManager.getByKey("lose");
        this.labelsMap.set(OutcomeStatus.LOSE, loseText);

        let drawText = this.container.getChildByName("drawText") as Text;
        drawText.text = localizationManager.getByKey("draw");
        this.labelsMap.set(OutcomeStatus.DRAW, drawText);

        this.autobotsPoints = this.container.getChildByName("autobotsPoints");
        this.decepticonPoints = this.container.getChildByName("decepticonPoints");

        this.hide();
    }

    showResult(outcome: Outcome): void {
        this.labelsMap.get(outcome.outcomeStatus).visible = true;
        this.playSound(outcome.autobotsPointsSummary, outcome.decepticonsPointsSummary);
    }

    showPointsAccumulation(payload: PointsAccumulationPayload): void {
        if (payload.isAutobot) {
            this.autobotTemplarySum += payload.points;
            this.autobotsPoints.text = this.autobotTemplarySum.toString();
        } else {
            this.decepticonTemplarySum += payload.points;
            this.decepticonPoints.text = this.decepticonTemplarySum.toString();
        }
    }

    private playSound(autobotsPointsSummary: number, decepticonsPointsSummary: number): void {
        if (autobotsPointsSummary > decepticonsPointsSummary) {
            this.soundplayer.onAutobotsWin();
        } else if (autobotsPointsSummary < decepticonsPointsSummary) {
            this.soundplayer.onDecepticonsWin();
        } else {
            this.soundplayer.onDraw();
        }
    }

    hide(): void {
        this.labelsMap.get(OutcomeStatus.LOSE).visible = false;
        this.labelsMap.get(OutcomeStatus.WIN).visible = false;
        this.labelsMap.get(OutcomeStatus.DRAW).visible = false;
        this.autobotsPoints.text = "";
        this.decepticonPoints.text = "";
        this.autobotTemplarySum = 0;
        this.decepticonTemplarySum = 0;
    }

}