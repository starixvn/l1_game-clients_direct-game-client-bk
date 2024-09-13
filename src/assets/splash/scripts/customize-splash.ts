import { _decorator, Component } from "cc";
import Observer from "observer";
const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

@ccclass
@observer
export class CustomizeSplash extends Component {
    onLoad() {
        //this.initializeBundleManager();
    }

    initializeBundleManager() {
        // NewBundleManager.initialize({
        //     adapters: {
        //         assetManager: () => assetManager,
        //         http: () => ({
        //             get: (url: string) =>
        //                 axios
        //                     .get(url)
        //                     .then((res) => res?.data)
        //                     .catch((error) => {
        //                         throw new Error(`AXIOS_FAILED BundleManager get ${url}: ${error.message}`);
        //                     }),
        //         }),
        //     },
        //     listeners: [],
        // });
    }
}
