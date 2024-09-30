/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
    IDKitWidget,
    VerificationLevel,
    ISuccessResult,
} from "@worldcoin/idkit";
// import Link from "next/link";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { loginDataverse } from "@/utils";

export default function NavBar() {
    async function onSuccess() {}
    async function handleVerify() {}

    return (
        <nav className="fixed h-[75px] top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start pl-5 pt-2">
                        {" "}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {" "}
                            Houshou
                        </h2>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ml-3">
                            {/* <ConnectButton chainStatus="icon" accountStatus="avatar"/> */}
                            <IDKitWidget
                                app_id="app_staging_73e19a4b2add2e4b9eacf548b54776c0"
                                action="attest"
                                onSuccess={onSuccess}
                                handleVerify={handleVerify}
                                verification_level={VerificationLevel.Orb}
                            >
                                {({ open }) => (
                                    <button onClick={open} className="text-xl font-bold text-gray-900 dark:text-white">
                                        World ID
                                    </button>
                                )}
                            </IDKitWidget>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
