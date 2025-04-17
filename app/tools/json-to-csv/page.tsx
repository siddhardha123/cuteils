'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

export default function JsonToCsv() {
  const [json, setJson] = useState('');
  const [csv, setCsv] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const router = useRouter();

  const convertJsonToCsv = () => {
    try {
      const jsonDataParsed = JSON.parse(json);
      if (!Array.isArray(jsonDataParsed)) {
        throw new Error('Input must be an array of objects');
      }
      const headersKey = Object.keys(jsonDataParsed[0]);
      setHeaders(headersKey);
      setCsv(jsonDataParsed);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">JSON to CSV Converter</h1>
        <Button variant="outline" onClick={() => router.push('/')}>
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Textarea
            placeholder="Paste your JSON here..."
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="h-64"
          />
        </div>
        <div>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csv.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200"
                      >
                        {typeof row[header] === 'object'
                          ? JSON.stringify(row[header])
                          : row[header] !== undefined && row[header] !== null
                          ? String(row[header])
                          : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Button onClick={convertJsonToCsv} className="mt-4">
        Convert to CSV
      </Button>
    </div>
  );
}
