const betSound = './sounds/bet.mp3';
const spinSound = './sounds/spin.mp3';
const awinSound = './sounds/awin.mp3';
const dwinSound = './sounds/dwin.mp3';
const drawSound = './sounds/draw.mp3';
const explosions = ['./sounds/explode1.mp3','./sounds/explode2.mp3','./sounds/explode3.mp3'];
const shootings = ['./sounds/shot1.mp3','./sounds/shot2.mp3','./sounds/shot3.mp3'];

export class Soundplayer {

    private sound:Howl = new Howl({src:betSound});

    onBet() {
        this.playSound(betSound);
    }

    onSpin() {
        this.playSound(spinSound, true);
    }

    onAutobotsWin() {
        this.playSound(awinSound, true);
    }

    onDecepticonsWin() {
        this.playSound(dwinSound, true);
    }
    
    onDraw() {
        this.playSound(drawSound, true);
    }

    onExplosion() {
        this.playSound(this.randomSound(explosions));
    }

    onShot() {
        this.playSound(this.randomSound(shootings));
    }

    setVolume(volume:number) {
        Howler.volume(volume);
    }

    private playSound(src:string, mainsound:boolean = false):void {
        if (mainsound) {
            this.sound.stop();
            this.sound = new Howl({src: src})
            this.sound.play();
        } else {
            new Howl({src: src}).play();
        }
    }

    private randomSound(array:string[]):string {
        return array[Math.floor(Math.random() * array.length)];
    }

}