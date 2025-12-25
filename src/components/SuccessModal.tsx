import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, Copy, Check } from 'lucide-react';
import Modal from './Modal';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success'
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      case 'info':
        return <Info className="h-8 w-8 text-blue-500" />;
      default:
        return <CheckCircle className="h-8 w-8 text-green-500" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-green-200 bg-green-50';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-green-600 hover:bg-green-700';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={`text-center p-6 border-2 rounded-xl ${getAccentColor()}`}>
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            {getIcon()}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>

        <div className="mb-6">
          {message.split('\n').map((line, index) => (
            <p key={index} className="text-sm text-gray-700 leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {/* Copy button if message contains a code-like string */}
        {message.includes('sk-') || message.includes('api_') || message.includes('key_') || message.includes('Key:') ? (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800 flex-1 mr-3 break-all">
                {message.includes('Key:') ? message.split('Key:')[1].trim() : message}
              </code>
              <button
                onClick={() => copyToClipboard(message.includes('Key:') ? message.split('Key:')[1].trim() : message)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : null}

        <button
          onClick={onClose}
          className={`w-full px-6 py-3 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${getButtonClass()}`}
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
