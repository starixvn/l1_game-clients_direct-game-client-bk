import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import Observer from "observer";
import { RemoteBundleManager } from "../../../../extensions/shared-components/assets/shared/common-components/remote-bundle-manager/remote-bundle-management";
import { getGameConfiguration } from "../../../scripts/GameConfigurations";
const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

@ccclass
@observer
export class Lobby extends Component {
    @property(Node)
    gameContainer: Node = null;

    async onLoad() {
        await this.openMiniGame(2);
    }

    public isAlive(): boolean {
        return this?.node?.isValid;
    }

    async openMiniGame(gameId: number) {
        const gameName = "SeDie";
        console.time("LoadScene " + gameName);
        const prefab = await this.loadGamePrefab(gameId, (completedCount, total, item) => {
            // handle loading
        });

        console.timeEnd("LoadScene " + gameName + prefab);

        if (!this.isAlive()) {
            return;
        }

        const node = instantiate(prefab);
        node && this.gameContainer.addChild(node);
    }

    public async loadGamePrefab(gameId: number, onProgress: (completed: number, total: number, item?: unknown) => void) {
        const gameConfiguration = getGameConfiguration(gameId);

        if (gameConfiguration?.remoteBundle) {
            const prefabPath = `prefabs/${gameConfiguration.key}`;
            const devPath = `../games/*/${gameConfiguration.key}`;
            return RemoteBundleManager.getInstance().loadAsset<Prefab>({
                bundleId: gameId.toString(),
                path: prefabPath,
                pathForDevMode: devPath,
                type: Prefab,
                onProgress,
            });
        }
    }
}
