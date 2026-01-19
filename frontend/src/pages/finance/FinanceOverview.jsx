import { useState } from 'react';
import Button from '../../components/common/Button';
import FundManager from '../../components/finance/FundManager';
import ContributionRecorder from '../../components/finance/ContributionRecorder';
import ContributionList from '../../components/finance/ContributionList';
import PledgeManager from '../../components/finance/PledgeManager';
import financeService from '../../services/financeService';
import './FinanceOverview.css';

const FinanceOverview = () => {
    const [activeTab, setActiveTab] = useState('funds');
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleRecordContribution = async (contributionData) => {
        await financeService.recordContribution(contributionData);
        setMessage({ type: 'success', text: 'Contribution recorded successfully!' });
        // Refresh the current view
        window.location.reload();
    };

    const TabButton = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="finance-container p-6">
            {message.text && (
                <div
                    className={`mb-4 px-4 py-3 rounded ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
                <Button variant="primary" onClick={() => setShowContributionModal(true)}>
                    Record Contribution
                </Button>
            </div>

            <div className="flex space-x-1 border-b border-gray-200 mb-6">
                <TabButton tab="funds" label="Funds" />
                <TabButton tab="contributions" label="Contributions" />
                <TabButton tab="pledges" label="Pledges" />
            </div>

            {activeTab === 'funds' && <FundManager />}
            {activeTab === 'contributions' && <ContributionList />}
            {activeTab === 'pledges' && <PledgeManager />}

            <ContributionRecorder
                isOpen={showContributionModal}
                onClose={() => setShowContributionModal(false)}
                onContributionRecorded={handleRecordContribution}
            />
        </div>
    );
};

export default FinanceOverview;

