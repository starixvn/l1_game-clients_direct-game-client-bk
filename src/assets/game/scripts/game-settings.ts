import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";

import { sharedContainer } from "../../scripts/shared-container";

export const settings = {
    id: 95,
    name: "SeDie3",
    namespaces: ["SeDie3"],
    durations: {
        wholeRound: 39,
        lockingBet: 3,
        placingBet: 30,
        generatingResult: 1,
        showingResult: 6,
        startRound: 2,
    },
    numberOfRoundHistory: 100,
};

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
        container.bind(LogStore).to(LogStore);
    },
    features: [...gc.defaultFeatures, gc.BetDetailsNew],
};
