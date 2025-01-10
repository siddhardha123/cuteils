"use client";

import React, { useState } from "react";

export default function JsonDiff () {
  const [json1, setJson1] = useState<string>("");
  const [json2, setJson2] = useState<string>("");
  const [isValidJson1, setIsValidJson1] = useState<boolean>(true);
  const [isValidJson2, setIsValidJson2] = useState<boolean>(true);

  const validateJson = (json: string): boolean => {
    try {
      if (json.length === 0) return true;
      JSON.parse(json);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleJson1Change = (value: string) => {
    setJson1(value);
    setIsValidJson1(validateJson(value));
  };

  const handleJson2Change = (value: string) => {
    setJson2(value);
    setIsValidJson2(validateJson(value));
  };

  const generateDiff = () => {
    if (isValidJson1 && isValidJson2) {
      const jsonStr1 = JSON.stringify(JSON.parse(json1), null, 2);
      const jsonStr2 = JSON.stringify(JSON.parse(json2), null, 2);

      const diff = [];
      for (let i = 0; i < Math.max(jsonStr1.length, jsonStr2.length); i++) {
        if (jsonStr1[i] === jsonStr2[i]) {
          diff.push(
            <span key={i} className="text-green-600">
              {jsonStr1[i] || ""}
            </span>
          );
        } else {
          diff.push(
            <span key={i} className="text-red-600">
              {jsonStr1[i] || ""}
            </span>
          );
        }
      }
      return diff;
    }
    return null;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">JSON Diff Checker</h2>
      <p className="text-gray-600">Compare two JSON inputs and see the differences highlighted below.</p>
      <div className="flex gap-4">
        <textarea
          className={`w-full p-2 border-2 h-[300px] resize-none ${
            isValidJson1 ? "border-gray-300 bg-white" : "border-red-500 bg-red-100"
          }`}
          placeholder="Enter JSON 1"
          value={json1}
          onChange={(e) => handleJson1Change(e.target.value)}
        />
        <textarea
          className={`w-full p-2 border-2 h-[300px] resize-none ${
            isValidJson2 ? "border-gray-300 bg-white" : "border-red-500 bg-red-100"
          }`}
          placeholder="Enter JSON 2"
          value={json2}
          onChange={(e) => handleJson2Change(e.target.value)}
        />
      </div>

      {isValidJson1 && isValidJson2 && json1 && json2 && (
        <div className="p-4 border-2 border-gray-300 bg-gray-50 rounded-md">
          <pre className="whitespace-pre-wrap break-words">
            {generateDiff()}
          </pre>
        </div>
      )}
    </div>
  );
};
