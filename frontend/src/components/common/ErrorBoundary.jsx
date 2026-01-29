import React from 'react';
import Button from './Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-5xl mb-4">😵</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-gray-500 mb-6">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="primary"
                                onClick={() => window.location.reload()}
                            >
                                Refresh Page
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/'}
                            >
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
