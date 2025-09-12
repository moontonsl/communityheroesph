import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

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
                        <form onSubmit={submit} className="space-y-4 w-90">
                            {/* Email Field */}
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full p-3 bg-dark-container text-white rounded-2xl border-2 focus:outline-none text-center ${
                                        errors.email 
                                            ? 'border-red-500 focus:border-red-400' 
                                            : 'border-yellow-400 focus:border-yellow-300'
                                    }`}
                                    required
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1 text-center">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full p-3 bg-dark-container text-white rounded-2xl border-2 focus:outline-none text-center pr-12 ${
                                        errors.password 
                                            ? 'border-red-500 focus:border-red-400' 
                                            : 'border-yellow-400 focus:border-yellow-300'
                                    }`}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1 text-center">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            {/* Login Button */}
                            <div className="flex justify-center">
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className={`w-30 p-3 font-bold rounded-xl border-2 transition-colors ${
                                        processing
                                            ? 'bg-gray-500 text-gray-300 border-gray-500 cursor-not-allowed'
                                            : 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300'
                                    }`}
                                >
                                    {processing ? 'LOGGING IN...' : 'LOG IN'}
                                </button>
                            </div>
                        </form>
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