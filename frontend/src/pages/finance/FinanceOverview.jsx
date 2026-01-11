import { useState, useEffect } from 'react';
import financeService from '../../services/financeService';
import dashboardService from '../../services/dashboardService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './FinanceOverview.css';

const FinanceOverview = () => {
    const [funds, setFunds] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalThisMonth: 0,
        totalThisYear: 0,
        contributorsCount: 0,
    });

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            setLoading(true);
            const [fundsResponse, contributionsResponse, statsResponse] = await Promise.all([
                financeService.getFunds(),
                financeService.getContributions({ limit: 10 }),
                dashboardService.getStats(), // Fetch real stats
            ]);

            setFunds(fundsResponse.data || []);
            setContributions(contributionsResponse.data?.contributions || []);

            // Use real stats if available, fallbacks to 0
            const realStats = statsResponse.data || {};
            setStats({
                totalThisMonth: realStats.thisMonthGiving || 0,
                totalThisYear: realStats.totalContributions || 0, // Using total contributions as proxy for year if specific year stat missing
                contributorsCount: realStats.totalMembers || 0, // Using total members or we could add a specific count for contributors if backend supports it
            });
        } catch (err) {
            setError('Failed to load financial data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="finance-container">
            <div className="page-header">
                <h1>Financial Management</h1>
                <Button variant="primary">Record Contribution</Button>
            </div>

            {loading ? (
                <div className="loading-state">Loading financial data...</div>
            ) : error ? (
                <div className="error-state">{error}</div>
            ) : (
                <>
                    <div className="finance-stats">
                        <div className="stat-card-finance">
                            <div className="stat-icon-finance">💰</div>
                            <div>
                                <div className="stat-label">This Month</div>
                                <div className="stat-value-finance">
                                    {formatCurrency(stats.totalThisMonth)}
                                </div>
                            </div>
                        </div>
                        <div className="stat-card-finance">
                            <div className="stat-icon-finance">📊</div>
                            <div>
                                <div className="stat-label">This Year</div>
                                <div className="stat-value-finance">
                                    {formatCurrency(stats.totalThisYear)}
                                </div>
                            </div>
                        </div>
                        <div className="stat-card-finance">
                            <div className="stat-icon-finance">👥</div>
                            <div>
                                <div className="stat-label">Contributors</div>
                                <div className="stat-value-finance">{stats.contributorsCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="finance-grid">
                        <Card title="Funds" subtitle={`${funds.length} active funds`}>
                            <div className="funds-list">
                                {funds.map((fund) => (
                                    <div key={fund.id} className="fund-item">
                                        <div className="fund-info">
                                            <div className="fund-name">{fund.fundName}</div>
                                            <div className="fund-type">{fund.fundType}</div>
                                        </div>
                                        <div className="fund-balance">
                                            {formatCurrency(fund.currentBalance || 0)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Recent Contributions" subtitle="Last 10 contributions">
                            {contributions.length === 0 ? (
                                <div className="empty-message">No contributions yet</div>
                            ) : (
                                <div className="contributions-list">
                                    {contributions.map((contribution, index) => (
                                        <div key={index} className="contribution-item">
                                            <div className="contribution-info">
                                                <div className="contribution-type">
                                                    {contribution.contributionType}
                                                </div>
                                                <div className="contribution-date">
                                                    {new Date(contribution.contributionDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="contribution-amount">
                                                {formatCurrency(contribution.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default FinanceOverview;
