import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd p-5">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md border border-white/20">
                <div className="text-center mb-8">
                    <img src="/src/assets/logo.png" alt="Ministry Logo" className="w-24 h-auto mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-secondary-dark mb-1 uppercase tracking-tight">The Spoken Word</h1>
                    <h2 className="text-lg font-medium text-primary mb-4 uppercase tracking-widest text-xs">of God Ministries</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-primary-gradientStart to-primary-gradientEnd mx-auto rounded-full mb-6"></div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Member Portal</p>
                </div>

                <div className="text-center py-8">
                    <div className="text-5xl mb-4">🚧</div>
                    <h3 className="text-2xl font-bold text-secondary mb-2">Coming Soon</h3>
                    <p className="text-gray-500">
                        We are currently building features to better serve our community. Please check back later.
                    </p>
                </div>
            </div>

            <div className="text-center mt-6">
                <Link to="/" className="text-sm text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <span>←</span> Back to Home
                </Link>
            </div>
        </div >
    );
};

export default Login;
