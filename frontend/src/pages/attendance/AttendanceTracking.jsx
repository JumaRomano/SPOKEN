import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './AttendanceTracking.css';

const AttendanceTracking = () => {
    return (
        <div className="attendance-container">
            <Card
                title="Attendance Tracking"
                subtitle="Record and view attendance"
                actions={<Button variant="primary">Mark Attendance</Button>}
            >
                <div className="attendance-placeholder">
                    <div className="placeholder-icon">✅</div>
                    <h3>Attendance Tracking</h3>
                    <p>Track attendance for services, events, and group meetings.</p>
                    <div className="placeholder-features">
                        <div className="feature-item">
                            <span className="feature-icon">📊</span>
                            <span>View attendance statistics</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📅</span>
                            <span>Mark service attendance</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">👥</span>
                            <span>Track group attendance</span>
                        </div>
                    </div>
                    <Button variant="primary">Get Started</Button>
                </div>
            </Card>
        </div>
    );
};

export default AttendanceTracking;
