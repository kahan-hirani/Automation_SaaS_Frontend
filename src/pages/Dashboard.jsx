import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AutomationCard from '../components/AutomationCard';
import CreateAutomationModal from '../components/CreateAutomationModal';
import { automationAPI } from '../services/api';
import { Plus, Bot, Loader } from 'lucide-react';

const Dashboard = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const { data } = await automationAPI.getAll();
      setAutomations(data.automations || []);
    } catch (error) {
      console.error('Failed to fetch automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowModal(false);
    fetchAutomations();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        await automationAPI.delete(id);
        fetchAutomations();
      } catch (error) {
        alert('Failed to delete automation');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await automationAPI.toggle(id);
      fetchAutomations();
    } catch (error) {
      alert('Failed to toggle automation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Automations</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage your automation workflows
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Automation</span>
          </button>
        </div>

        {/* Automations Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        ) : automations.length === 0 ? (
          <div className="text-center py-12 card">
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No automations yet</h3>
            <p className="text-gray-600 mb-6">Create your first automation to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Automation</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateAutomationModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default Dashboard;
