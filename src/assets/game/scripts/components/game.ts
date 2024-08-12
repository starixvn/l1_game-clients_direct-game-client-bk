import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import { AudioContainer } from "../../../../extensions/shared-components/assets/game/audios/scripts/component/audio-container";
import { ChipFlying } from "../../../../extensions/shared-components/assets/game/chip-flying/scripts/components/chip-flying";
import { CardModel } from "../../../../extensions/shared-components/assets/game/poker-cards/scripts/poker-card";
import GameComponent from "../../../../extensions/shared-components/assets/game/scripts/components/game-component";
import { WinningResult } from "../../../../extensions/shared-components/assets/shared/common-components/winning-result/scripts/winning-result";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
const { Rounds, Connection, HideGame, Settlements, FormatUtils, RoundHistories, GameBaccaratX } = gc;

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

export interface TeamInfo {
    score: number;
    cards: CardModel[];
}

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property(ChipFlying)
    chipFlying: ChipFlying = null;
    override namespace = settings.name;
    override containerOptions = containerOptions;

    @property(Node)
    nodeWinNotice: Node = null;

    @property(Node)
    nodeAudioContainer: Node = null;

    protected enableFixHandleFinish = true;
    private audioContainer: AudioContainer = null;

    private soundWinChoice = ["player", "banker", "tie"];

    onLoad() {
        this.audioContainer = this.nodeAudioContainer.getComponent(AudioContainer);
        super.onLoad();
    }

    async showResult(
        result: gc.GameServiceMessage.TResult,
        hasAnimation: boolean,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ) {
        if (result) {
            const winning = this.getWinningResult();
            winning.hideQuickly();
            if (hasAnimation) {
                //
                // await this.baccaratXCardsUi.openCards(result as any, settlementResult, hasAnimation);
            } else {
                // this.baccaratXCardsUi.openCards(result as any, settlementResult, hasAnimation);
            }
            const winChoice = this.soundWinChoice.find((choice) => settlementResult[choice]);
            this.playSound(`${winChoice}-${gc.Translator.getLanguageId()}`);
            winning?.setSettlementResult(settlementResult);
            winning?.show();
        }
    }

    getWinningResult() {
        return this.nodeWinNotice.getComponent(WinningResult);
    }

    renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish || !this.enableFixHandleFinish) {
            return;
        }
        const { result, settlementResult, usedCardIndexes } = currentFinish as any;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }

        // this.baccaratXCardsUi.currentCardIndex = usedCardIndexes[0];
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
            const { result, settlementResult } = lastRound;
            const animated = firstJoinGameHistory.animationHighlight;
            if (animated) {
                this.parseOddsMultipliers(lastRound);

                this.showResult(result, false, settlementResult);
                return;
            }
        }
    }

    @handle(GameBaccaratX.Multiplier.BaccaratMultipliersHandler, (handler, lastRound) => handler.parseOddsMultiplers(lastRound))
    parseOddsMultipliers(lastRound) {
        return lastRound;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    disableWinNotice(isStartingRound: boolean) {
        isStartingRound && this.getWinningResult()?.hideQuickly();
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoePhase)
    disableWinNotice1(newShoePhase: boolean) {
        newShoePhase && this.getWinningResult()?.hideQuickly();
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    fadeVolumeBgMusic(roundState: string) {
        if (roundState === Rounds.ROUND_STATE.LOCKING_BET) {
            this.audioContainer.updateVolumeMusicSource(0.3, 3);
        } else if (roundState === Rounds.ROUND_STATE.SHOW_RESULT) {
            this.audioContainer.updateVolumeMusicSource(1, 3);
        }
    }
}
