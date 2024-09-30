"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listModels, ModelInfo, predict, PredictPayload, PredictResponse } from "@/utils/api";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight"; // Import rehype-highlight for code block styling
import "highlight.js/styles/github-dark.css"; // Import a highlight.js theme for code block styling

const Models = () => {
    const [models, setModels] = useState<ModelInfo[]>([]);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [query, setQuery] = useState<string>(""); // New state for query input
    const [prediction, setPrediction] = useState<string | null>(null);

    useEffect(() => {
        async function fetchModels() {
            const userAddress = "papi"; // TODO: Get the user's address
            const fetchedModels = await listModels(userAddress);
            setModels(fetchedModels);
        }
        fetchModels();
    }, []);

    async function handlePredict() {
        if (selectedModel) {
            console.log(`Selected Model: ${selectedModel}`);
            let selected_api_key = models.find((model) => model.model_id === selectedModel)?.api_key;
            console.log(`Selected API Key: ${selected_api_key}`);
            const payload: PredictPayload = {
                api_key: selected_api_key, // TODO: Replace with dynamic API key if needed
                query: query, // Use the user's input as the query
            };
            try {
                const predictResponse = await predict(selectedModel, payload);
                setPrediction(predictResponse);
            } catch (error) {
                toast.error("Prediction failed. Please try again.");
            }
        } else {
            toast.error("Please select a model.");
        }
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%] h-[100vh]">
                    <div className="text-white">
                        <h1 className="font-bold text-3xl text-center mb-8">Models</h1>
                        <div className="mt-8 w-3/4 mx-auto">
                            <div className="flex flex-col gap-4">
                                {/* Model Selection */}
                                <div>
                                    <label htmlFor="model" className="block mb-2">Select Model:</label>
                                    <select
                                        id="model"
                                        value={selectedModel || ""}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                                    >
                                        <option value="">Choose a model</option>
                                        {models.map((model) => (
                                            <option key={model.model_id} value={model.model_id}>
                                                {model.model_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Textbox for user input */}
                                <div>
                                    <label htmlFor="query" className="block mb-2">Enter Query:</label>
                                    <textarea
                                        id="query"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                                        rows={4}
                                        placeholder="Enter your input for prediction"
                                    />
                                </div>

                                {/* Predict button */}
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={handlePredict}
                                    >
                                        Predict
                                    </button>
                                </div>

                                {/* Display prediction result */}
                                {prediction && (
                                    <div className="mt-4">
                                        <h2 className="text-xl font-bold mb-2">Prediction Result:</h2>
                                        <div className="p-4 bg-gray-800 rounded-md">
                                            {/* Use react-markdown with rehype-highlight for better markdown parsing */}
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                                {prediction}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Models;
