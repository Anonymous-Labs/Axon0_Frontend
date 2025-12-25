import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Eye } from 'lucide-react';
import { apiKeyService } from '../services/authService';
import Modal from './Modal';
import SuccessModal from './SuccessModal';
import APIKeyModal from './APIKeyModal';

interface APIKey {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  last_used_at?: string;
  usage_count: number;
  key?: string; // Only included when key is first created
}

const APIKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    description: '',
    permissions: ['read', 'write'] as string[],
    expires_at: '',
  });

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ title: '', message: '', type: 'success' });

  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [selectedAPIKey, setSelectedAPIKey] = useState<APIKey | null>(null);
  const [showFullKey, setShowFullKey] = useState(false);
  const [isNewKey, setIsNewKey] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      console.log('Loading API keys...');
      const apiKeys = await apiKeyService.getApiKeys();

      // Load full keys from localStorage and merge with API data
      const apiKeysWithFullKeys = apiKeys.map(apiKey => {
        const storedKey = localStorage.getItem(`api_key_${apiKey.id}`);
        return {
          ...apiKey,
          key: storedKey || undefined
        };
      });

      setApiKeys(apiKeysWithFullKeys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Creating API key:', newKey);
      const createdKey = await apiKeyService.createApiKey({
        name: newKey.name,
        description: newKey.description,
        permissions: newKey.permissions,
        expires_at: newKey.expires_at || undefined,
      });

      // Show success message
      setSuccessModalData({
        title: 'API Key Created Successfully!',
        message: `Your new API key "${createdKey.name}" has been created.\n\n⚠️ Important: Copy this key now. It will not be shown again for security reasons.`,
        type: 'success'
      });
      setShowSuccessModal(true);

      // Store the full key in localStorage for future viewing
      localStorage.setItem(`api_key_${createdKey.id}`, createdKey.key);

      // Show the API key modal with full key
      setSelectedAPIKey(createdKey);
      setShowFullKey(true);
      setIsNewKey(true);
      setShowAPIKeyModal(true);

      // Add the created key to the list (with the full key stored)
      setApiKeys(prev => [...prev, {
        id: createdKey.id,
        name: createdKey.name,
        description: createdKey.description,
        permissions: createdKey.permissions,
        is_active: createdKey.is_active,
        expires_at: createdKey.expires_at,
        created_at: createdKey.created_at,
        last_used_at: createdKey.last_used_at,
        usage_count: createdKey.usage_count,
        key: createdKey.key, // Keep the full key in memory
      }]);

      setShowCreateForm(false);
      setNewKey({
        name: '',
        description: '',
        permissions: ['read', 'write'],
        expires_at: '',
      });
    } catch (error: any) {
      console.error('Failed to create API key:', error);
      setSuccessModalData({
        title: 'Failed to Create API Key',
        message: error.response?.data?.detail || error.message,
        type: 'error'
      });
      setShowSuccessModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!keyToDelete) return;

    try {
      console.log('Deleting API key:', keyToDelete);
      await apiKeyService.deleteApiKey(keyToDelete);

      // Remove the key from localStorage
      localStorage.removeItem(`api_key_${keyToDelete}`);

      setApiKeys(prev => prev.filter(key => key.id !== keyToDelete));

      setSuccessModalData({
        title: 'API Key Deleted',
        message: 'The API key has been successfully deleted.',
        type: 'success'
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Failed to delete API key:', error);
      setSuccessModalData({
        title: 'Failed to Delete API Key',
        message: error.response?.data?.detail || error.message,
        type: 'error'
      });
      setShowSuccessModal(true);
    } finally {
      setShowDeleteConfirm(false);
      setKeyToDelete(null);
    }
  };

  const confirmDeleteKey = (keyId: number) => {
    setKeyToDelete(keyId);
    setShowDeleteConfirm(true);
  };

  const copyToClipboard = async (text: string, successMessage: string = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessModalData({
        title: 'Copied!',
        message: successMessage,
        type: 'success'
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setSuccessModalData({
        title: 'Copy Failed',
        message: 'Failed to copy to clipboard.',
        type: 'error'
      });
      setShowSuccessModal(true);
    }
  };

  const viewAPIKey = (apiKey: APIKey) => {
    // For existing keys, try to get the full key from localStorage
    const storedKey = localStorage.getItem(`api_key_${apiKey.id}`);
    const apiKeyWithFullKey = storedKey ? { ...apiKey, key: storedKey } : apiKey;

    setSelectedAPIKey(apiKeyWithFullKey);
    setShowFullKey(!!storedKey); // Show full key if we have it stored
    setIsNewKey(false);
    setShowAPIKeyModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Management</h1>
          <p className="text-gray-600">
            Create and manage API keys for accessing your memory data programmatically
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create API Key
        </button>
      </div>

      {/* API Documentation Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Key className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">API Documentation</h3>
            <p className="text-sm text-blue-700 mt-1">
              Learn how to use your API keys with different frameworks like LangChain, CrewAI, and more.
            </p>
            <a
              href="/docs"
              onClick={(e) => {
                e.preventDefault();
                window.open('/docs', '_blank');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block cursor-pointer"
            >
              View API Documentation →
            </a>
          </div>
        </div>
      </div>

      {/* Create API Key Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h2>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={newKey.name}
                onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Production API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newKey.description}
                onChange={(e) => setNewKey(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description for this API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="space-y-2">
                {['read', 'write', 'delete'].map((permission) => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newKey.permissions.includes(permission)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNewKey(prev => ({
                          ...prev,
                          permissions: checked
                            ? [...prev.permissions, permission]
                            : prev.permissions.filter(p => p !== permission)
                        }));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
              <input
                type="datetime-local"
                value={newKey.expires_at}
                onChange={(e) => setNewKey(prev => ({ ...prev, expires_at: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !newKey.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md"
              >
                {isLoading ? 'Creating...' : 'Create API Key'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* API Keys List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your API Keys</h2>
        </div>

        <div className="p-6">
          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first API key to start using the AXON API programmatically.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First API Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                      {apiKey.description && (
                        <p className="text-sm text-gray-600 mt-1">{apiKey.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apiKey.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {apiKey.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => viewAPIKey(apiKey)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View API key details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteKey(apiKey.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete API key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Permissions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {apiKey.permissions.map((perm) => (
                          <span key={perm} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="text-gray-900">{new Date(apiKey.created_at).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <p className="text-gray-900">{apiKey.usage_count} requests</p>
                    </div>

                    {apiKey.expires_at && (
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <p className="text-gray-900">{new Date(apiKey.expires_at).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successModalData.title}
        message={successModalData.message}
        type={successModalData.type}
      />

      {/* API Key Display Modal */}
      <APIKeyModal
        isOpen={showAPIKeyModal}
        onClose={() => {
          setShowAPIKeyModal(false);
          setSelectedAPIKey(null);
          setShowFullKey(false);
          setIsNewKey(false);
        }}
        apiKey={selectedAPIKey}
        showFullKey={showFullKey}
        isNewKey={isNewKey}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} size="sm">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete API Key</h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The API key will be permanently deleted and can no longer be used for API requests.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteKey}
              className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
            >
              Delete Key
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default APIKeyManager;
