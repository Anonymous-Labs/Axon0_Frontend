import React, { useState, useEffect } from 'react';
import { Memory, EpisodicCluster } from '../types/memory';

interface EpisodicMemoryViewProps {
  memories: Memory[];
  onMemorySelect?: (memory: Memory) => void;
}

interface MemoryNode {
  id: number;
  x: number;
  y: number;
  memory: Memory;
  connections: number[];
}

const EpisodicMemoryView: React.FC<EpisodicMemoryViewProps> = ({
  memories,
  onMemorySelect
}) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'clusters' | 'graph' | 'timeline'>('clusters');
  const [memoryNodes, setMemoryNodes] = useState<MemoryNode[]>([]);
  const [clusters, setClusters] = useState<EpisodicCluster[]>([]);

  useEffect(() => {
    // Group memories by clusters
    const clusterGroups = memories.reduce((acc, memory) => {
      const clusterId = memory.cluster_id || 'unclustered';
      if (!acc[clusterId]) {
        acc[clusterId] = [];
      }
      acc[clusterId].push(memory);
      return acc;
    }, {} as Record<string, Memory[]>);

    // Create cluster objects
    const clusterList: EpisodicCluster[] = Object.entries(clusterGroups).map(([clusterId, clusterMemories]) => ({
      id: clusterId,
      user_id: clusterMemories[0]?.user_id || 0,
      name: clusterId === 'unclustered' ? 'Unclustered Memories' : `Cluster ${clusterId}`,
      description: `Contains ${clusterMemories.length} memories`,
      cluster_type: 'episodic' as const,
      importance_score: clusterMemories.reduce((sum, m) => sum + m.importance_score, 0) / clusterMemories.length,
      priority: 'medium' as const,
      key_memories: clusterMemories.slice(0, 5).map(m => m.id),
      is_active: true,
      created_at: clusterMemories[0]?.created_at || new Date().toISOString()
    }));

    setClusters(clusterList);

    // Create memory nodes for graph view
    const nodes: MemoryNode[] = memories.map((memory, index) => ({
      id: memory.id,
      x: Math.random() * 800,
      y: Math.random() * 600,
      memory,
      connections: [] // Would be populated from relationships
    }));

    setMemoryNodes(nodes);
  }, [memories]);

  const renderClusterView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {clusters.map((cluster) => {
        const clusterMemories = memories.filter(m => (m.cluster_id || 'unclustered') === cluster.id);
        const avgImportance = clusterMemories.reduce((sum, m) => sum + m.importance_score, 0) / clusterMemories.length;

        return (
          <div
            key={cluster.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedCluster === cluster.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
            }`}
            onClick={() => setSelectedCluster(cluster.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{cluster.name}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                cluster.priority === 'high' ? 'bg-red-100 text-red-800' :
                cluster.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {cluster.priority}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3">{cluster.description}</p>

            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{clusterMemories.length} memories</span>
              <span>Importance: {(avgImportance * 100).toFixed(0)}%</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {clusterMemories.slice(0, 3).map((memory) => (
                <span
                  key={memory.id}
                  className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMemory(memory);
                    onMemorySelect?.(memory);
                  }}
                >
                  {memory.title || 'Untitled'}
                </span>
              ))}
              {clusterMemories.length > 3 && (
                <span className="text-xs text-gray-500">+{clusterMemories.length - 3} more</span>
              )}
            </div>

            {cluster.key_memories && cluster.key_memories.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Key Concepts:</div>
                <div className="flex flex-wrap gap-1">
                  {clusterMemories[0]?.key_concepts?.slice(0, 3).map((concept, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderGraphView = () => (
    <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
      <svg className="w-full h-full">
        {/* Render connections */}
        {memoryNodes.map((node) =>
          node.connections.map((targetId) => {
            const targetNode = memoryNodes.find(n => n.id === targetId);
            if (!targetNode) return null;

            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="#cbd5e0"
                strokeWidth="2"
              />
            );
          })
        )}

        {/* Render memory nodes */}
        {memoryNodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={Math.max(5, Math.min(20, node.memory.importance_score * 15))}
            fill={
              node.memory.priority === 'high' ? '#ef4444' :
              node.memory.priority === 'medium' ? '#f59e0b' :
              '#10b981'
            }
            className="cursor-pointer hover:opacity-80"
            onClick={() => {
              setSelectedMemory(node.memory);
              onMemorySelect?.(node.memory);
            }}
          >
            <title>{node.memory.title || 'Untitled Memory'}</title>
          </circle>
        ))}
      </svg>

      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-4 p-4">
      {clusters
        .filter(cluster => cluster.id !== 'unclustered')
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((cluster) => {
          const clusterMemories = memories
            .filter(m => m.cluster_id === cluster.id)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

          return (
            <div key={cluster.id} className="border-l-4 border-blue-500 pl-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold">{cluster.name}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(cluster.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="ml-4 space-y-2">
                {clusterMemories.map((memory, idx) => (
                  <div
                    key={memory.id}
                    className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => {
                      setSelectedMemory(memory);
                      onMemorySelect?.(memory);
                    }}
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{memory.title || 'Untitled'}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {memory.summary || memory.content.substring(0, 100)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(memory.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );

  return (
    <div className="w-full">
      {/* View Mode Selector */}
      <div className="flex gap-2 mb-4 p-4 border-b">
        <button
          className={`px-4 py-2 rounded ${viewMode === 'clusters' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setViewMode('clusters')}
        >
          Clusters
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === 'graph' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setViewMode('graph')}
        >
          Graph
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setViewMode('timeline')}
        >
          Timeline
        </button>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {viewMode === 'clusters' && renderClusterView()}
        {viewMode === 'graph' && renderGraphView()}
        {viewMode === 'timeline' && renderTimelineView()}
      </div>

      {/* Selected Memory Details */}
      {selectedMemory && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedMemory.title || 'Untitled Memory'}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                selectedMemory.priority === 'high' ? 'bg-red-100 text-red-800' :
                selectedMemory.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {selectedMemory.priority}
              </span>
              <span className="text-sm text-gray-500">
                Score: {selectedMemory.importance_score.toFixed(2)}
              </span>
              <button
                onClick={() => setSelectedMemory(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Content</h4>
              <p className="text-gray-800 text-sm leading-relaxed">
                {selectedMemory.content}
              </p>
            </div>

            {selectedMemory.summary && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                <p className="text-gray-600 text-sm italic">
                  {selectedMemory.summary}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(selectedMemory.created_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Last Accessed:</span>
                <span className="ml-2 text-gray-900">
                  {selectedMemory.last_accessed
                    ? new Date(selectedMemory.last_accessed).toLocaleString()
                    : 'Never'
                  }
                </span>
              </div>
              <div>
                <span className="text-gray-500">Cluster:</span>
                <span className="ml-2 text-gray-900">
                  {selectedMemory.cluster_id || 'Unclustered'}
                </span>
              </div>
            </div>

            {selectedMemory.tags && selectedMemory.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMemory.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedMemory.key_concepts && selectedMemory.key_concepts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMemory.key_concepts.map((concept, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Episodic Memory Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Total Memories</div>
            <div className="font-semibold">{memories.length}</div>
          </div>
          <div>
            <div className="text-gray-500">Clusters</div>
            <div className="font-semibold">{clusters.filter(c => c.id !== 'unclustered').length}</div>
          </div>
          <div>
            <div className="text-gray-500">Unclustered</div>
            <div className="font-semibold">
              {clusters.find(c => c.id === 'unclustered')?.key_memories?.length || 0}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Avg Importance</div>
            <div className="font-semibold">
              {memories.length > 0 ? (memories.reduce((sum, m) => sum + m.importance_score, 0) / memories.length * 100).toFixed(0) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodicMemoryView;
