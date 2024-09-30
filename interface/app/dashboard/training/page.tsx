/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchCreatedPools, getAddress } from "@/utils/contracts";
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";
import {
  Answer,
  createModel,
  getPoolsAnswers,
} from "@/utils/api";

const FetchTrainingPage = () => {
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [modelName, setModelName] = useState("model-name");
    const [uuid, setUuid] = useState(""); // Store the model UUID
    const [approvedAnswers, setApprovedAnswers] = useState<Answer[]>([]); // To track approved answers
  
    const CallModelCreationAPI = async () => {
      const address = await getAddress();
      const messages = [];
  
      approvedAnswers.forEach((answer) => {
        messages.push(answer.question);
        messages.push(answer.solution);
      });
  
      createModel({ address, model_name: modelName, messages });
    };
  
    async function handleResultsClick(uuid: string) {
      console.log("Fetching answers for pool", uuid);
      const results = await getPoolsAnswers({ pool_id: uuid });
      setAnswers(results.answers);
      setUuid(uuid); // Store UUID for popup
      setShowPopup(true);
    }
  
    const handleApprove = (index: number) => {
      const newApprovedAnswers = [...approvedAnswers, answers[index]];
      setApprovedAnswers(newApprovedAnswers);
    };
  
    const handleReject = (index: number) => {
      const updatedAnswers = answers.filter((_, i) => i !== index);
      setAnswers(updatedAnswers);
    };
  
    const [data, setData] = useState<any>([]);
    useEffect(() => {
      fetchCreatedPoolsData();
    }, []);
  
    async function fetchCreatedPoolsData() {
      const results = await fetchCreatedPools();
      setData(results);
    }
  
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
                  Contract: {poolContract}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-[-1em]">
              <button
                onClick={() => handleResultsClick(uuid)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                See Results
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    function Popup({
      answers,
      onClose,
    }: {
      answers: Answer[];
      onClose: () => void;
    }) {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
          ></div>
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg z-50 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">User Answers</h2>
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <div key={index} className="mb-4 border-b border-gray-600 pb-2">
                  <p>
                    <strong>Question:</strong> {answer.question}
                  </p>
                  <p>
                    <strong>Solution:</strong> {answer.solution}
                  </p>
                  <p>
                    <strong>Address:</strong> {answer.address}
                  </p>
                  <div className="flex justify-end gap-4 mt-2">
                    <button
                      onClick={() => handleApprove(index)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No answers available.</p>
            )}
            <div className="mt-4">
              <label htmlFor="modelName" className="block mb-2">
                Model Name:
              </label>
              <input
                type="text"
                id="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white"
              />
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={CallModelCreationAPI}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Create Model
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
              >
                Close
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
                Forms Created By Contractor (You)
              </h1>
            </div>
            {data.map((item: any, i: any) => {
              return (
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
              );
            })}
          </div>
        </div>
        {showPopup && (
          <Popup answers={answers} onClose={() => setShowPopup(false)} />
        )}
      </div>
    );
  };
  
  export default FetchTrainingPage;
  
