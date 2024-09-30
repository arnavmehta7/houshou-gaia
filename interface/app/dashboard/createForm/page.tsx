/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from 'uuid';
import { uploadImgToIPFS, uploadForm } from "@/utils/ipfs";
import { createPool } from "@/utils/contracts";
import { getPool } from "@/utils/api";

const CreateModel = () => {
    const [formInput, setFormInput] = useState({
        pool: "0",
        duration: "4",
        name: "camb ai",
        description1: "Write content around sdk",
        description2: "",
        description3: "",
        description4: "",
        image: "https://imgs.search.brave.com/mblZBwWJeR_aCPa_kME_H4pbVERy3rXvvekARL6ZtAw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vbWZLeS00/QTQ3YmVEXzFOc295/enpvaXp6V2xzNkZN/bzRWOGkwR0E2UGFC/dy9yczpmaXQ6NTYw/OjMyMDoxOjAvZzpj/ZS9hSFIwY0hNNkx5/OXRaV1JwL1lURXVa/Mmx3YUhrdVkyOXQv/TDIxbFpHbGhMMjh3/ZG5kNi9kVVozUTBk/QlJrOHZaMmx3L2FI/a3VaMmxtUDJOcFpE/MDMvT1RCaU56WXhN/V2h3TW5ReS9Zemh0/Ynpkell6TnFlVzgy/L00zRTJNak0wY1dK/a2RXTm8vYVdkMFkz/QnFlR0psWm5VbS9a/WEE5ZGpGZloybG1j/MTl6L1pXRnlZMmdt/Y21sa1BXZHAvY0do/NUxtZHBaaVpqZEQx/bi5qcGVn",
    });

    const [loaders, setLoaders] = useState({
        submit: false,
        image: false,
    });

    async function handleFormInput(poolId: string) {
        const response = await getPool(poolId);
        // Handle the response and update the state or navigate to the bounty details page
      }
    async function handleImageChange() {
        const fileInput: any = document.getElementById("cover");
        const fileName: any = fileInput.files[0].name;
        const metaCID = await uploadImgToIPFS(fileInput.files[0]);
        const dedicatedGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
        console.log(`https://${dedicatedGateway}/ipfs/${metaCID}?filename=${fileName}`);
        setFormInput({ ...formInput, image: `https://ipfs.io/ipfs/${metaCID}` });
    }

    async function handleSubmit() {
        setLoaders((e) => ({ ...e, submit: true }));

        const uuid = uuidv4();

        const formMetadata = await uploadForm(formInput);
        await createPool(formInput.pool, formInput.duration, uuid, formMetadata);
        toast.success("Form Created!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setLoaders((e) => ({ ...e, submit: false }));
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%]">
                    <div className="text-white">
                        <div className="mt-10">
                            <h1 className="font-bold text-3xl text-center">
                                Create Pool/Form
                            </h1>
                        </div>

                        <div className="mt-8 w-3/4 mx-auto">
                            <div className="flex flex-col gap-4">
                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Name</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Project Name"
                                            required
                                            value={formInput.name}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    name: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Pool</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Amount in Native Token"
                                            required
                                            value={formInput.pool}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    pool: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Duration</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Duration in days"
                                            required
                                            value={formInput.duration}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    duration:
                                                        e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-start py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Description</p>
                                    </div>
                                    <div className="relative w-full">
                                        <textarea
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Describe your task"
                                            required
                                            rows={3}
                                            value={formInput.description1}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    description1: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-start py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Description (Optional)</p>
                                    </div>
                                    <div className="relative w-full">
                                        <textarea
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Describe your task"
                                            required
                                            rows={3}
                                            value={formInput.description2}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    description2: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-start py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Description (Optional)</p>
                                    </div>
                                    <div className="relative w-full">
                                        <textarea
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Describe your task"
                                            required
                                            rows={3}
                                            value={formInput.description3}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    description3: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-start py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Description (Optional)</p>
                                    </div>
                                    <div className="relative w-full">
                                        <textarea
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Describe your task"
                                            required
                                            rows={3}
                                            value={formInput.description4}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    description4: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex gap-2 justify-center py-12 mb-4 w-full mx-auto mt-4 border-2 bg-[#1E1E1E] bg-opacity-75 border-[#E0E0E0] border-opacity-40 border-dashed  rounded-md  cursor-pointer ">
                                        <span className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 text-gray"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                stroke-width="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                        </span>
                                        {loaders.image ? (
                                            <div>Uploading to IPFS..</div>
                                        ) : formInput.image == "" ? (
                                            <div>
                                                <span className="mb-2 text-lg text-center text-gray-500 dark:text-gray-400">
                                                    Product Image
                                                </span>
                                                {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p> */}
                                                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG or GIF (MAX.
                                                800x400px)
                                            </p> */}
                                            </div>
                                        ) : (
                                            <div>We got your image</div>
                                        )}
                                        <input
                                            type="file"
                                            name="file_upload"
                                            className="hidden"
                                            id="cover"
                                            onChange={handleImageChange}
                                            disabled={loaders.image}
                                        />
                                    </label>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        className="flex w-[14%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={handleSubmit}
                                    >
                                        {!loaders.submit ? (
                                            <span>Submit</span>
                                        ) : (
                                            <svg
                                                aria-hidden="true"
                                                role="status"
                                                className="inline w-4 h-4 text-white animate-spin"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="#E5E7EB"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default CreateModel;
