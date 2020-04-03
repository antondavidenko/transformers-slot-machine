import { ResourcesLoaderComponent } from "./resourcesLoader/ResourcesLoaderComponent";
import { BetPanelComponent } from "./betPanel/BetPanelComponent";
import { ReelsComponent } from "./reels/ReelsComponent";
import { ServerApiComponent } from "./serverApi/ServerApiComponent";
import { BackgroundComponent } from "./background/BackgroundComponent";
import { WinMeterComponent } from "./winMeter/WinMeterComponent";
import { Soundplayer } from "../services/Soundplayer";
import { ApplicationData } from "./../data/ApplicationData";
import { PaytableComponent } from "./../components/paytable/PaytableComponent";
import { WinAnimationsComponent } from "./../components/winAnimations/WinAnimationsComponent";
import { Injector } from "./../utils/Injector";

export class ComponentsHolder {

    protected resourcesLoaderComponent: ResourcesLoaderComponent = new ResourcesLoaderComponent();
    protected betpanel: BetPanelComponent;
    protected reels: ReelsComponent;
    protected serverApi: ServerApiComponent;
    protected backgroundComponent: BackgroundComponent;
    protected winMeter: WinMeterComponent;
    protected winAnimations: WinAnimationsComponent;
    protected paytable: PaytableComponent;

    constructor() { }

    protected initAllComponents(applicationData: ApplicationData) {
        let injector = new Injector()
        injector.addDependency(applicationData.gamelayout);
        injector.addDependency(applicationData.pixiAplication);
        injector.addDependency(applicationData.slotDefinition);
        injector.addDependency(new Soundplayer());
        injector.addDependency(applicationData.localization);
        injector.addDependency(applicationData.styles);
        
        this.backgroundComponent = injector.resolve(BackgroundComponent);
        this.betpanel = injector.resolve(BetPanelComponent);
        this.reels = injector.resolve(ReelsComponent);
        this.serverApi = injector.resolve(ServerApiComponent);
        this.winMeter = injector.resolve(WinMeterComponent);
        this.winAnimations = injector.resolve(WinAnimationsComponent);
        this.paytable = injector.resolve(PaytableComponent);
    }

}