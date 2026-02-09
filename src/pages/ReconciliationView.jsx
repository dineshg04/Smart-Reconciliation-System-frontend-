
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosapi';
import Navbar from '../components/Navbar';

export default function ReconciliationView() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    const fetchData = async () => {
      try {
        const uploadJobId =
          location.state?.uploadJobId ||
          localStorage.getItem("jobid") ||
          {};

        localStorage.setItem("jobid", uploadJobId);

        if (!uploadJobId) {
          alert("no file data");
          setLoading(false);
          return;
        }

        console.log("Fetching data for uploadJobId:", uploadJobId);

        const res = await api.get(
          `/api/auth/reconciliation/view/${uploadJobId}`
        );
        
          console.log(res.data);
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, 5000); // ⏱ 30 seconds

  // cleanup (important!)
  return () => clearTimeout(timer);
}, []);

  const openEditModal = (result) => {
    const record = result.recordId || {};
    setEditingRecord({
      id: record._id,
      transactionId: record.transactionId || '',
      amount: record.amount || '',
      referenceNumber: record.referenceNumber || '',
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingRecord(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveChanges = async () => {
     if (!editingRecord) return;

  try {
    const updates = {
      transactionId: editingRecord.transactionId,
      amount: Number(editingRecord.amount) || undefined,
      referenceNumber: editingRecord.referenceNumber,
      date: editingRecord.date || undefined,
    };

    const res = await api.put(`/api/auth/records/correct/${editingRecord.id}`, updates);

    if (res.status !== 200) {
      throw new Error('Failed to save changes');
    }

    alert('Changes saved successfully and logged in audit trail');

    // Refresh the list using the correct endpoint
    const { uploadJobId } = location.state || {};
    if (uploadJobId) {
      const refreshRes = await api.get(`/api/auth/reconciliation/view/${uploadJobId}`);
      setResults(refreshRes.data);
    }

    closeEditModal();
  } catch (err) {
    console.error('Error saving changes:', err);
    alert('Error: ' + (err.response?.data?.message || err.message));
  }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading reconciliation results...</div>;
  }

  return (
    <>
      <Navbar/>

      <div className="p-6 max-w-6xl mx-auto">
      
      <h1 className="text-2xl font-bold mb-6">Reconciliation Results</h1>

      <div className="overflow-x-auto bg-white shadow rounded border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No records found for this upload job
                </td>
              </tr>
            ) : (
              results.map((item, index) => {
                const rec = item.recordId || {};
                return (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 ${
                      item.status === 'Matched'
                        ? 'bg-green-50'
                        : item.status === 'Partially Matched'
                        ? 'bg-yellow-50'
                        : item.status === 'Duplicate'
                        ? 'bg-orange-50'
                        : 'bg-red-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Matched'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Partially Matched'
                            ? 'bg-yellow-100 text-yellow-800'
                            : item.status === 'Duplicate'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rec.transactionId || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rec.amount || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rec.referenceNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rec.date ? new Date(rec.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-5">Edit Record</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                <input
                  name="transactionId"
                  value={editingRecord.transactionId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={editingRecord.amount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input
                  name="referenceNumber"
                  value={editingRecord.referenceNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  name="date"
                  type="date"
                  value={editingRecord.date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    </>
    
  );
}