import { parseArgs } from "jsr:@std/cli/parse-args";
import { entropyToMiniSecret, generateMnemonic, mnemonicToEntropy, ss58Address } from "npm:@polkadot-labs/hdkd-helpers";
import { sr25519CreateDerive, ed25519CreateDerive } from "npm:@polkadot-labs/hdkd";
import { bytesToHex } from "npm:@noble/hashes/utils"

const ss58Prefix = 42;
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

const validatorsCount = parseInt(parsedArgs.validatorsCount);
const endowment = parseInt(parsedArgs.endowment);
const mnemonic = parsedArgs.mnemonic ?? generateMnemonic();

const sr25519derive = sr25519CreateDerive(entropyToMiniSecret(mnemonicToEntropy(mnemonic)));
const ed25519derive = ed25519CreateDerive(entropyToMiniSecret(mnemonicToEntropy(mnemonic)));

const rootMnemonic = `//root`;
const rootKeyPair = sr25519derive(rootMnemonic);
const rootAddress = ss58Address(rootKeyPair.publicKey, ss58Prefix);

const initialAuthorities = [];
const nodesKeys = [];
for (let i = 1; i <= validatorsCount; i++) {
    const accountMnemonic = `//validator//${i}`;
    const auraKeyMnemonic = `//validator//${i}//aura`;
    const grandpaKeyMnemonic = `//validator//${i}//grandpa`;

    const accountKeyPair = sr25519derive(accountMnemonic);
    const auraKeyPair = sr25519derive(auraKeyMnemonic);
    const grandpaKeyPair = ed25519derive(grandpaKeyMnemonic);

    const accountAddress = ss58Address(accountKeyPair.publicKey, ss58Prefix);
    const auraKeyAddress = ss58Address(auraKeyPair.publicKey, ss58Prefix);
    const grandpaKeyAddress = ss58Address(grandpaKeyPair.publicKey, ss58Prefix);

    initialAuthorities.push([accountAddress, auraKeyAddress, grandpaKeyAddress]);
    nodesKeys.push({
        "rpcUrl": `ws://127.0.0.1:9${i}44`,
        "keys": [
            {
                "keyType": "aura",
                "keyringType": "sr25519",
                "publicKey": `0x${bytesToHex(auraKeyPair.publicKey)}`,
                "sUri": `${mnemonic}${auraKeyMnemonic}`
            },
            {
                "keyType": "gran",
                "keyringType": "ed25519",
                "publicKey": `0x${bytesToHex(grandpaKeyPair.publicKey)}`,
                "sUri": `${mnemonic}${grandpaKeyMnemonic}`
            }
        ]
    })
}

const endowedAccounts = initialAuthorities
    .map(v => v[0])
    .concat([rootAddress])
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
        authorities: initialAuthorities.map(v => v[1]),
    },
    balances: {
        balances: endowedAccounts
    },
    grandpa: {
        authorities: initialAuthorities.map(v => [v[2], 1]),
    },
    sudo: {
        key: rootAddress,
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
