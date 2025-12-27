import React, { useState } from 'react';
import { X, Save, FileText, Tag, Flag, Star, AlertCircle } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { MemoryCreate } from '../types/memory';

interface AddMemoryModalProps {
  onClose: () => void;
  onMemoryAdded: () => void;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ onClose, onMemoryAdded }) => {
  const [formData, setFormData] = useState({
    content: '',
    title: '',
    tags: '',
    importance_score: 0.5,
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importance_score' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Prepare the memory data for API call
      const memoryData: MemoryCreate = {
        content: formData.content.trim(),
        title: formData.title.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
        importance_score: formData.importance_score,
        priority: formData.priority,
      };

      console.log('Adding memory:', memoryData);

      // Make the API call
      const createdMemory = await memoryService.createMemory(memoryData);

      console.log('Memory created successfully:', createdMemory);

      onMemoryAdded();
      onClose(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to add memory:', err);
      setError(err.response?.data?.detail || 'Failed to add memory');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Memory</h2>
              <p className="text-sm text-gray-600 mt-1">Create a new memory with details and metadata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Give your memory a meaningful title"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
              placeholder="Describe your memory in detail. What happened? When? Where? How did you feel?"
            />
            <p className="text-xs text-gray-500 mt-2">Be as detailed as possible to create a rich memory</p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Tag className="h-4 w-4 mr-2 text-gray-500" />
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="work, personal, important, meeting"
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              Separate multiple tags with commas
            </p>
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Flag className="h-4 w-4 mr-2 text-gray-500" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' },
                { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' },
                { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: option.value as 'low' | 'medium' | 'high' }))}
                  className={`px-4 py-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                    formData.priority === option.value
                      ? option.color + ' ring-2 ring-offset-2 ring-blue-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Importance Score */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-4">
              <Star className="h-4 w-4 mr-2 text-gray-500" />
              Importance Score
            </label>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">How important is this memory?</span>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-900">{formData.importance_score}</span>
                </div>
              </div>
              <input
                type="range"
                id="importance_score"
                name="importance_score"
                min="0"
                max="1"
                step="0.1"
                value={formData.importance_score}
                onChange={handleChange}
                className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-400 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Not Important</span>
                <span>Very Important</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.content.trim()}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving Memory...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Memory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;
