import gc from "@sg/game-client-base";
import { _decorator, sp, Sprite, SpriteFrame } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

const { render, handle } = Observer;
const { ccclass, property } = _decorator;

const PlateAnimation = {
    IDLE: "idle",
    SHAKE: "shake",
    OPEN: "open",
    CLOSE: "close",
};

@ccclass()
export class Plate extends ObserverComponent {
    @property(sp.Skeleton)
    spinePlate: sp.Skeleton = null;

    @property({ type: Sprite })
    spriteDots: Sprite[] = [];

    @property(SpriteFrame)
    frameDotRed: SpriteFrame = null;

    @property(SpriteFrame)
    frameDotWhite: SpriteFrame = null;

    private readonly openPlateDuration = 0.5;
    private audioShakeKey = "shake";

    showDots(show: boolean) {
        this.spriteDots.forEach((dot) => {
            dot.node.active = show;
        });
    }

    openPlate(animated: boolean) {
        this.showDots(true);

        if (animated) {
            AnimationUtils.playSpine(this.spinePlate, PlateAnimation.OPEN);
        } else {
            AnimationUtils.playSpine(this.spinePlate, PlateAnimation.OPEN, false, 0);
        }
    }

    closePlate(animated = false) {
        if (animated) {
            AnimationUtils.playSpine(this.spinePlate, PlateAnimation.CLOSE);
        } else {
            AnimationUtils.playSpine(this.spinePlate, PlateAnimation.CLOSE, false, 0);
        }
    }

    setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.spriteDots[index].spriteFrame = result[key] ? this.frameDotRed : this.frameDotWhite;
        });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    async shakePlate(isStartRound: boolean) {
        if (isStartRound) {
            this.closePlate(true);
            await AnimationUtils.delayTime(this.openPlateDuration);
            this.playSoundShake();
            AnimationUtils.playSpine(this.spinePlate, PlateAnimation.SHAKE);
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundShake() {
        return this.audioShakeKey;
    }
}
