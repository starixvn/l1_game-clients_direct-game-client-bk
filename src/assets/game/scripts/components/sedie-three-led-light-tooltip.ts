import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";

import { LedLightTooltip } from "../../../../extensions/shared-components/assets/game/led-light/scripts/components/led-light-tooltip";

const { ccclass, property } = _decorator;

const BetChoice = {
    RED: "red",
    WHITE: "white",
};

@ccclass()
export class SeDieThreeLedLightToolTip extends LedLightTooltip {
    @property(Label)
    lblRed: Label = null;

    @property(Label)
    lblWhite: Label = null;

    private readonly dotsTotal = 3;

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        const { roundId, settlementResult, result } = ledLightInfo;

        this.roundId.string = `#${roundId}`;
        const choiceWin = settlementResult[BetChoice.RED] ? BetChoice.RED : BetChoice.WHITE;
        this.result.string = gc.Translator.gameTranslate(`glossary_${choiceWin}`).toUpperCase();

        let countRed = 0;
        Object.values(result).forEach((value) => {
            if (value) {
                countRed++;
            }
        });
        this.lblRed.string = `${countRed}`;
        this.lblWhite.string = `${this.dotsTotal - countRed}`;
    }
}
