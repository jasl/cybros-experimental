import { parseArgs } from "jsr:@std/cli/parse-args";
import { Keyring } from "npm:@polkadot/keyring";
import { cryptoWaitReady, mnemonicGenerate } from "npm:@polkadot/util-crypto";
import { stringToInteger } from "./deno_lib/utils.ts"

const parsedArgs = parseArgs(Deno.args, {
    alias: {
        "mnemonic": "m",
        "validatorsCount": "n",
        "endowment": "e",
    },
    string: [
        "mnemonic",
        "validatorsCount",
        "endowment",
    ],
    default: {
        validatorsCount: '3',
        endowment: '1000' + '000000000000', // 1000 token
    },
});

await cryptoWaitReady().catch((e) => {
    console.error("Crypto module initialize failed.");
    console.error(e.message);
    Deno.exit(1);
});

const validatorsCount = stringToInteger(parsedArgs.validatorsCount) ?? 3;
const endowment = parseInt(parsedArgs.endowment);
const mnemonic = parsedArgs.mnemonic ?? mnemonicGenerate();

const sr25519keyring = new Keyring({ type: 'sr25519' });
const ed25519keyring = new Keyring({ type: 'ed25519' });

const rootKey = sr25519keyring.addFromUri(`${mnemonic}//root`).address;

const initialAuthorities = [];
const nodesKeys = [];
for (let i = 1; i <= validatorsCount; i++) {
    const accountMnemonic = `${mnemonic}//validator//${i}`;
    const auraKeyMnemonic = `${mnemonic}//validator//${i}//aura`;
    const grandpaKeyMnemonic = `${mnemonic}//validator//${i}//grandpa`;

    const account = sr25519keyring.addFromUri(accountMnemonic).address;
    const auraKey = sr25519keyring.addFromUri(auraKeyMnemonic).address;
    const grandpaKey = ed25519keyring.addFromUri(grandpaKeyMnemonic).address;

    initialAuthorities.push([account, auraKey, grandpaKey]);
    nodesKeys.push({
        "rpcUrl": `ws://127.0.0.1:9${i}44`,
        "keys": [
            {
                "sUri": auraKeyMnemonic,
                "keyType": "aura",
                "keyringType": "sr25519"
            },
            {
                "sUri": grandpaKeyMnemonic,
                "keyType": "gran",
                "keyringType": "ed25519"
            }
        ]
    })
}

const endowedAccounts = initialAuthorities
    .map(v => v[0])
    .concat([rootKey])
    .map(v => [v, endowment]);

console.log(`Mnemonic: ${mnemonic}`);
console.log(`Validators count: ${validatorsCount}`);
console.log(`Endowment: ${endowment}`);
console.log("");

// const genesisConfig = {
//     rootKey,
//     initialAuthorities,
//     endowedAccounts,
// };

// console.log("Genesis config profile JSON:");
// console.log(JSON.stringify(genesisConfig, null, 2));

const chainSpecPatch = {
    aura: {
        authorities: initialAuthorities.map(v => v[0]),
    },
    balances: {
        balances: endowedAccounts
    },
    grandpa: {
        authorities: initialAuthorities.map(v => [v[1], 1]),
    },
    sudo: {
        key: rootKey,
    },
    system: {},
    transactionPayment: {
        multiplier: "1000000000000000000"
    }
};

console.log("Chain spec patch:");
console.log(JSON.stringify(chainSpecPatch, null, 2));
console.log("");

console.log("Nodes' keys JSON (for insert nodes' keys tool):");
console.log(JSON.stringify(nodesKeys, null, 2));
console.log("");

Deno.exit(0)
