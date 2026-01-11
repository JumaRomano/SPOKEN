import React from 'react';

const Sermons = () => {
    // Mock data for sermons
    const sermons = [
        { id: 1, title: 'Walking in Faith', series: 'The Book of James', date: 'Oct 15, 2025', speaker: 'Pastor 2', views: 245 },
        { id: 2, title: 'Power of Prayer', series: 'Spiritual Disciplines', date: 'Oct 08, 2025', speaker: 'Pastor 1', views: 189 },
        { id: 3, title: 'Community Life', series: 'One Body', date: 'Oct 01, 2025', speaker: 'Deacon 2', views: 156 },
        { id: 4, title: 'Grace Abounds', series: 'Romans', date: 'Sep 24, 2025', speaker: 'Pastor 1', views: 302 },
    ];

    return (
        <div className="page-container">
            <div className="container">
                <section className="page-header">
                    <h1>Sermon Library</h1>
                    <p className="lead">Watch and listen to recent messages.</p>
                </section>

                <div className="filters-bar">
                    <input type="text" placeholder="Search sermons..." className="search-input" />
                    <select className="filter-select">
                        <option>All Series</option>
                        <option>The Book of James</option>
                        <option>Spiritual Disciplines</option>
                    </select>
                    <select className="filter-select">
                        <option>All Speakers</option>
                        <option>Pastor 1</option>
                        <option>Pastor 2</option>
                    </select>
                </div>

                <div className="sermons-grid">
                    {sermons.map(sermon => (
                        <div key={sermon.id} className="sermon-card">
                            <div className="video-placeholder">
                                <span className="play-icon">▶</span>
                            </div>
                            <div className="sermon-info">
                                <span className="series-tag">{sermon.series}</span>
                                <h3>{sermon.title}</h3>
                                <p className="sermon-meta">{sermon.speaker} • {sermon.date}</p>
                                <div className="sermon-actions">
                                    <button className="btn-watch">Watch</button>
                                    <button className="btn-audio">🎧 Audio</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <style>{`
                    .page-container { padding: 4rem 0; }
                    .page-header { text-align: center; margin-bottom: 3rem; }
                    .page-header h1 { font-size: 3rem; color: #1f2937; margin-bottom: 1rem; }
                    .lead { font-size: 1.25rem; color: #6b7280; }
                    
                    .filters-bar { display: flex; justify-content: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
                    .search-input, .filter-select { padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
                    .search-input { width: 300px; }
                    
                    .sermons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
                    .sermon-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; transition: transform 0.2s; }
                    .sermon-card:hover { transform: translateY(-4px); }
                    
                    .video-placeholder { aspect-ratio: 16/9; background: #1f2937; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                    .play-icon { font-size: 3rem; color: white; opacity: 0.8; transition: opacity 0.2s; }
                    .video-placeholder:hover .play-icon { opacity: 1; transform: scale(1.1); }
                    
                    .sermon-info { padding: 1.5rem; }
                    .series-tag { font-size: 0.75rem; text-transform: uppercase; color: #2563eb; font-weight: 700; display: block; margin-bottom: 0.5rem; }
                    .sermon-card h3 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #111827; }
                    .sermon-meta { color: #6b7280; font-size: 0.9rem; margin-bottom: 1.5rem; }
                    
                    .sermon-actions { display: flex; gap: 0.5rem; }
                    .btn-watch { flex: 1; background: #2563eb; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer; font-weight: 600; }
                    .btn-audio { background: #f3f4f6; color: #374151; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 500; }
                    .btn-watch:hover { background: #1d4ed8; }
                    .btn-audio:hover { background: #e5e7eb; }
                `}</style>
            </div>
        </div>
    );
};

export default Sermons;
