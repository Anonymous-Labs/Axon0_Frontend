import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { Memory, MemorySearch } from '../types/memory';

const SearchMemories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priority: '',
    tags: '',
    minImportance: '',
  });
  const [searchResults, setSearchResults] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const searchParams: MemorySearch = {
        query: searchQuery.trim(),
        limit: 50,
        offset: 0,
        semantic_search: true,
      };

      // Add filters if they exist
      if (filters.priority) {
        searchParams.priority = filters.priority as 'low' | 'medium' | 'high';
      }

      if (filters.tags.trim()) {
        searchParams.tags = filters.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }

      if (filters.minImportance.trim()) {
        searchParams.min_importance = parseFloat(filters.minImportance);
      }

      console.log('Searching with params:', searchParams);

      const response = await memoryService.searchMemories(searchParams);

      setSearchResults(response.memories);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Memories</h1>
        <p className="text-gray-600">
          Find and explore your stored memories using advanced search capabilities
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., work, important, personal"
              value={filters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Importance (0.0 - 1.0)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              placeholder="0.0"
              value={filters.minImportance}
              onChange={(e) => handleFilterChange('minImportance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results ({totalCount > 0 ? `${searchResults.length} of ${totalCount}` : searchResults.length})
          </h2>
        </div>

        <div className="p-6">
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No memories found' : 'Start searching'}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search terms or filters'
                  : 'Enter a search query to find your memories'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((memory) => (
                <div key={memory.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {memory.title || 'Untitled Memory'}
                    </h3>
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

                  <p className="text-gray-600 mb-3 line-clamp-3">{memory.content}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(memory.created_at).toLocaleDateString()}
                      </div>
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          {memory.tags.slice(0, 3).join(', ')}
                          {memory.tags.length > 3 && ` +${memory.tags.length - 3} more`}
                        </div>
                      )}
                    </div>
                    {memory.cluster_id && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Cluster: {memory.cluster_id}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMemories;
