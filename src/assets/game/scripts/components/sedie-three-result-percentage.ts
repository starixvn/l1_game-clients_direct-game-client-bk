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
        let redValue = Math.round((count["red"] * 100) / total);
        let red3Value = Math.round((count["red3"] * 100) / total);
        let red1Value = Math.round((count["red1"] * 100) / total);

        // Ensure valid red and red3 relationship
        if (red3Value > redValue) {
            red3Value = redValue; // Adjust red3 to be no more than red
        }

        // Calculate secondary values
        let red2Value = redValue - red3Value;
        let whiteValue = 100 - redValue;
        let white3Value = whiteValue - red1Value;

        // Adjust to ensure non-negative values
        if (white3Value < 0) {
            white3Value = 0;
            red1Value = whiteValue; // Adjust red1 to ensure total
        }

        // Final adjustments
        redValue = red2Value + red3Value;
        whiteValue = red1Value + white3Value;

        const totalPercentage = redValue + whiteValue;
        const difference = 100 - totalPercentage;

        if (difference !== 0) {
            // Adjust to make total exactly 100%
            if (white3Value + difference >= 0) {
                white3Value += difference;
            } else {
                red2Value += difference;
            }
        }

        // Assign calculated values to percentage object
        percentage["red"] = redValue;
        percentage["red2"] = red2Value;
        percentage["red3"] = red3Value;
        percentage["red1"] = red1Value;
        percentage["white"] = whiteValue;
        percentage["white3"] = white3Value;

        return percentage;
    }
}
