import React from 'react';
import { Card } from '@/components/ui/card';

interface ChartData {
    month: string;
    submissions: number;
    events: number;
    users: number;
}

interface RegionalData {
    region_name: string;
    count: number;
}

interface AnalyticsChartsProps {
    monthlyTrends: ChartData[];
    regionalDistribution: RegionalData[];
}

const SimpleBarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.submissions, d.events, d.users)));
    
    return (
        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:border-yellow-400/50">
            <div>
                <h3 className="text-2xl font-bold text-white mb-8">{title}</h3>
                <div className="space-y-6">
                    {data.map((item, index) => (
                        <div key={index} className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-white">{item.month}</span>
                                <div className="flex gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        {item.submissions}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        {item.events}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                                        {item.users}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2 h-6 rounded-full overflow-hidden bg-gray-800">
                                <div 
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ 
                                        width: `${(item.submissions / maxValue) * 100}%`,
                                        minWidth: item.submissions > 0 ? '4px' : '0px'
                                    }}
                                    title={`Submissions: ${item.submissions}`}
                                />
                                <div 
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-1000 ease-out"
                                    style={{ 
                                        width: `${(item.events / maxValue) * 100}%`,
                                        minWidth: item.events > 0 ? '4px' : '0px'
                                    }}
                                    title={`Events: ${item.events}`}
                                />
                                <div 
                                    className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full transition-all duration-1000 ease-out"
                                    style={{ 
                                        width: `${(item.users / maxValue) * 100}%`,
                                        minWidth: item.users > 0 ? '4px' : '0px'
                                    }}
                                    title={`Users: ${item.users}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center space-x-6 mt-8 p-4 bg-gray-800/50 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                        <span className="font-medium text-white">Submissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
                        <span className="font-medium text-white">Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full"></div>
                        <span className="font-medium text-white">Users</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RegionalChart: React.FC<{ data: RegionalData[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.count));
    
    return (
        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:border-yellow-400/50">
            <div>
                <h3 className="text-2xl font-bold text-white mb-8">Regional Distribution</h3>
                <div className="space-y-6">
                    {data.slice(0, 8).map((item, index) => (
                        <div key={index} className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-white truncate pr-4">{item.region_name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-white">{item.count}</span>
                                    <span className="text-sm text-gray-300">barangays</span>
                                </div>
                            </div>
                            <div className="relative w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                    style={{ width: `${(item.count / maxValue) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {data.length > 8 && (
                    <div className="mt-8 p-4 bg-gray-800/50 rounded-2xl text-center">
                        <p className="text-sm text-gray-300 font-medium">
                            Showing top 8 regions out of <span className="font-bold text-white">{data.length}</span> total
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ monthlyTrends, regionalDistribution }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="chart-container-mobile">
                <SimpleBarChart 
                    data={monthlyTrends} 
                    title="Monthly Trends (Last 6 Months)" 
                />
            </div>
            <div className="chart-container-mobile">
                <RegionalChart data={regionalDistribution} />
            </div>
        </div>
    );
};

export default AnalyticsCharts;
