import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Splash from "db://shared-components/splash/scripts/components/splash";
import Observer from "observer";
import { initGameConfiguration } from "../../scripts/GameConfigurations";
const { ccclass } = _decorator;

const { observer, render } = Observer;
const { Auth } = gc;
@ccclass
@observer
export class CustomizeSplash extends Splash {
    onLoad() {
        super.onLoad();
        initGameConfiguration();
    }

    @render(Auth.AuthStore, (store) => ({
        isAuthorized: store.isAuthorized,
        system: store.system,
    }))
    openGame({ isAuthorized, system }) {
        if (isAuthorized) {
            this.system = system;
            this.loadChipSetting();
            this.triggerRecheckIn();
            this.loadSceneGame();
        }
    }
}
