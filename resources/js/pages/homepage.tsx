import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Homepage() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Homepage">
                {/* Global Poppins font is already set in CSS */}
            </Head>
            
            {/* Black Header with Navigation */}
            <header className="bg-black text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-1xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-17">
                        {/* Left Side - Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            {/* Logo Container */}
                            <div className="relative">
                                {/* Logo Image */}
                                <img 
                                    src="/images/homepage/communityheroes-logo.png" 
                                    alt="Community Heroes Logo" 
                                    className="w-15 h-15 object-contain"
                                />
                            </div>
                            
                            {/* Brand Text */}
                            <div className="text-3xl font-black tracking-wider">
                                COMMUNITY HEROES PH
                            </div>
                        </div>
                        
                        {/* Right Side - MLBB Logo */}
                        <div className="flex items-center">
                            <img 
                                src="/images/homepage/mlbb-logo.png" 
                                alt="Mobile Legends Bang Bang Logo" 
                                className="w-30 h-30 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with Background Image */}
            <div className="min-h-screen welcome-background flex items-center justify-center">
                {/* Welcome Content */}
                <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-4">Welcome to Community Heroes PH</h1>
                    <p className="text-xl mb-8">Join our community of heroes</p>
                    <div className="space-x-4">
                        <Link href="/login" className="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors">
                            LOG IN
                        </Link>
                        <Link href="/register" className="inline-block bg-gray-600 text-white font-bold px-8 py-3 rounded-xl border-2 border-gray-500 hover:bg-gray-700 transition-colors">
                            REGISTER
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
