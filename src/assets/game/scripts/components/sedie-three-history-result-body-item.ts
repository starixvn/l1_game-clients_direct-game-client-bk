import gc from "@sg/game-client-base";
import { _decorator, Sprite, SpriteFrame } from "cc";

import { BaseResultBodyItem } from "../../../../extensions/shared-components/assets/game/bet-history/scripts/components/bet-history-body-item";

const { ccclass, property } = _decorator;

@ccclass()
export class SeDieThreeResultBodyItem extends BaseResultBodyItem {
    @property(SpriteFrame)
    sprRed: SpriteFrame = null;

    @property(SpriteFrame)
    sprWhite: SpriteFrame = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        const values = Object.values(result);
        this.node.getComponentsInChildren(Sprite).forEach((component, i) => {
            component.spriteFrame = values[i] ? this.sprRed : this.sprWhite;
        });
    }
}
