import React, { useState, useEffect } from 'react';
import groupService from '../../services/groupService';

const Ministries = () => {
    const [ministries, setMinistries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMinistries = async () => {
            try {
                // In production, we'd filter for type='ministry' and verified=true
                // For now, getting all groups as a demo
                const data = await groupService.getAll({ status: 'active' });
                setMinistries(data);
            } catch (error) {
                console.error('Failed to fetch ministries', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMinistries();
    }, []);

    return (
        <div className="page-container">
            <div className="container">
                <section className="page-header">
                    <h1>Our Ministries</h1>
                    <p className="lead">Find a place to serve, belong, and grow.</p>
                </section>

                {loading ? (
                    <div className="loading">Loading ministries...</div>
                ) : (
                    <div className="ministry-grid">
                        {ministries.length > 0 ? ministries.map(group => (
                            <div key={group.id} className="ministry-card">
                                <h3>{group.name}</h3>
                                <span className="badge">{group.group_type}</span>
                                <p className="description">{group.description || 'Join us to serve and fellowship together.'}</p>
                                <div className="ministry-footer">
                                    <p className="schedule">📅 {group.meeting_schedule || 'Contact for schedule'}</p>
                                    <button className="btn-join">Learn More</button>
                                </div>
                            </div>
                        )) : (
                            <div className="no-data">
                                <p>No ministries found at the moment. Please check back later.</p>
                            </div>
                        )}
                    </div>
                )}

                <style>{`
                    .page-container { padding: 4rem 0; }
                    .page-header { text-align: center; margin-bottom: 4rem; }
                    .page-header h1 { font-size: 3rem; color: #1f2937; margin-bottom: 1rem; }
                    .lead { font-size: 1.25rem; color: #6b7280; }
                    .loading, .no-data { text-align: center; padding: 3rem; color: #6b7280; font-size: 1.1rem; }
                    
                    .ministry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
                    .ministry-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.2s; display: flex; flex-direction: column; }
                    .ministry-card:hover { transform: translateY(-4px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .ministry-card h3 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1f2937; }
                    .badge { display: inline-block; background: #dbeafe; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 1rem; align-self: flex-start; }
                    .description { color: #4b5563; margin-bottom: 1.5rem; flex: 1; line-height: 1.5; }
                    .ministry-footer { border-top: 1px solid #f3f4f6; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; }
                    .schedule { font-size: 0.9rem; color: #6b7280; margin: 0; }
                    .btn-join { background: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
                    .btn-join:hover { background: #2563eb; color: white; }
                `}</style>
            </div>
        </div>
    );
};

export default Ministries;
