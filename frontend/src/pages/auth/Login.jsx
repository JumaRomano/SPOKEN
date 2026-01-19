import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password, rememberMe);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            </div>

            {/* Back to Home Button */}
            <Link
                to="/"
                className={`absolute top-8 left-8 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-gray-600 font-medium hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 shadow-sm ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: '100ms' }}
            >
                <FiArrowLeft className="text-lg" /> Back to Home
            </Link>

            {/* Login Card */}
            <div
                className={`relative z-10 w-full max-w-md p-8 sm:p-10 transition-all duration-700 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
                {/* Glass Effect Container */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl"></div>

                <div className="relative z-20">
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 rounded-full bg-blue-50/50 border border-blue-100 mb-4 shadow-sm">
                            <img src="/src/assets/logo.png" alt="Ministry Logo" className="w-16 h-auto drop-shadow-md" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">The Spoken Word</h1>
                        <p className="text-primary/80 text-sm font-bold uppercase tracking-widest">Member Portal</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-8 text-sm animate-shake shadow-sm">
                            <FiAlertCircle className="text-xl shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="block text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-primary">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <FiMail className="text-lg" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-gray-800 placeholder-gray-400 transition-all duration-300 shadow-sm"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="block text-sm font-bold text-gray-700 ml-1 transition-colors group-focus-within:text-primary">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <FiLock className="text-lg" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-gray-800 placeholder-gray-400 transition-all duration-300 shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer select-none">
                                Remember me
                            </label>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 border border-white/20 !bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:-translate-y-1 relative overflow-hidden group text-white"
                                variant="primary"
                            >
                                <span className="relative z-10">{loading ? 'Signing In...' : 'Sign In'}</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div >
    );
};

export default Login;
