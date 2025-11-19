import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '@/pages/partials/header';
import axios from '@/lib/axios';

interface AirtableStatus {
    enabled: boolean;
    base_id: string;
    api_key: string;
    queue: string;
    retry_attempts: number;
}

interface Submission {
    id: number;
    submission_id: string;
    barangay_name: string;
    municipality_name: string;
    province_name: string;
    region_name: string;
    status: string;
    tier: string;
    stage: string;
    approved_by: string | null;
    approved_at: string | null;
    reviewed_by: string | null;
    reviewed_at: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export default function AirtableManagement() {
    const [status, setStatus] = useState<AirtableStatus | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        loadStatus();
        loadSubmissions();
    }, []);

    const loadStatus = async () => {
        try {
            const response = await axios.get('/admin/airtable/status');
            setStatus(response.data.data);
        } catch (error) {
            console.error('Error loading Airtable status:', error);
        }
    };

    const loadSubmissions = async () => {
        setSubmissionsLoading(true);
        try {
            const response = await axios.get('/admin/airtable/submissions');
            if (response.data.success) {
                setSubmissions(response.data.data);
            }
        } catch (error) {
            console.error('Error loading submissions:', error);
            setMessage({ type: 'error', text: 'Failed to load submissions' });
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const updateSubmissionStatus = async (submissionId: string) => {
        if (!newStatus) {
            setMessage({ type: 'error', text: 'Please select a status' });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(`/admin/airtable/update-status/${submissionId}`, {
                status: newStatus,
                admin_notes: adminNotes
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Status updated successfully!' });
                setEditingSubmission(null);
                setNewStatus('');
                setAdminNotes('');
                loadSubmissions(); // Reload submissions to show updated data
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to update status' });
            }
        } catch (error: any) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error updating status' 
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'text-green-400 bg-green-400/20';
            case 'PENDING': return 'text-yellow-400 bg-yellow-400/20';
            case 'REJECTED': return 'text-red-400 bg-red-400/20';
            case 'PRE_APPROVED': return 'text-blue-400 bg-blue-400/20';
            case 'UNDER_REVIEW': return 'text-purple-400 bg-purple-400/20';
            case 'RENEW': return 'text-orange-400 bg-orange-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    const testConnection = async () => {
        setLoading(true);
        setMessage(null);
        
        try {
            const response = await axios.post('/admin/airtable/test');
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Connection successful!' });
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Connection failed' });
            }
        } catch (error: any) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error testing connection' 
            });
        } finally {
            setLoading(false);
        }
    };

    const syncAll = async () => {
        if (!confirm('This will sync all data to Airtable. This may take a while. Continue?')) {
            return;
        }

        setLoading(true);
        setMessage(null);
        
        try {
            const response = await axios.post('/admin/airtable/sync-all');
            if (response.data.success) {
                const results = response.data.results;
                setMessage({ 
                    type: 'success', 
                    text: `Sync completed! Barangay Submissions: ${results.barangay_submissions}, Events: ${results.events}, Event Reports: ${results.event_reports}` 
                });
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Sync failed' });
            }
        } catch (error: any) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error during sync' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Airtable Management">
                 
            </Head>
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden welcome-background">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                AIRTABLE MANAGEMENT
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Manage Airtable integration and data synchronization
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Status Card */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-white">Connection Status</h2>
                            </div>
                            
                            {status && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Sync Enabled:</span>
                                            <span className={`font-semibold ${status.enabled ? 'text-green-400' : 'text-red-400'}`}>
                                                {status.enabled ? '✓ Yes' : '✗ No'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Base ID:</span>
                                            <span className={`font-semibold ${status.base_id === 'Set' ? 'text-green-400' : 'text-red-400'}`}>
                                                {status.base_id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">API Key:</span>
                                            <span className={`font-semibold ${status.api_key === 'Set' ? 'text-green-400' : 'text-red-400'}`}>
                                                {status.api_key}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Queue:</span>
                                            <span className="text-white font-semibold">{status.queue}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Retry Attempts:</span>
                                            <span className="text-white font-semibold">{status.retry_attempts}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-white">Actions</h2>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={testConnection}
                                    disabled={loading}
                                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 
                                        rounded-md shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 
                                        hover:from-blue-400 hover:to-blue-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <span className="relative z-10 flex items-center space-x-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Test Connection</span>
                                    </span>
                                </button>
                                
                                <button
                                    onClick={syncAll}
                                    disabled={loading}
                                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-600 
                                        rounded-md shadow-2xl hover:shadow-green-500/25 transition-all duration-300 
                                        hover:from-green-400 hover:to-green-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <span className="relative z-10 flex items-center space-x-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Sync All Data</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div className={`bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border ${
                                message.type === 'success' ? 'border-green-400/50' : 'border-red-400/50'
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        message.type === 'success' ? 'bg-green-400/20' : 'bg-red-400/20'
                                    }`}>
                                        {message.type === 'success' ? (
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className={`font-semibold ${
                                        message.type === 'success' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Barangay Submissions Table */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white">Barangay Submissions</h2>
                                </div>
                                <button
                                    onClick={loadSubmissions}
                                    disabled={submissionsLoading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {submissionsLoading ? 'Loading...' : 'Refresh'}
                                </button>
                            </div>
                            
                            {submissionsLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-300">
                                        <thead className="text-xs text-gray-400 uppercase bg-white/5">
                                            <tr>
                                                <th className="px-4 py-3">Submission ID</th>
                                                <th className="px-4 py-3">Barangay</th>
                                                <th className="px-4 py-3">Location</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Tier</th>
                                                <th className="px-4 py-3">Created</th>
                                                <th className="px-4 py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissions.map((submission) => (
                                                <tr key={submission.id} className="border-b border-white/10 hover:bg-white/5">
                                                    <td className="px-4 py-3 font-mono text-yellow-400">
                                                        {submission.submission_id}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <div className="font-semibold text-white">{submission.barangay_name}</div>
                                                            <div className="text-xs text-gray-400">{submission.stage}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-xs">
                                                            <div>{submission.municipality_name}</div>
                                                            <div className="text-gray-400">{submission.province_name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                                                            {submission.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-400">
                                                            {submission.tier}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-400">
                                                        {new Date(submission.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => {
                                                                setEditingSubmission(submission);
                                                                setNewStatus(submission.status);
                                                                setAdminNotes(submission.admin_notes || '');
                                                            }}
                                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                                                        >
                                                            Edit Status
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {submissions.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">
                                            No submissions found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Status Update Modal */}
                        {editingSubmission && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
                                    <h3 className="text-xl font-bold text-white mb-4">Update Status</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Submission ID
                                            </label>
                                            <div className="text-yellow-400 font-mono">{editingSubmission.submission_id}</div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Barangay
                                            </label>
                                            <div className="text-white">{editingSubmission.barangay_name}</div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Current Status
                                            </label>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(editingSubmission.status)}`}>
                                                {editingSubmission.status}
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                New Status
                                            </label>
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="PRE_APPROVED">PRE_APPROVED</option>
                                                <option value="APPROVED">APPROVED</option>
                                                <option value="REJECTED">REJECTED</option>
                                                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                                <option value="RENEW">RENEW</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Admin Notes
                                            </label>
                                            <textarea
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                                placeholder="Add notes about this status change..."
                                            />
                                        </div>
                                        
                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                onClick={() => {
                                                    setEditingSubmission(null);
                                                    setNewStatus('');
                                                    setAdminNotes('');
                                                }}
                                                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => updateSubmissionStatus(editingSubmission.submission_id)}
                                                disabled={loading}
                                                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {loading ? 'Updating...' : 'Update Status'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Configuration Help */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-white">Configuration</h2>
                            </div>
                            
                            <div className="space-y-4 text-gray-300">
                                <p>To enable Airtable integration, add these variables to your <code className="bg-white/10 px-2 py-1 rounded">.env</code> file:</p>
                                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm">
                                    <div className="text-green-400">AIRTABLE_API_KEY=your_api_key_here</div>
                                    <div className="text-green-400">AIRTABLE_BASE_ID=your_base_id_here</div>
                                    <div className="text-blue-400">AIRTABLE_SYNC_ENABLED=true</div>
                                </div>
                                <p className="text-sm text-gray-400">
                                    You can find your API key and Base ID in your Airtable account under Account → API documentation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
