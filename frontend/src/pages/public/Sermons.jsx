import React, { useState, useEffect } from 'react';
import sermonService from '../../services/sermonService';

const Sermons = () => {
    const [sermons, setSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        series: '',
        speaker: ''
    });

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                const data = await sermonService.getAll();
                setSermons(data);
            } catch (error) {
                console.error('Failed to fetch sermons', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSermons();
    }, []);

    const getTikTokEmbedUrl = (url) => {
        try {
            const videoIdMatch = url.match(/\/video\/(\d+)/);
            if (videoIdMatch && videoIdMatch[1]) {
                return `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}?lang=en-US`;
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    const filteredSermons = sermons.filter(sermon => {
        const matchSearch = sermon.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            (sermon.speaker && sermon.speaker.toLowerCase().includes(filters.search.toLowerCase()));
        const matchSeries = !filters.series || sermon.series === filters.series;
        const matchSpeaker = !filters.speaker || sermon.speaker === filters.speaker;
        return matchSearch && matchSeries && matchSpeaker;
    });

    // Extract unique series and speakers for filters
    const allSeries = [...new Set(sermons.map(s => s.series).filter(Boolean))];
    const allSpeakers = [...new Set(sermons.map(s => s.speaker).filter(Boolean))];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-12 sm:py-16 text-center px-4">
                <h1 className="font-black text-gray-900 mb-3 sm:mb-4">Sermon Library</h1>
                <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">Watch and listen to recent messages from our services.</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-8 sm:py-12">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                    <input
                        type="text"
                        placeholder="Search sermons..."
                        className="p-3 sm:p-4 text-base border border-gray-300 rounded-xl w-full md:w-80 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all touch-manipulation"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <select
                        className="p-3 sm:p-4 text-base border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none touch-manipulation"
                        value={filters.series}
                        onChange={(e) => setFilters({ ...filters, series: e.target.value })}
                    >
                        <option value="">All Series</option>
                        {allSeries.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        className="p-3 sm:p-4 text-base border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none touch-manipulation"
                        value={filters.speaker}
                        onChange={(e) => setFilters({ ...filters, speaker: e.target.value })}
                    >
                        <option value="">All Speakers</option>
                        {allSpeakers.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="skeleton aspect-[9/16] w-full"></div>
                                <div className="p-5 sm:p-6 space-y-3">
                                    <div className="skeleton h-6 w-3/4 rounded"></div>
                                    <div className="skeleton h-4 w-1/2 rounded"></div>
                                    <div className="skeleton h-4 w-2/3 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredSermons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredSermons.map(sermon => {
                            const embedUrl = getTikTokEmbedUrl(sermon.video_url);

                            return (
                                <div key={sermon.id} className="bg-white rounded-2xl shadow-lg card-hover border border-gray-100 overflow-hidden flex flex-col touch-manipulation">
                                    <div className="relative aspect-[9/16] bg-black">
                                        {embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                className="absolute inset-0 w-full h-full"
                                                allowFullScreen
                                                scrolling="no"
                                                title={sermon.title}
                                                loading="lazy"
                                            ></iframe>
                                        ) : (
                                            <a href={sermon.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-colors group active-scale">
                                                <div className="text-center p-4">
                                                    <span className="text-4xl mb-2 block group-hover:scale-110 transition-transform">▶</span>
                                                    <span className="font-semibold">Watch on TikTok</span>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-blue-50 px-2.5 py-1 rounded">
                                                {sermon.series || 'Single Message'}
                                            </span>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {new Date(sermon.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{sermon.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{sermon.description}</p>
                                        <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {sermon.speaker ? sermon.speaker.charAt(0) : 'S'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{sermon.speaker || 'Guest Speaker'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sermons Found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sermons;
