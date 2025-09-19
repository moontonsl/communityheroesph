import React from 'react';
import { TrendingUp, TrendingDown, Users, MapPin, Calendar, Award, CheckCircle} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    change?: number;
    changeLabel?: string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
    format?: 'number' | 'percentage' | 'currency';
}

const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    icon, 
    change, 
    changeLabel, 
    color = 'blue',
    format = 'number'
}) => {
    const formatValue = (val: number | string) => {
        if (typeof val === 'string') return val;
        
        switch (format) {
            case 'percentage':
                return `${val}%`;
            case 'currency':
                return new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP'
                }).format(val);
            default:
                return new Intl.NumberFormat('en-PH').format(val);
        }
    };

    return (
        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-yellow-400/50 animate-slide-in-up">


            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">{title}</p>
                    <p className="text-3xl md:text-4xl font-black text-white stat-number mb-2">{formatValue(value)}</p>
                    {change !== undefined && changeLabel && (
                        <div className="flex items-center">
                            {change >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-yellow-400 mr-2" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
                            )}
                            <span className={`text-sm font-semibold ${change >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {Math.abs(change)}% {changeLabel}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-yellow-400/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <div className="h-8 w-8 text-yellow-400">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatisticsCardsProps {
    stats: {
        submissions: any;
        events: any;
        users: any;
        tiers: any;
        growth_rates: any;
        summary: any;
    };
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Barangays"
                    value={stats.submissions.approved}
                    icon={<MapPin className="h-6 w-6" />}
                    change={stats.growth_rates.submissions}
                    changeLabel="vs last month"
                    color="green"
                />
                <StatCard
                    title="Total Events"
                    value={stats.events.total}
                    icon={<Calendar className="h-6 w-6" />}
                    change={stats.growth_rates.events}
                    changeLabel="vs last month"
                    color="blue"
                />
                <StatCard
                    title="Total Users"
                    value={stats.users.total}
                    icon={<Users className="h-6 w-6" />}
                    change={stats.growth_rates.users}
                    changeLabel="vs last month"
                    color="purple"
                />
                <StatCard
                    title="Success Rate"
                    value={stats.summary.success_rate}
                    icon={<CheckCircle className="h-6 w-6" />}
                    format="percentage"
                    color="green"
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Bronze Tier"
                    value={stats.tiers.bronze}
                    icon={<Award className="h-6 w-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Silver Tier"
                    value={stats.tiers.silver}
                    icon={<Award className="h-6 w-6" />}
                    color="indigo"
                />
                <StatCard
                    title="Gold Tier"
                    value={stats.tiers.gold}
                    icon={<Award className="h-6 w-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Platinum Tier"
                    value={stats.tiers.platinum}
                    icon={<Award className="h-6 w-6" />}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Completed Events"
                    value={stats.events.completed}
                    icon={<CheckCircle className="h-6 w-6" />}
                    color="green"
                />
                <StatCard
                    title="Successful Events"
                    value={stats.events.successful}
                    icon={<TrendingUp className="h-6 w-6" />}
                    color="green"
                />
                <StatCard
                    title="Total Participants"
                    value={stats.summary.total_participants}
                    icon={<Users className="h-6 w-6" />}
                    color="blue"
                />
            </div>
        </div>
    );
};

export default StatisticsCards;
