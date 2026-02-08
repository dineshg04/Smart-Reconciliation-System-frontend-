// src/pages/AuditLog.jsx
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosapi';

export default function Auditlog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/auth/auditlog/all');
        console.log('Audit logs');
        setLogs(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audit logs...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center text-red-600">
          Error: {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  if (logs.length === 0) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center text-gray-600">
          No audit logs found yet.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">System Audit Log</h1>

        <div className="overflow-x-auto bg-white shadow rounded border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date / Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action / Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Old Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Record (Txn ID)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={log._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(log.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.changedBy?.name || log.changedBy?.email || 'System'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {log.fieldName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.oldValue ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-700 font-medium">
                    {log.newValue ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.recordId?.transactionId || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.source === 'Manual'
                        ? 'bg-purple-100 text-purple-800'
                        : log.source === 'Auto'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}