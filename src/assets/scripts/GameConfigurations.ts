import gc from "@sg/game-client-base";
import { siteConfigs } from "./site-configs";

const { UrlUtils } = gc;
export interface GameConfiguration {
    id: number;
    name: string;
    key: string;
    route?: string;
    mini?: {
        miniPanel: boolean;
        multi?: string;
    };
    remoteBundle?: {
        dependsOn: string[];
    };
    isMicrosite?: boolean;
    bannerType?: string;
}

declare global {
    interface Window {
        gameConfigurations: GameConfiguration[];
    }
}

export async function initGameConfiguration() {
    console.log("initGameConfiguration----");
    window.gameConfigurations = [
        {
            id: 2,
            name: "sedie",
            key: "sedie",
            remoteBundle: {
                dependsOn: [],
            },
        },
    ];

    initializeBundleInfos();
}

function initializeBundleInfos() {
    const isDevelopmentMode = window.location.hostname === "localhost";
    console.log("isDevelopmentMode:", isDevelopmentMode);
    const games = getAllGameConfigurations()
        .filter((configuration) => !!configuration.remoteBundle)
        .map((configuration) => ({ gameId: configuration.id, ...configuration.remoteBundle }));

    const developmentMode = games.reduce((result, configs) => {
        result[configs.gameId] = {
            url: "assets",
            name: configs.gameId,
            useMd5Cache: location.href.includes("/build/"),
            dependencies: configs.dependsOn,
        };

        return result;
    }, {});
    console.log("bundle info - develop: ", developmentMode);

    const productionMode = games.reduce((result, configs) => {
        result[configs.gameId] = {
            url: UrlUtils.buildProxyUrl(siteConfigs, `/direct-client-${configs.gameId}`),
            name: configs.gameId,
            useMd5Cache: true,
            dependencies: configs.dependsOn,
        };

        return result;
    }, {});

    console.log("bundle info - production: ", productionMode);

    if (!window.bundleManagement) {
        window.bundleManagement = {};
    }

    window.bundleManagement.bundles = isDevelopmentMode ? developmentMode : productionMode;
}

export function getGameName(gameId: number) {
    const gameConfiguration = getGameConfiguration(gameId);

    return gameConfiguration?.key;
}

export function getGameId(key: string) {
    const gameConfiguration = getAllGameConfigurations().find((configuration) => configuration.key === key);

    return gameConfiguration?.id;
}

export function isMiniGame(key: string) {
    const gameConfiguration = getAllGameConfigurations().find((configuration) => configuration.key === key);

    return gameConfiguration?.mini != null;
}

export function getGameConfiguration(gameId: number | string) {
    return getAllGameConfigurations().find((configuration) => configuration.id === Number(gameId));
}

export function getAllGameConfigurations() {
    if (CC_EDITOR) {
        return [];
    }

    return window.gameConfigurations;
}

export function isUsingRemoteBundle(gameId: number) {
    const configuration = getGameConfiguration(gameId);

    return configuration && !!configuration.remoteBundle;
}
