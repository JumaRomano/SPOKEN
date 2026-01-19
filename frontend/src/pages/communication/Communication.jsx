import AnnouncementList from '../../components/communication/AnnouncementList';
import './Communication.css';

const Communication = () => {
    return (
        <div className="communication-page p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Communication Center</h1>
                <p className="text-gray-600 mt-1">Manage announcements and broadcasts</p>
            </div>

            <AnnouncementList />
        </div>
    );
};

export default Communication;
