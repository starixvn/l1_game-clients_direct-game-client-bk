const path = require("path");
const fs = require("fs");
import { BuildHook, IBuildResult, IBuildTaskOption } from "../@types";
const packageUtils = require("./utils/package");

interface IOptions {
    remoteAddress: string;
    enterCocos: string;
    selectTest: string;
    objectTest: {
        number: number;
        string: string;
        boolean: boolean;
    };
    arrayTest: [number, string, boolean];
}

const PACKAGE_NAME = "bundle-plugin-template";

interface ITaskOptions extends IBuildTaskOption {
    packages: {
        "cocos-plugin-template": IOptions;
    };
}

function log(...arg: any[]) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}

let allAssets = [];

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function () {
    console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);
    allAssets = await Editor.Message.request("asset-db", "query-assets");
};

export const onBeforeBuild: BuildHook.onBeforeBuild = async function (options: ITaskOptions, result: IBuildResult) {
    // Todo some thing
    // log(`${PACKAGE_NAME}.webTestOption`, "onBeforeBuild");
};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function (options: ITaskOptions, result: IBuildResult) {
    // const pkgOptions = options?.packages[PACKAGE_NAME];
    // if (pkgOptions?.webTestOption) {
    //     console.debug("webTestOption", true);
    // }
    // Todo some thing
    console.debug("get settings test", result.settings);
};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function (options: ITaskOptions, result: IBuildResult) {
    // Todo some thing
    // console.log("webTestOption", "onAfterCompressSettings");
};

export const onAfterBuild: BuildHook.onAfterBuild = async function (options: ITaskOptions, result: IBuildResult) {
    // customize create file version.json
    customizeAfterBuild(result);
    packageUtils.mount();
    // change the uuid to test
    const uuidTestMap = {
        image: "57520716-48c8-4a19-8acf-41c9f8777fb0",
    };
    for (const name of Object.keys(uuidTestMap)) {
        const uuid = uuidTestMap[name];
        console.debug(`containsAsset of ${name}`, result.containsAsset(uuid));
        console.debug(`getAssetPathInfo of ${name}`, result.getAssetPathInfo(uuid));
        console.debug(`getRawAssetPaths of ${name}`, result.getRawAssetPaths(uuid));
        console.debug(`getJsonPathInfo of ${name}`, result.getJsonPathInfo(uuid));
    }
    // test onError hook
    // throw new Error('Test onError');
};

const customizeAfterBuild = (result: IBuildResult) => {
    const destination = path.join(result.dest, "assets/versions.json");
    console.log("bundle version path", destination);
    const versions = result.settings.assets.bundleVers;

    console.log("bundle version", versions);

    fs.writeFileSync(destination, JSON.stringify(versions || {}));
};

export const unload: BuildHook.unload = async function () {
    console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
};

export const onError: BuildHook.onError = async function (options, result) {
    // Todo some thing
    console.warn(`${PACKAGE_NAME} run onError`);
};

export const onBeforeMake: BuildHook.onBeforeMake = async function (root, options) {
    console.log(`onBeforeMake: root: ${root}, options: ${options}`);
};

export const onAfterMake: BuildHook.onAfterMake = async function (root, options) {
    console.log(`onAfterMake: root: ${root}, options: ${options}`);
};
