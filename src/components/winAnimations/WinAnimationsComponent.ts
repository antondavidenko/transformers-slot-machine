
import { Outcome } from "./../../data/PlayerData";
import { SlotDefinition } from "../../data/ApplicationData";
import { Application, Container } from "pixi.js";
import { ViewFactory } from "../../utils/ViewFactory";
import { Soundplayer } from "../../services/Soundplayer";
import { LayoutObject, GameLayout } from "../../data/LayoutsData";
import { promiseDelay } from "./../../utils/PromiseHelpers";
import { Explosions } from "./Explosions";
import { Shootings } from "./Shootings";
import { InjectableClass } from "./../../utils/Injector";

const autobotRect = {x:100, y:100, width:400, height:500 };
const decepticonsRect = {x:800, y:100, width:400, height:500 };
const drawRect = {x:100, y:100, width:1100, height:500 };

@InjectableClass()
export class WinAnimationsComponent {

    private container: Container;
    private explosions:Explosions;
    private shootings:Shootings;

    constructor(private app: Application, 
                layout: GameLayout, 
                private slotDefinition: SlotDefinition, 
                private soundplayer: Soundplayer) {

        let viewFactory = new ViewFactory(null);
        this.container = viewFactory.renderComponent(app.stage, []);

        this.explosions = new Explosions(app, this.container, soundplayer);
        this.shootings = new Shootings(this.container, layout.ReelsComponent, slotDefinition, soundplayer);
    }

    async showSkirmish(): Promise<void> {
        this.shootings.showSkirmish();
        await promiseDelay(1500);
    }

    async showExplosions(outcome:Outcome): Promise<void> {
        let rect;
        if (outcome.autobotsPointsSummary > outcome.decepticonsPointsSummary) {
            rect = decepticonsRect;
        } else if (outcome.autobotsPointsSummary < outcome.decepticonsPointsSummary) {
            rect = autobotRect;
        } else {
            rect = drawRect;
        }

        this.explosions.showExplosions(rect);
        await this.explosions.explosionsSound();
        this.explosions.hideExplosions();
    }

}