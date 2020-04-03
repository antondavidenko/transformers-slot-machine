import { SlotMachineFlow } from "./finiteStateMachine/SlotMachineFlow";

let app: PIXI.Application;
const sceneWidth = 1280;
const sceneHeight = 720;
const backgroundColor = 0x13182e;

function start(): void {
    app = initApp();
    onResize();
    window.addEventListener("resize", onResize, false);
    new SlotMachineFlow(app);
}

function initApp(): PIXI.Application {
    const app = new PIXI.Application({
        width: sceneWidth, 
        height: sceneHeight, 
        backgroundColor: backgroundColor
    });
    document.getElementById("game").appendChild(app.view);
    return app;
}

function onResize() {
    let gamePosX = 0;
    let gamePosY = 0;

    const sceneRatio = sceneWidth / sceneHeight;

    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;
    const stageRatio = stageWidth / stageHeight;
    let scale = 1;

    if (stageRatio <= sceneRatio) {
        scale = stageWidth / sceneWidth;
        gamePosY = (stageHeight - (sceneHeight * scale)) / 2;
    } else {
        scale = stageHeight / sceneHeight;
        gamePosX = (stageWidth - (sceneWidth * scale)) / 2;
    }

    let gameWidth = sceneWidth * scale;
    let gameHeight = sceneHeight * scale;

    let style = app.view.style;

    style.position = "fixed";
    style.width = gameWidth.toFixed(0) + "px";
    style.height = gameHeight.toFixed(0) + "px";
    style.left = gamePosX.toFixed(2) + "px";
    style.top = gamePosY.toFixed(2) + "px";
}

window.addEventListener("load", () => {
    start();
    window.document.getElementById("web-font").style.display = "none";
});