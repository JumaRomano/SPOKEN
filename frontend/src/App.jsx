import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import MemberList from './pages/members/MemberList';
import GroupList from './pages/groups/GroupList';
import FinanceOverview from './pages/finance/FinanceOverview';

import AttendanceTracking from './pages/attendance/AttendanceTracking';
import MemberDetail from './pages/members/MemberDetail';
import GroupDetail from './pages/groups/GroupDetail';

import SermonManager from './pages/sermons/SermonManager';
import MemberProfile from './pages/members/MemberProfile';
import MinutesManager from './pages/dashboard/MinutesManager';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/public/LandingPage';
import PublicLayout from './components/layout/PublicLayout';
import About from './pages/public/About';
// import Ministries from './pages/public/Ministries';
import Sermons from './pages/public/Sermons';

// import Giving from './pages/public/Giving';
import Contact from './pages/public/Contact';
// import Communication from './pages/communication/Communication';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              {/* <Route path="/ministries" element={<Ministries />} /> */}
              <Route path="/sermons" element={<Sermons />} />

              {/* <Route path="/giving" element={<Giving />} /> */}
              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/login" element={<Login />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<MemberProfile />} />
                      <Route path="/members" element={
                        <RoleProtectedRoute allowedRoles={['admin', 'sysadmin']}>
                          <MemberList />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/groups" element={<GroupList />} />
                      <Route path="/finance" element={<FinanceOverview />} />

                      <Route path="/sermons-management" element={<SermonManager />} />
                      <Route path="/members/:id" element={
                        <RoleProtectedRoute allowedRoles={['admin', 'sysadmin']}>
                          <MemberDetail />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/groups/:id" element={<GroupDetail />} />

                      <Route path="/attendance" element={<AttendanceTracking />} />
                      <Route path="/minutes" element={<MinutesManager />} />
                      {/* <Route path="/communication" element={<Communication />} /> */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
