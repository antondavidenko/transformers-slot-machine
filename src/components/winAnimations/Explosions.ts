import { Application, Container } from "pixi.js";
import { Soundplayer } from "../../services/Soundplayer";
import { promiseDelay } from "./../../utils/PromiseHelpers";

const explosionNumber = 50;
const animationFrames = 26;

export class Explosions {

    private explosionSprites = [];

    constructor(private app: Application, private container: Container, private soundplayer: Soundplayer) {
        this.prepareExplosions();
        this.hideExplosions();
    }

    private prepareExplosions() {
        let explosionTextures = [];

        for (let i = 0; i < animationFrames; i++) {
            var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i + 1) + '.png');
            explosionTextures.push(texture);
        }

        for (let i = 0; i < explosionNumber; i++) {
            let explosion = new PIXI.extras.AnimatedSprite(explosionTextures);
            explosion.anchor.set(0.5);
            explosion.rotation = Math.random() * Math.PI;
            explosion.scale.set(0.75 + Math.random() * 0.5);
            this.container.addChild(explosion);
            this.explosionSprites.push(explosion);
        }
    }

    showExplosions(rect:{x:number, y:number, width:number, height:number}) {
        for (let i = 0; i < explosionNumber; i++) {
            let explosion = this.explosionSprites[i]
            explosion.x = rect.x + Math.random() * rect.width;
            explosion.y = rect.y + Math.random() * rect.height;
            explosion.visible = true;
            explosion.gotoAndPlay(Math.random() * 27);
        }
    }

    hideExplosions() {
        for (let i = 0; i < explosionNumber; i++) {
            let explosion = this.explosionSprites[i]
            explosion.stop();
            explosion.visible = false;
        }
    }

    async explosionsSound(): Promise<void> {
        this.soundplayer.onExplosion();
        await promiseDelay(250);
        this.soundplayer.onExplosion();
        await promiseDelay(250);
        this.soundplayer.onExplosion();
        await promiseDelay(250);
        this.soundplayer.onExplosion();
        await promiseDelay(250);
        this.soundplayer.onExplosion();
        await promiseDelay(250);
    }

}