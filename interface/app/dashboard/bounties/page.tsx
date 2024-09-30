/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchAllPools } from "@/utils/contracts";
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";

const FetchBountiesPage = () => {
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        fetchAllBountiesData();
    }, []);

    async function fetchAllBountiesData() {
        const results = await fetchAllPools();
        setData(results);
    }

    async function handleFormInput() {}

    function Card({
        name,
        poolAmount,
        duration,
        description,
        image,
        uuid,
        metadataUri,
        poolContract,
    }: {
        name: any;
        poolAmount: any;
        duration: any;
        description: any;
        image: any;
        uuid: any;
        metadataUri: any;
        poolContract: any;
    }) {
        return (
            <div className="mt-10">
                <div className="flex flex-col w-3/4 p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-start gap-6">
                        <img
                            src={image}
                            alt="Bounty Image"
                            className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Bounty: {name}
                            </h2>
                            <div className="flex justify-between mb-2">
                                <p className="text-sm text-gray-700 dark:text-gray-400">
                                    Pool Amount: {poolAmount} XDAI
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-400">
                                    Duration: {duration} days
                                </p>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                                Description: {description}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-[-1em]">
                        <button
                            onClick={handleFormInput}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    <div className="mt-10">
                        <h1 className="font-bold text-3xl text-center">
                            Bounties
                        </h1>
                    </div>
                    {data.map((item: any, i: any) => (
                        <Card
                            key={i}
                            name={item.name}
                            poolAmount={item.pool}
                            duration={item.duration}
                            description={item.description}
                            image={item.image}
                            uuid={item.uuid}
                            metadataUri={item.metadataUri}
                            poolContract={item.poolContract}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FetchBountiesPage;
