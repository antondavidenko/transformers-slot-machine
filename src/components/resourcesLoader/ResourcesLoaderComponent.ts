import { Application } from "pixi.js";
import { SlotDefinition } from "./../../data/ApplicationData";
import { GameLayout } from "./../../data/LayoutsData";
import { LoaderBar } from "./LoaderBar";

const assetListUrl = "configs/assetslist.json";
const slotDefinitionUrl = "configs/slot-definition.json";
const gamelayoutUrl = "configs/gamelayout.json";
const localization = "localization/en.json";
const styles = "localization/styles.json";

export class ResourcesLoaderComponent {

    constructor() {}

    async loadAllResources(app: Application):Promise<void> {
        let loaderBar:LoaderBar = new LoaderBar(app);
        return new Promise(async resolve => {
            await this.loadResources([localization]);
            await this.loadResources([styles]);
            await this.loadResources([assetListUrl]);
            let imagesList: string[] = PIXI.loader.resources[assetListUrl].data.imagesList;
            PIXI.loader.onProgress.add(() => {
                loaderBar.showProgress( Math.round(PIXI.loader.progress) - 1);
            });
            await this.loadResources(imagesList);
            PIXI.loader.onProgress.add(() => {});
            await this.loadResources([slotDefinitionUrl]);
            await this.loadResources([gamelayoutUrl]);
            loaderBar.clear();
            resolve();
        });
    }

    getSlotDefinition():SlotDefinition {
        return PIXI.loader.resources[slotDefinitionUrl].data;
    }

    getGamelayout():GameLayout {
        return PIXI.loader.resources[gamelayoutUrl].data;
    }

    getLocalization():Map<string,string> {
        return PIXI.loader.resources[localization].data;
    }

    getStyles():Map<string,string> {
        return PIXI.loader.resources[styles].data;
    }    

    private loadResources(resources: string[]):Promise<void> {
        return new Promise(resolve => {
            PIXI.loader
                .add(resources)
                .load(resolve);
        });
    }

}