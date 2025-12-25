import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Plus, Search, Settings, LogOut, Key, Book, BarChart3 } from 'lucide-react';
import AddMemoryModal from '../components/AddMemoryModal';
import SearchMemories from '../components/SearchMemories';
import APIKeyManager from '../components/APIKeyManager';
import { memoryService } from '../services/memoryService';
import { Memory } from '../types/memory';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'api-keys' | 'settings'>('dashboard');
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setIsLoadingMemories(true);
    try {
      const fetchedMemories = await memoryService.getMemories(10, 0);
      setMemories(fetchedMemories);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    } finally {
      setIsLoadingMemories(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">AXON</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="API Documentation"
              >
                <Book className="h-5 w-5" />
              </Link>
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Search className="h-5 w-5 inline mr-2" />
              Search
            </button>
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'api-keys'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Key className="h-5 w-5 inline mr-2" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="h-5 w-5 inline mr-2" />
              Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Your Memory Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Manage and explore your universal memory layer
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMemory(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Memory
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Memories</p>
                    <p className="text-2xl font-semibold text-gray-900">{memories.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Memories</p>
                    <p className="text-2xl font-semibold text-gray-900">{memories.filter(m => !m.is_deleted).length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Plus className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Clusters</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {new Set(memories.map(m => m.cluster_id).filter(Boolean)).size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Key className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">API Keys</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Memories */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Memories</h2>
              </div>
              <div className="p-6">
                {isLoadingMemories ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading memories...</p>
                  </div>
                ) : memories.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No memories yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start by adding your first memory to the system.
                    </p>
                    <button
                      onClick={() => setShowAddMemory(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Your First Memory
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {memories.slice(0, 5).map((memory) => (
                      <div key={memory.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            {memory.title || 'Untitled Memory'}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              memory.priority === 'high' ? 'bg-red-100 text-red-800' :
                              memory.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {memory.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {memory.importance_score.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {memory.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Created {new Date(memory.created_at).toLocaleDateString()}
                          </span>
                          {memory.tags && memory.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {memory.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {memory.tags.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{memory.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {memories.length > 5 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => setActiveTab('search')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View all memories →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'search' && <SearchMemories />}
        {activeTab === 'api-keys' && <APIKeyManager />}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings functionality coming soon...</p>
          </div>
        )}
      </main>

      {/* Add Memory Modal */}
      {showAddMemory && (
        <AddMemoryModal
          onClose={() => setShowAddMemory(false)}
          onMemoryAdded={() => {
            setShowAddMemory(false);
            fetchMemories(); // Refresh memories list
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
