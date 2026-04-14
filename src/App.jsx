import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import AptitudeTest from './pages/AptitudeTest';
import CodingChallenge from './pages/CodingChallenge';
import AIInterview from './pages/AIInterview';
import Results from './pages/Results';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCandidateDetail from './pages/AdminCandidateDetail';

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />

            {/* Protected candidate routes */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/applications"
                element={
                    <ProtectedRoute>
                        <Applications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/aptitude/:applicationId"
                element={
                    <ProtectedRoute>
                        <AptitudeTest />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/coding/:applicationId"
                element={
                    <ProtectedRoute>
                        <CodingChallenge />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/interview/:applicationId"
                element={
                    <ProtectedRoute>
                        <AIInterview />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/results/:applicationId"
                element={
                    <ProtectedRoute>
                        <Results />
                    </ProtectedRoute>
                }
            />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
                path="/admin/dashboard"
                element={
                    <AdminProtectedRoute>
                        <AdminDashboard />
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/candidate/:id"
                element={
                    <AdminProtectedRoute>
                        <AdminCandidateDetail />
                    </AdminProtectedRoute>
                }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}
