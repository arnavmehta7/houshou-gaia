/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import axios from "axios";
import { addressFactory, abiFactory } from "./constants";

declare global {
    interface Window {
        ethereum: any;
    }
}

let allPools = [];
let createdPools = [];

async function getUserAddress() {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    return accounts[0];
}

async function getFactoryContract(providerOrSigner: any) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(addressFactory, abiFactory, provider);
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            addressFactory,
            abiFactory,
            signer
        );
        return contract;
    }
    return contract;
}

export async function createPool(_amount: any, _duration: any, _uuid: any, formMetadata: any) {
    console.log("Calling contract...");
    const contract = await getFactoryContract(true);
    const amount = ethers.utils.parseEther(_amount);
    const currentTimestamp = new Date().getTime(); 
    const endTimestamp = currentTimestamp + (_duration * 24 * 60 * 60 * 1000);
    const uuidHex = _uuid.replace(/-/g, '');
    const uuidAsUint256 = ethers.BigNumber.from('0x' + uuidHex);
    const tx = await contract.createPool(amount, endTimestamp, uuidAsUint256, formMetadata);
    await tx.wait();
    console.log("Transaction mined");
}

export async function strikeAttestator(_user: any) {
    const contract = await getFactoryContract(true);
    const tx = await contract.strikeAttestator(_user);
    await tx.wait();
}

export async function fetchStrikes() {
    const contract = await getFactoryContract(false);
    const user = await getUserAddress();
    const data = await contract.strikes(user);
    return data.toString();
}

export async function fetchAllPools() {
    const contract = await getFactoryContract(false);
    const data = await contract.fetchAllPools();

    const items = await Promise.all(
        data.map(async (i: any) => {
            const allForms = await axios.get(i.metadata.toString());
            console.log(allForms.data);
            
            // form rotator logic
            const numberOfKeys = Object.keys(allForms.data).length;
            const randomNumber = Math.floor(Math.random() * numberOfKeys) + 1;
            console.log("Form Number: ", randomNumber)
            const meta = await axios.get(allForms.data[`formUri${randomNumber}`]);
            console.log(meta.data);

            const item = {
                name: meta.data.name,
                pool: meta.data.pool,
                duration: meta.data.duration,
                description: meta.data[`description${randomNumber}`],
                image: meta.data.image,
                uuid: i._uuid.toString(),
                metadataUri: i.metadata.toString(),
                poolContract: i._contractAddress,
            };
            return item;
        })
    );

    allPools = items;
    console.log(items);
    return items;
}

export async function fetchCreatedPools() {
    const contract = await getFactoryContract(false);
    const user = await getUserAddress();
    const data = await contract.fetchCreatedPools(user);

    const items = await Promise.all(
        data.map(async (i: any) => {
            const meta = await axios.get(i.metadata.toString());
            const item = {
                name: meta.data._name,
                pool: meta.data._pool,
                duration: meta.data._duration,
                description: meta.data._description,
                image: meta.data._image,
                uuid: i._uuid.toString(),
                metadataUri: i.metadata.toString(),
                poolContract: i._contractAddress,
            };
            return item;
        })
    );

    createdPools = items;
    console.log(items);
    return items;
}