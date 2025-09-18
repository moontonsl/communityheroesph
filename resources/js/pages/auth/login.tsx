import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import Header from '@/pages/partials/header';

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
            
            <Header />

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
                    {/* Left Side - Modern Login Form */}
                    <div className="lg:w-130 lg:h-85 rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center">
                        {/* Header */}

                        <form onSubmit={submit} className="space-y-4 w-full max-w-sm">
                            {/* Email Field */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all duration-300 ${
                                            errors.email 
                                                ? 'border-red-500/50 focus:ring-red-400/50' 
                                                : 'border-white/20 hover:border-white/30'
                                        }`}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-xs flex items-center">
                                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all duration-300 ${
                                            errors.password 
                                                ? 'border-red-500/50 focus:ring-red-400/50' 
                                                : 'border-white/20 hover:border-white/30'
                                        }`}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs flex items-center">
                                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-end">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                                            data.remember 
                                                ? 'bg-yellow-400 border-yellow-400' 
                                                : 'border-gray-400 group-hover:border-gray-300'
                                        }`}>
                                            {data.remember && (
                                                <svg className="w-2.5 h-2.5 text-black mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                                        Remember me
                                    </span>
                                </label>
                            </div>

                            {/* Login Button */}
                            <button 
                                type="submit"
                                disabled={processing}
                                className={`w-full py-2.5 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                                    processing
                                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 shadow-lg hover:shadow-yellow-400/25 transform hover:scale-[1.02]'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    
                    {/* Right Side - Image Rectangle */}
                    <div className="lg:w-240 lg:h-85 hidden lg:flex rounded-3xl p-4 border-6 border-gray-500 bg-dark-container items-center justify-center overflow-hidden relative">
                        <img 
                            src="/images/homepage/image.png" 
                            alt="Heroes Image" 
                            className="absolute inset-0 w-full h-110 object-cover rounded-md transform scale-100"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}