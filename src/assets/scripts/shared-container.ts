import gc from "@sg/game-client-base";
import axios from "axios/dist/axios.min.js";
import { getSharedContainer } from "db://shared-components/shared/scripts/startup";
import mobx from "mobx";
import Observer from "observer";

import { assetManager } from "cc";
import { RemoteBundleManager } from "db://shared-components/shared/common-components/remote-bundle-manager/remote-bundle-management";
import { siteConfigs } from "./site-configs";

export const sharedContainer = getSharedContainer(siteConfigs);

Observer.configure({ default: { mobx, container: gc.buildObserverContainer(sharedContainer) } });

RemoteBundleManager.initialize({
    adapters: {
        assetManager: () => assetManager,
        http: () => ({
            get: (url: string) =>
                axios
                    .get(url)
                    .then((res) => res?.data)
                    .catch((error) => {
                        throw new Error(`AXIOS_FAILED BundleManager get ${url}: ${error?.message}`);
                    }),
        }),
    },
    listeners: [],
});
