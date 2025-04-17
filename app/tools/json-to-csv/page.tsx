"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Copy, CopyCheck, Home } from "lucide-react";

export default function JsonToCsv() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [json, setJson] = useState("");
  const [csv, setCsv] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const router = useRouter();

  const copyTable = async () => {
    if (json.length == 0) {
      return;
    }

    const table = tableRef.current;
    if (!table) return;
    const text = table.innerText;

    console.log(text);
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 700);
    } catch (err) {
      setIsCopied(false);
      console.log(err);
    }
  };

  const convertJsonToCsv = () => {
    try {
      const jsonDataParsed = JSON.parse(json);
      if (!Array.isArray(jsonDataParsed)) {
        throw new Error("Input must be an array of objects");
      }
      const headersKey = Object.keys(jsonDataParsed[0]);
      setHeaders(headersKey);
      setCsv(jsonDataParsed);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold mb-4">JSON to CSV Converter</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-gray-100 transition"
          onClick={() => router.push("/")}
        >
          <Home className="h-5 w-5" />
          <span className="text-sm font-medium">Home</span>
        </Button>
      </div>

      {/* JSON Input & CSV Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JSON Input Area */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
          <Textarea
            placeholder="Paste your JSON here..."
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="h-64 w-full resize-none p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* CSV Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-2">
          <table
            className="min-w-full text-sm text-left text-gray-800"
            ref={tableRef}
          >
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 font-semibold text-gray-700 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csv.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-4 py-2 border-t border-gray-200"
                    >
                      {typeof row[header] === "object"
                        ? JSON.stringify(row[header])
                        : row[header] !== undefined && row[header] !== null
                        ? String(row[header])
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
        <Button
          onClick={convertJsonToCsv}
          className="bg-black text-white px-6 py-2 rounded-lg transition w-full sm:w-auto"
        >
          Convert to CSV
        </Button>

        <div className="flex items-center space-x-2 text-gray-700">
          {!isCopied ? (
            <Copy onClick={copyTable} className="cursor-pointer transition" />
          ) : (
            <CopyCheck />
          )}
        </div>
      </div>
    </div>
  );
}
