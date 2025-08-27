import { Head, Link } from '@inertiajs/react';

export default function Login() {
    return (
        <>
            <Head title="Login">
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
            <div className="min-h-screen welcome-background relative">
                {/* Dark Overlay to make background darker */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                
                {/* MLBB Barangay Caravan Logo */}
                <div className="relative z-10 pt-8 text-center">
                    <img 
                        src="/images/homepage/caravan.png" 
                        alt="MLBB Barangay Caravan Logo" 
                        className="w-35 h-auto mx-auto"
                    />
                </div>
                
                {/* Main Content Container - Centered */}
                <div className="flex flex-col lg:flex-row gap-2 relative z-10 items-center justify-center" style={{ marginTop: 'calc(20vh - 150px)' }}>
                    {/* Left Side - Login Form Square */}
                    <div className="lg:w-130 lg:h-85 rounded-[50px] p-6 border-6 border-gray-500 bg-dark-container flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            LOG IN CREDENTIALS
                        </h2>
                        <div className="space-y-4 w-90">
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-3 bg-dark-container text-white rounded-2xl border-2 border-yellow-400 focus:outline-none focus:border-yellow-300 text-center"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 bg-dark-container text-white rounded-2xl border-2 border-yellow-400 focus:outline-none focus:border-yellow-300 text-center"
                            />
                            <div className="flex justify-center">
                                <button className="w-30 p-3 bg-yellow-400 text-black font-bold rounded-xl border-2 border-yellow-400 hover:bg-yellow-300 transition-colors">
                                    LOG IN
                                </button>
                            </div>
                            
                            {/* Disclaimer Text */}
                            <div className="text-center mt-4">
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    Accounts are created by Moonton Games. In case of account lockout, please contact Web Team.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Side - Image Rectangle */}
                    <div className="lg:w-240 lg:h-85 hidden lg:flex rounded-3xl p-4 border-6 border-gray-500 bg-dark-container items-center justify-center overflow-hidden relative">
                        <img 
                            src="/images/homepage/image.png" 
                            alt="Heroes Image" 
                            className="absolute inset-0 w-full h-110 object-cover rounded-2xl transform scale-100"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
