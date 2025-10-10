import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '@/pages/partials/header';
import axios from 'axios';

interface AirtableStatus {
    enabled: boolean;
    base_id: string;
    api_key: string;
    queue: string;
    retry_attempts: number;
}

export default function AirtableManagement() {
    const [status, setStatus] = useState<AirtableStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const response = await axios.get('/admin/airtable/status');
            setStatus(response.data.data);
        } catch (error) {
            console.error('Error loading Airtable status:', error);
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
