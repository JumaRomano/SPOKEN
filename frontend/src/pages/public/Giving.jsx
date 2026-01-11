import React from 'react';

const Giving = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
            <div className="text-center space-y-6 max-w-2xl bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-6xl mb-4">🙌</div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary-dark tracking-tight">Online Giving</h1>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                <p className="text-xl md:text-2xl text-gray-600 font-medium">Coming Soon</p>
                <p className="text-gray-500 leading-relaxed">
                    We are currently setting up our secure online giving platform.
                    Thank you for your patience and generosity.
                </p>
                <div className="pt-6">
                    <p className="text-sm text-gray-400">In the meantime, please give in person or contact us for details.</p>
                </div>
            </div>
        </div>
    );
};

export default Giving;
