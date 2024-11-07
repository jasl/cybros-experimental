import { parseArgs } from "jsr:@std/cli/parse-args";

const parsedArgs = parseArgs(Deno.args, {
    alias: {
        "configPath": "c",
        "dryRun": "dry-run",
    },
    boolean: [
        "dryRun",
    ],
    string: [
        "configPath",
    ],
    default: {
        dryRun: false,
    },
});

const dryRun = parsedArgs.dryRun;
const config = (() => {
    const configPath = parsedArgs.configPath;
    if (configPath === undefined) {
        console.error("`-c CONFIG_FILE_PATH` is required");
        Deno.exit(1)
    }

    try {
        const config = Deno.readTextFileSync(configPath);
        return JSON.parse(config);
    } catch (e) {
        console.error("Load config error");
        console.error(e.message);
        Deno.exit(1)
    }
})();

import { createClient, type HexString, PolkadotClient } from "npm:polkadot-api"
import { getWsProvider } from "npm:polkadot-api/ws-provider/node";
import { withPolkadotSdkCompat } from "npm:polkadot-api/polkadot-sdk-compat";

async function insertKey(
    client: PolkadotClient,
    keyType: string,
    publicKey: HexString,
    sUri: string,
    dryRun: boolean
) {
    const hasKey = (publicKey: HexString, keyType: string): Promise<boolean> =>
        client._request<boolean>("author_hasKey", [publicKey, keyType])
    const insertKey = (keyType: string, sUri: string, publicKey: HexString): Promise<Uint8Array> =>
        client._request<boolean>("author_insertKey", [keyType, sUri, publicKey])

    let inserted = await hasKey(publicKey, keyType);
    if (inserted) {
        console.log(`"${keyType}" has already been inserted, public key "${publicKey}"`);
        return;
    }

    if (dryRun) {
        return;
    }

    await insertKey(keyType, sUri, publicKey);
    inserted = await hasKey(publicKey, keyType);

    if (inserted) {
        console.log(`Set "${keyType}" successful, public key "${publicKey}"`)
    } else {
        console.log(`Set "${keyType}" failed, public key "${publicKey}"`)
    }

    return inserted;
}

if (dryRun) {
    console.log("Dry run mode enabled, will not actually insert keys.");
}

for (const {rpcUrl, keys} of config) {
    const client = createClient(
        withPolkadotSdkCompat(
            getWsProvider(rpcUrl)
        )
    );

    for (const {keyType, publicKey, sUri} of keys) {
        await insertKey(client, keyType, publicKey, sUri, dryRun);
    }

    client.destroy();
}

Deno.exit(0)
