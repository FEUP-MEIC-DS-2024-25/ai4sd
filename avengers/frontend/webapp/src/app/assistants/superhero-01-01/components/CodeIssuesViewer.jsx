import React, { useRef } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHeader, 
  TableHead, 
  TableRow 
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import {jsPDF} from 'jspdf';
import html2canvas from "html2canvas";

import { usePDF } from 'react-to-pdf';
import { Download } from 'lucide-react';


const CodeIssuesViewer = ({ data }) => {
  const title = ("Code Analysis for "+ data.programmingLanguage) || 'Unknown Language'
  const { toPDF, targetRef } = usePDF({filename: title+'.pdf'});

    try {

        // Validate the expected structure
        if (!data || !data.issues || !Array.isArray(data.issues)) {
          throw new Error("Invalid JSON structure");
        }
    
        // Determine badge color based on risk level
        const getRiskBadgeColor = (riskLevel) => {
          switch (riskLevel.toLowerCase()) {
            case 'minor':
              return 'bg-yellow-100 text-yellow-800';
            case 'moderate':
              return 'bg-orange-100 text-orange-800';
            case 'high':
              return 'bg-red-100 text-red-800';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };
    
        return (
          <div>
          <div className="p-4 bg-white rounded-lg shadow-md w-full" ref ={targetRef}>
            <div className="mb-4">
              <div className='flex justify-between flex-row'>
                <h2 className="text-xl font-bold mb-2">
                  Code Analysis for {data.programmingLanguage || 'Unknown Language'}
                </h2>
              </div>
              <p className="text-gray-600 mb-2">
                <strong>Overall Evaluation:</strong> {data.evaluation || 'Not Available'}
              </p>
              <p className="text-sm text-gray-700">{data.feedback || 'No additional feedback'}</p>
            </div>
    
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.issues.map((issue, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{issue.title}</TableCell>
                    <TableCell>{issue.description}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getRiskBadgeColor(issue['risk level'] || 'unknown')} rounded-full`}
                      >
                        {issue['risk level'] || 'Unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Download onClick={() => toPDF()} className="cursor-pointer ml-auto mt-2 mr-2 w-5 h-5"/>
          </div>
        );
      } catch (error) {
        // Fallback rendering if JSON is malformed
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              Unable to render JSON: {error.message}
            </p>
            <pre className="mt-2 text-sm text-gray-600 overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
      }
};

export { CodeIssuesViewer };