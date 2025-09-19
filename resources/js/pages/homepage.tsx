import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/pages/partials/header';
import StatisticsCards from '@/components/statistics-cards';
import AnalyticsCharts from '@/components/analytics-charts';
import RecentActivity from '@/components/recent-activity';
import { BarChart3, TrendingUp, Users, MapPin } from 'lucide-react';

interface HomepageProps {
    stats: {
        submissions: any;
        events: any;
        users: any;
        tiers: any;
        regional_distribution: any;
        monthly_trends: any;
        recent_activity: any;
        growth_rates: any;
        summary: any;
    };
}

export default function Homepage() {
    const { auth, stats } = usePage<SharedData & HomepageProps>().props;
    
    const isSuperAdmin = (auth?.user as any)?.role?.name === 'super-admin';

    return (
        <>
            <Head title={isSuperAdmin ? "Community Heroes PH - Analytics Dashboard" : "Community Heroes PH"}>
                 
            </Head>
            
            <Header />

            <div className="relative min-h-[60vh] md:min-h-[70vh] welcome-background flex items-center justify-center px-4 overflow-hidden">

                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="text-center text-white z-10 max-w-5xl mx-auto">
                    <div className="mb-8 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="hero-title-mobile text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient leading-tight">
                                COMMUNITY HEROES PH
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    
                    <p className="hero-subtitle-mobile text-xl md:text-2xl lg:text-3xl mb-12 animate-slide-up text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                        Empowering Communities Through 
                        <span className="font-semibold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text"> Mobile Legends Tournament</span>
                    </p>
                    
                    <div className="hero-stats-mobile grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-in-left hover:scale-105">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-yellow-400/20 rounded-2xl">
                                    <MapPin className="h-8 w-8 text-yellow-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-3xl md:text-4xl font-black text-white">{stats?.submissions?.approved || 0}</div>
                                    <div className="text-sm text-gray-300 font-medium uppercase tracking-wider">Active Barangays</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-in-up hover:scale-105">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-yellow-400/20 rounded-2xl">
                                    <BarChart3 className="h-8 w-8 text-yellow-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-3xl md:text-4xl font-black text-white">{stats?.events?.total || 0}</div>
                                    <div className="text-sm text-gray-300 font-medium uppercase tracking-wider">Events Hosted</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-in-right hover:scale-105">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-yellow-400/20 rounded-2xl">
                                    <Users className="h-8 w-8 text-yellow-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-3xl md:text-4xl font-black text-white">{stats?.users?.total || 0}</div>
                                    <div className="text-sm text-gray-300 font-medium uppercase tracking-wider">Community Members</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* abang */}
            {isSuperAdmin && (
                <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen py-16 overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                            radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                        }}></div>
                    </div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 animate-fade-in">
                            <div className="inline-block mb-6">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider">
                                    <BarChart3 className="h-5 w-5" />
                                    Analytics Dashboard
                                </div>
                            </div>
                            <br />
                            <div className="inline-block">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                    DATA INSIGHTS
                                </h2>
                                <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-gray-300 text-xl mt-8 max-w-4xl mx-auto leading-relaxed font-light">
                                Comprehensive insights into community engagement, event management, and regional distribution across the Philippines.
                            </p>
                        </div>

                        {stats && (
                            <>
                                <StatisticsCards stats={stats} />
                                
                                <div className="mt-20">
                                    <div className="text-center mb-12 animate-slide-up">
                                        <div className="flex items-center justify-center space-x-4 mb-6">
                                            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                            <h3 className="text-3xl font-bold text-white">Performance Metrics</h3>
                                        </div>
                                        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                                            Track trends and patterns across regions and time periods
                                        </p>
                                    </div>
                                    <AnalyticsCharts 
                                        monthlyTrends={stats.monthly_trends}
                                        regionalDistribution={stats.regional_distribution}
                                    />
                                </div>

                                <div className="mt-20">
                                    <div className="text-center mb-12 animate-slide-up">
                                        <div className="flex items-center justify-center space-x-4 mb-6">
                                            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                            <h3 className="text-3xl font-bold text-white">Live Updates</h3>
                                        </div>
                                        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                                            Stay updated with the latest submissions and events
                                        </p>
                                    </div>
                                    <RecentActivity 
                                        recentSubmissions={stats.recent_activity.recent_submissions}
                                        recentEvents={stats.recent_activity.recent_events}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-12 animate-slide-up">
                            <div className="flex items-center justify-center space-x-4 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                <h3 className="text-3xl font-bold text-white">Get Started</h3>
                            </div>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                                Join the community and start making a difference today
                            </p>
                        </div>
                        
                        <div className="quick-actions-mobile grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <Link
                                href="/registerbarangay"
                                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-yellow-400/50"
                            >
                                <div className="text-center">
                                    <div className="p-4 bg-yellow-400/20 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="h-8 w-8 text-yellow-400" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-3">Register Barangay</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">Join our network of community partners</p>
                                </div>
                            </Link>
                            
                            <Link
                                href="/apply-event"
                                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-yellow-400/50"
                            >
                                <div className="text-center">
                                    <div className="p-4 bg-yellow-400/20 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <BarChart3 className="h-8 w-8 text-yellow-400" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-3">Apply for Event</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">Host impactful community events</p>
                                </div>
                            </Link>
                            
                            <Link
                                href="/MyBarangay"
                                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-yellow-400/50"
                            >
                                <div className="text-center">
                                    <div className="p-4 bg-yellow-400/20 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="h-8 w-8 text-yellow-400" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-3">View Portal</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">Access your dashboard and analytics</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
