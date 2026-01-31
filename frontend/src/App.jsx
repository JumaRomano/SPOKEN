import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

// Lazy load pages for performance
const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const MemberList = lazy(() => import('./pages/members/MemberList'));
const GroupList = lazy(() => import('./pages/groups/GroupList'));
const FinanceOverview = lazy(() => import('./pages/finance/FinanceOverview'));
const AttendanceTracking = lazy(() => import('./pages/attendance/AttendanceTracking'));
const MemberDetail = lazy(() => import('./pages/members/MemberDetail'));
const GroupDetail = lazy(() => import('./pages/groups/GroupDetail'));
const SermonManager = lazy(() => import('./pages/sermons/SermonManager'));
const MemberProfile = lazy(() => import('./pages/members/MemberProfile'));
const MinutesManager = lazy(() => import('./pages/dashboard/MinutesManager'));
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const About = lazy(() => import('./pages/public/About'));
const Sermons = lazy(() => import('./pages/public/Sermons'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    <p className="text-secondary font-medium animate-pulse">Loading Spoken Word Ministries...</p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              <Route path="/login" element={<Login />} />

              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Suspense fallback={<PageLoader />}>
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
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </Suspense>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
