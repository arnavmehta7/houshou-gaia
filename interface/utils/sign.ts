/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    IndexService,
    OffChainSignType,
    SignProtocolClient,
    SpMode,
    EvmChains,
} from "@ethsign/sp-sdk";
import { error } from "console";
import { privateKeyToAccount } from "viem/accounts";

async function createSchema() {
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY_1;
    if (privateKey == undefined) {
        throw error("No private key found");
    }
    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.gnosisChiado,
        account: privateKeyToAccount(`0x${privateKey}`),
    });

    const createSchemaRes = await client.createSchema({
        name: "houshou",
        data: [
            { name: "uuid", type: "number" },
            { name: "user", type: "string" },
            { name: "attestation_timestamp", type: "number" },
        ],
    });
    console.log(createSchemaRes);
}

async function onChainAttestation() {
    const _schemaId = "0x1";

    // call wallet
    // const _wallet;
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY_1;

    if (privateKey == undefined) {
        throw error("No private key found");
    }
    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.gnosisChiado,
        account: privateKeyToAccount(`0x${privateKey}`),
    });

    const createAttestationRes = await client.createAttestation({
      schemaId: _schemaId,
      data: { name: "a" },
      indexingValue: "xxx",
    });

    console.log(createAttestationRes)
}
