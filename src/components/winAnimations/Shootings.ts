import { SlotDefinition } from "../../data/ApplicationData";
import { Point, Container } from "pixi.js";
import { Soundplayer } from "../../services/Soundplayer";
import { LayoutObject } from "../../data/LayoutsData";
import { promiseDelay } from "../../utils/PromiseHelpers";

const beamHight = 10;
const beamColors = [0x3500FA, 0xff00d2, 0xff0000, 0x2dff28, 0xfff600];

export class Shootings {

    private decepticonsList: string[] = ["R3S0", "R3S1", "R3S2", "R2S0", "R2S1"];
    private autobotsList: string[] = ["R0S0", "R0S1", "R0S2", "R1S0", "R1S1"];
    private decepticonsTargets: string[] = ["R0S0", "R0S1", "R0S2", "R1S0", "R1S1"];
    private autobotsTargets: string[] = ["R3S0", "R3S1", "R3S2", "R2S0", "R2S1"];
    private graphics = new PIXI.Graphics();

    constructor(private container: Container, private layout: LayoutObject[], private slotDefinition: SlotDefinition, private soundplayer: Soundplayer) {
        this.graphics = new PIXI.Graphics();
    }

    async showBeam(x1: number, y1: number, x2: number, y2: number) {
        let path = [x1, y1, x2, y2 + beamHight, x2, y2 - beamHight];
        this.graphics.lineStyle(0);
        this.graphics.beginFill(this.randomColor(), 0.75);
        this.graphics.drawPolygon(path);
        this.graphics.endFill();
        this.container.addChild(this.graphics);
        this.soundplayer.onShot();
        await promiseDelay(250);
        this.graphics.clear();
    }

    private randomColor(): number {
        return beamColors[Math.floor(Math.random() * beamColors.length)];
    }

    private getPositionByLayoutId(layoutId: string): Point {
        let object = this.layout.find(element => element.id == layoutId);
        return new Point(object.x, object.y);
    }

    async traceBeam(layoutId1: string, layoutId2: string) {
        let point1 = this.getPositionByLayoutId(layoutId1);
        let point2 = this.getPositionByLayoutId(layoutId2);
        await this.showBeam(point1.x, point1.y, point2.x, point2.y);
    }

    async showSkirmish() {
        this.shuffle(this.decepticonsList);
        this.shuffle(this.autobotsList);
        this.shuffle(this.decepticonsTargets);
        this.shuffle(this.autobotsTargets);
        for (let i = 0; i < this.decepticonsList.length; i++ ) {
            this.traceBeam(this.decepticonsList[i], this.decepticonsTargets[i]);
            await this.traceBeam(this.autobotsList[i], this.autobotsTargets[i]);
        }
    }

    private shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

}