import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { ResultPercentage } from "../../../../extensions/shared-components/assets/game/result-percentage/scripts/result-percentage";
const { ccclass } = _decorator;
@ccclass
export class SeDieThreeResultPercentage extends ResultPercentage {
    calculateWinPercentage(originalChoices: string[], roundHistory: gc.RoundHistories.RoundHistory[]): Record<string, number> {
        const count = super.calculateWin(originalChoices, roundHistory);
        const total = roundHistory.length;
        // Initialize the percentage object
        const percentage: Record<string, number> = {};

        // Calculate primary percentages
        const redValue = Math.round((count["red"] * 100) / total);
        const red3Value = Math.round((((count["red3"] * 100) / total) * redValue) / 100);
        const whiteValue = 100 - redValue;
        const red1Value = Math.round((((count["red1"] * 100) / total) * whiteValue) / 100);

        // Derive secondary values based on relationships
        const red2Value = redValue - red3Value;

        const white3Value = whiteValue - red1Value;

        percentage["red"] = redValue;
        percentage["red2"] = red2Value;
        percentage["red3"] = red3Value;
        percentage["red1"] = red1Value;
        percentage["white"] = whiteValue;
        percentage["white3"] = white3Value;

        return percentage;
    }
}
