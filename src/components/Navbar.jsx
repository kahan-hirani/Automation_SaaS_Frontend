import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bot, BarChart3, ScrollText, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Automation SaaS</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors">
                <Bot className="h-4 w-4" />
                <span>Automations</span>
              </Link>
              <Link to="/logs" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors">
                <ScrollText className="h-4 w-4" />
                <span>Logs</span>
              </Link>
              <Link to="/metrics" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-4 w-4" />
                <span>Metrics</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              <span className="badge badge-success uppercase">{user?.plan}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
