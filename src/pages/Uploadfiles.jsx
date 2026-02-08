import { useState  } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import axios from 'axios';
import api from '../api/axiosapi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';



const mandatorySystemFields = [
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'referenceNumber', label: 'Reference Number' },
  { key: 'date', label: 'Date' },
];

export default function UploadAndMap() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [uploadjobid, setUploadjobid] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset everything when new file is selected
    setFile(selectedFile);
    setMapping({});
    setHeaders([]);
    setPreviewRows([]);
    setUploadStatus('idle');
    setUploadjobid(null);

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;

      let rawRows = [];

      if (selectedFile.name.toLowerCase().endsWith('.csv')) {
        Papa.parse(data, {
          complete: (results) => {
            rawRows = results.data.filter(row => 
              row.some(cell => cell.trim() !== '')
            );
          },
        });
      } else if (selectedFile.name.match(/\.xlsx?$/i)) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      }

      if (rawRows.length > 0) {
        const headerRow = rawRows[0] || [];
        setHeaders(headerRow);

        const preview = rawRows.slice(0, 21);
        setPreviewRows(preview);
      }
    };

    if (selectedFile.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(selectedFile);
    } else {
      reader.readAsBinaryString(selectedFile);
    }
  };

  const updateMapping = (systemKey, columnName) => {
    setMapping(prev => ({
      ...prev,
      [systemKey]: columnName || undefined,
    }));
  };

  const isMappingComplete = mandatorySystemFields.every(
    field => !!mapping[field.key]
  );

  const handleSubmit = async () => {
    if (!file || !isMappingComplete) return;

    const cleanMapping = {
      transactionId: mapping.transactionId,
      amount: mapping.amount,
      referenceNumber: mapping.referenceNumber,
      date: mapping.date,
    };

    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('columnMapping', JSON.stringify(cleanMapping));

      const res = await api.post('/api/auth/uploadfile/upload',
       formData,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
       
      //if (!res.ok) throw new Error('Upload failed');

      alert("uploaded Successfully")
      setUploadjobid(res.data.uploadJobId);
    
      setUploadStatus('success');
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
    }
  };

  const goToReconciliation = async () => {
    // Replace this with your actual navigation logic
    // Examples:
    // window.location.href = "/reconciliation";
    // navigate("/reconciliation", { state: { uploadId: backendResponse?.id } });
    try{

      const res = await api.post("/api/auth/reconciliation/start",{
          uploadJobId : uploadjobid
      });
  
      navigate("/reconciliationview",{
        state:{
          uploadJobId: uploadjobid,
        }
      }
      );
    }catch(error){
      console.log(error);
    }
  };

  const reset = () => {
    setFile(null);
    setHeaders([]);
    setPreviewRows([]);
    setMapping({});
    setUploadStatus('idle');
    setBackendResponse(null);
  };

  const showMappingSection = uploadStatus === 'idle' && file && previewRows.length > 0;
  const showResultSection  = (uploadStatus === 'success' || uploadStatus === 'error') && file && previewRows.length > 0;

  return (

    <>
        <Navbar/>
        <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Upload File & Map Columns</h2>

     
      <div className="bg-white p-6 rounded-lg shadow border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select CSV or Excel file
        </label>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

  
      {file && previewRows.length > 0 && (
        <>
         
          <div className="overflow-x-auto bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Preview (first 20 rows)</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header || `(column ${idx + 1})`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                      >
                        {cell || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        
          {showMappingSection && (
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-5">Map File Columns to System Fields</h3>

              <div className="space-y-5">
                {mandatorySystemFields.map(({ key, label }) => (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700 md:text-right">
                      {label} <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={mapping[key] || ''}
                      onChange={e => updateMapping(key, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">— Select column —</option>
                      {headers.map(h => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel / Choose another file
                </button>

                <button
                  type="button"
                  disabled={!isMappingComplete || uploadStatus === 'uploading'}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Submit File & Mapping'}
                </button>
              </div>
            </div>
          )}

          {showResultSection && (
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-5">Upload Complete</h3>

              {uploadStatus === 'success' ? (
                <div className="space-y-6">
                  <div className="text-green-700 bg-green-50 p-4 rounded-md">
                    File was successfully uploaded and processed.
                  </div>

                  <div className="flex justify-end gap-4">
                    
                    <button
                      type="button"
                      onClick={goToReconciliation}
                      className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
                    >
                      Go to Reconciliation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-red-700 bg-red-50 p-4 rounded-md">
                    Upload failed. Please try again or contact support.
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={reset}
                      className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Try Another File
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                    >
                      Retry Upload
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
    
    
    </>
    
  );
}