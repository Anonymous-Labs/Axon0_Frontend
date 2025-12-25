import React, { useState } from 'react';
import { Copy, Check, Key, Shield, Calendar, Activity } from 'lucide-react';
import Modal from './Modal';

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
  key?: string; // Full API key (only shown during creation)
  key_prefix?: string; // First 8 characters for identification
}

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: APIKey | null;
  showFullKey?: boolean; // Whether to show the full key (during creation)
  isNewKey?: boolean; // Whether this is a newly created key
}

const APIKeyModal: React.FC<APIKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  showFullKey = false,
  isNewKey = false
}) => {
  const [copied, setCopied] = useState(false);

  if (!apiKey) return null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Always show the full key if available, otherwise show prefix + dots
  const displayKey = apiKey.key || (apiKey.key_prefix ? apiKey.key_prefix + '••••••••' : '••••••••••••••••••••••••••••••••');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
              {apiKey.description && (
                <p className="text-sm text-gray-600">{apiKey.description}</p>
              )}
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            apiKey.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {apiKey.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* API Key Display - Always visible */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
            <code className="flex-1 font-mono text-sm text-gray-900 break-all">
              {displayKey}
            </code>
            {apiKey.key ? (
              <button
                onClick={() => copyToClipboard(displayKey)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                title="Copy API key"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            ) : (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded flex-shrink-0">
                Full key not available
              </div>
            )}
          </div>
          {isNewKey && (
            <p className="text-xs text-amber-600 mt-2 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Copy this key now. It will not be shown again for security reasons.
            </p>
          )}
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Permissions</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {apiKey.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                <p className="text-sm text-gray-900">
                  {new Date(apiKey.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Usage</p>
                <p className="text-sm text-gray-900">{apiKey.usage_count} requests</p>
              </div>
            </div>

            {apiKey.expires_at && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Expires</p>
                  <p className="text-sm text-gray-900">
                    {new Date(apiKey.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default APIKeyModal;
