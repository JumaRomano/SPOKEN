import React from 'react';

const About = () => {
    return (
        <div className="page-container">
            <div className="container">
                <section className="page-header">
                    <h1>About Us</h1>
                    <p className="lead">Building a community of faith, hope, and love.</p>
                </section>

                <section className="content-section">
                    <h2>Our Vision & Mission</h2>
                    <div className="grid-2-col">
                        <div className="content-block">
                            <h3>Vision</h3>
                            <p>To be a beacon of light in our community, transforming lives through the power of the Gospel and raising disciples who impact the world.</p>
                        </div>
                        <div className="content-block">
                            <h3>Mission</h3>
                            <p>We exist to worship God, disciple believers, and serve our neighbors with the tangible love of Jesus Christ.</p>
                        </div>
                    </div>
                </section>

                <section className="content-section">
                    <h2>Our Leadership</h2>
                    <div className="team-grid">
                        <div className="team-card">
                            <div className="avatar-placeholder">P</div>
                            <h3>Pastor </h3>
                            <p className="role">Senior Pastor</p>
                        </div>
                        <div className="team-card">
                            <div className="avatar-placeholder">PS</div>
                            <h3>Pastor </h3>
                            <p className="role">Executive Pastor</p>
                        </div>
                        <div className="team-card">
                            <div className="avatar-placeholder">B</div>
                            <h3>Bishop </h3>
                            <p className="role">Head of Ministries</p>
                        </div>
                    </div>
                </section>

                <style>{`
                    .page-container { padding: 4rem 0; }
                    .page-header { text-align: center; margin-bottom: 4rem; }
                    .page-header h1 { font-size: 3rem; color: #1f2937; margin-bottom: 1rem; }
                    .lead { font-size: 1.25rem; color: #6b7280; }
                    .content-section { margin-bottom: 4rem; }
                    .content-section h2 { font-size: 2rem; margin-bottom: 2rem; color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; display: inline-block; }
                    .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
                    .content-block { background: #f9fafb; padding: 2rem; border-radius: 8px; }
                    .content-block h3 { margin-bottom: 1rem; }
                    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; }
                    .team-card { padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 8px; }
                    .avatar-placeholder { width: 100px; height: 100px; background: #e5e7eb; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #9ca3af; }
                    .team-card h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
                    .role { color: #2563eb; font-weight: 500; }
                    @media (max-width: 768px) { .grid-2-col { grid-template-columns: 1fr; } }
                `}</style>
            </div>
        </div>
    );
};

export default About;
