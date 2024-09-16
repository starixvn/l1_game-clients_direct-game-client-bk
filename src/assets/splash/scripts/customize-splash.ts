import { _decorator, Component } from "cc";
import Observer from "observer";
import { initGameConfiguration } from "../../scripts/GameConfigurations";
const { ccclass } = _decorator;

const { observer, render, handle } = Observer;

@ccclass
@observer
export class CustomizeSplash extends Component {
    onLoad() {
        initGameConfiguration();
    }
}
