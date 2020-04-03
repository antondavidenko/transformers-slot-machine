import { ViewFactory } from "../../utils/ViewFactory";
import { GameLayout } from "./../../data/LayoutsData";
import { InjectableClass } from "./../../utils/Injector";

@InjectableClass()
export class BackgroundComponent {

    constructor(app: PIXI.Application, 
                layout: GameLayout) {

        let viewFactory = new ViewFactory(null);
        viewFactory.renderComponent(app.stage, layout.BackgroundComponent);
    }
}