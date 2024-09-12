import { _decorator, tween, UIOpacity } from "cc";

import MD5Component, { MD5Type } from "../../../../extensions/shared-components/assets/game/md5/scripts/md5-component";

const { ccclass, property } = _decorator;

export type ExtraInfos = {
    red1: boolean;
    red2: boolean;
    red3: boolean;
    red4: boolean;
};

@ccclass()
export class SeDieThreeMD5 extends MD5Component {
    readonly CHIP_RED = `<img src="chip_do" />`;
    readonly CHIP_WHITE = `<img src="chip_trang" />`;

    private tipForHash = false;

    generateMD5Result(data: MD5Type) {
        let result = "";
        if (!!data.extraInfos) {
            const totalRed = Object.values(data.extraInfos).filter((value) => value === true).length;
            const chipResult = this.generateChips(totalRed);
            const suffix = data.rawValue.split("_");
            const suffixFormatLength = suffix[1].length > this.lengthOfMd5 ? suffix[1].slice(0, this.lengthOfMd5) + "..." : suffix[1];
            result = `{${chipResult}}_${suffixFormatLength}`;
        }
        if (!!data.hashValue) {
            result = data.hashValue;
        }
        this.lblMd5Value && (this.lblMd5Value.string = `${result}`);
    }

    generateChips(totalRed: number) {
        const chips = {
            0: `${this.CHIP_WHITE} ${this.CHIP_WHITE} ${this.CHIP_WHITE}`,
            1: `${this.CHIP_RED} ${this.CHIP_WHITE} ${this.CHIP_WHITE}`,
            2: `${this.CHIP_RED} ${this.CHIP_RED} ${this.CHIP_WHITE}`,
            3: `${this.CHIP_RED} ${this.CHIP_RED} ${this.CHIP_RED}`,
        };

        return chips.hasOwnProperty(totalRed) ? chips[totalRed] : "";
    }

    protected setDataTip(data: gc.GameServiceMessage.ResultHash) {
        super.setDataTip(data);
        this.tipForHash = !!data.hashValue;
    }

    protected showTooltip() {
        if (this.tipString && this.md5Tip && !this.tipForHash) {
            this.md5Tip.setData(this.tipString);
            this.md5Tip.show(true);
            tween(this.md5Tip.node.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(2).to(0.1, { opacity: 0 }).start();
        }
    }
}
