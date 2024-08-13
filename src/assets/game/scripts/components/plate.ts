import gc from "@sg/game-client-base";
import { _decorator, Animation, AudioSource, Node, Sprite, SpriteFrame, tween, UIOpacity, v3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

const { render, handle } = Observer;
const { ccclass, property } = _decorator;

@ccclass()
export class Plate extends ObserverComponent {
    @property(Animation)
    animationShakePlate: Animation = null;

    @property(AudioSource)
    audioShakePlate: AudioSource = null;

    @property(Node)
    nodePlate: Node = null;

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

        const platePos = v3(50, 100, 0);
        const opacityComp = this.nodePlate.getComponent(UIOpacity);
        if (animated) {
            tween(this.nodePlate).to(this.openPlateDuration, { position: platePos }, { easing: "sineInOut" }).start();

            tween(opacityComp).delay(this.openPlateDuration).to(0.2, { opacity: 0 }).start();
        } else {
            this.nodePlate.position = v3(platePos);
            opacityComp.opacity = 0;
        }
    }

    closePlate(animated = false) {
        const opacityComp = this.nodePlate.getComponent(UIOpacity);
        if (animated) {
            const platePos = v3(50, 100, 0);
            this.nodePlate.position = v3(platePos);
            tween(this.nodePlate)
                .to(this.openPlateDuration, { position: v3(0, 0) })
                .start();

            tween(opacityComp).delay(this.openPlateDuration).to(0, { opacity: 255 }).start();
        } else {
            opacityComp.opacity = 255;
            this.nodePlate.position = v3(0, 0);
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
            this.animationShakePlate.play();
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundShake() {
        return this.audioShakeKey;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    handleClosePlate(isStartRound: boolean) {
        if (isStartRound) {
            this.closePlate(false);
        }
    }
}
