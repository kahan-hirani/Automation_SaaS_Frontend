import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Metrics from './pages/Metrics';
import Features from './pages/Features';
import Profile from './pages/Profile';
import AutomationDetail from './pages/AutomationDetail';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center bg-black">
        <div className="noise-overlay" />
        <div className="glass-panel flex items-center gap-3 px-6 py-4 text-sm uppercase tracking-[0.3em] text-zinc-300">
          <Loader className="h-4 w-4 animate-spin" />
          Loading workspace
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center bg-black">
        <div className="noise-overlay" />
        <div className="glass-panel flex items-center gap-3 px-6 py-4 text-sm uppercase tracking-[0.3em] text-zinc-300">
          <Loader className="h-4 w-4 animate-spin" />
          Loading workspace
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/metrics"
            element={
              <ProtectedRoute>
                <Metrics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/features"
            element={
              <ProtectedRoute>
                <Features />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/automations/:id"
            element={
              <ProtectedRoute>
                <AutomationDetail />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
