import { WinningResult } from "./../../../../extensions/shared-components/assets/shared/common-components/winning-result/scripts/winning-result";
import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import { AudioContainer } from "../../../../extensions/shared-components/assets/game/audios/scripts/component/audio-container";
import { ChipFlying } from "../../../../extensions/shared-components/assets/game/chip-flying/scripts/components/chip-flying";
import GameComponent from "../../../../extensions/shared-components/assets/game/scripts/components/game-component";
import { FunctionUtils, isIOS } from "../../../../extensions/shared-components/assets/shared/utils";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { IResult, Plate } from "./plate";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
const { Rounds, Connection, HideGame, Settlements, FormatUtils, RoundHistories, GameBaccaratX } = gc;

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property(ChipFlying)
    chipFlying: ChipFlying = null;
    override namespace = settings.name;
    override containerOptions = containerOptions;

    @property(Node)
    nodeAudioContainer: Node = null;

    @property(Node)
    nodePlate: Node = null;

    @property(Node)
    nodeWinning: Node = null;

    compPlate: Plate = null;
    protected enableFixHandleFinish = true;
    private audioContainer: AudioContainer = null;
    private winningResult: WinningResult = null;
    private soundWinChoice = ["red", "white"];
    private histories: gc.RoundHistories.RoundHistory[] = [];

    onLoad() {
        this.audioContainer = this.nodeAudioContainer.getComponent(AudioContainer);
        this.compPlate = this.nodePlate.getComponent(Plate);
        this.winningResult = this.nodeWinning.getComponent(WinningResult);
        super.onLoad();
    }

    async showResult(
        result: gc.GameServiceMessage.TResult,
        hasAnimation: boolean,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ) {
        if (result) {
            this.compPlate.setDots(result as IResult);
            await this.compPlate.openPlate(hasAnimation);
            this.winningResult.setSettlementResult(settlementResult);
            this.winningResult.show();
            const winChoice = this.soundWinChoice.find((choice) => settlementResult[choice]);
            this.playSound(`${winChoice}_wins_${gc.Translator.getLanguageId()}`);
        }
    }

    async renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        console.log("receive finish");
        if (!currentFinish || !this.enableFixHandleFinish) {
            return;
        }
        const { result, settlementResult } = currentFinish as any;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }
        if (isIOS()) {
            await FunctionUtils.delay(800);
        }

        this.showResult(result, true, settlementResult).then(() => {
            this.finishShowResult(result, settlementResult);
            this.chipFlying.callActionPayChips();
        });
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const lastRound = firstJoinGameHistory.roundHistory as any;
        if (lastRound) {
            const { result, settlementResult, roundId } = lastRound;
            console.log("last Round", lastRound);
            console.log("last history", this.histories[0].roundId);
            if (firstJoinGameHistory.animationHighlight && roundId >= this.histories[0].roundId) {
                console.log("join game have finish");
                this.showResult(result, false, settlementResult);
                return;
            }
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    fadeVolumeBgMusic(roundState: string) {
        if (roundState === Rounds.ROUND_STATE.LOCKING_BET) {
            this.audioContainer.updateVolumeMusicSource(0.3, 3);
        } else if (roundState === Rounds.ROUND_STATE.SHOW_RESULT) {
            this.audioContainer.updateVolumeMusicSource(1, 3);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    disableWinNotice(isStartingRound: boolean) {
        isStartingRound && this.winningResult.hideQuickly();
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.histories)
    storeHistories(histories: gc.RoundHistories.RoundHistory[]) {
        if (histories && histories.length > 0) {
            // this.histories = histories;
            //only store last round histories
            const lastRoundHistory = [];
            for (let i = 0; i < 1; i++) {
                if (i < histories.length) {
                    const { roundId, result, settlementResult } = histories[i];
                    lastRoundHistory.push({ roundId, result, settlementResult });
                }
            }
            this.histories = lastRoundHistory;
        }
    }
}
