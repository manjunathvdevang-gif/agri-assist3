import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import AIAssistant from './pages/AIAssistant';
import Guide from './pages/Guide';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import { UserRole } from './types';

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, isAuthenticated }) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/welcome" />;
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-16 overflow-x-hidden">
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/role" element={<RoleSelection onSelect={setRole} />} />
          <Route path="/login" element={<Login role={role} onLogin={() => setIsAuthenticated(true)} />} />
          
          <Route path="/" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              {role === 'consumer' ? <Marketplace role={role} /> : <Dashboard />}
            </PrivateRoute>
          } />
          
          <Route path="/market" element={<PrivateRoute isAuthenticated={isAuthenticated}><Marketplace role={role} /></PrivateRoute>} />
          <Route path="/assistant" element={<PrivateRoute isAuthenticated={isAuthenticated}><AIAssistant /></PrivateRoute>} />
          <Route path="/guide" element={<PrivateRoute isAuthenticated={isAuthenticated}><Guide /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile role={role} /></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/welcome" />} />
        </Routes>
        {isAuthenticated && <BottomNav role={role} />}
      </div>
    </Router>
  );
};

export default App;