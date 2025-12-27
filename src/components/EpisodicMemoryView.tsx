import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Memory, EpisodicCluster } from '../types/memory';
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

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
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Layout calculation functions
  const calculateNodePositions = useCallback((nodes: MemoryNode[], width: number, height: number) => {
    if (nodes.length === 0) return nodes;

    // Use a force-directed layout simulation
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    return nodes.map((node, index) => {
      // Position nodes in a circular pattern initially
      const angle = (index / nodes.length) * 2 * Math.PI;
      const distance = radius * (0.5 + Math.random() * 0.5); // Add some randomness

      return {
        ...node,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
      };
    });
  }, []);

  // Generate connections based on shared tags, concepts, and temporal relationships
  const generateConnections = useCallback((memories: Memory[]) => {
    const connections: { [key: number]: number[] } = {};

    memories.forEach((memory, i) => {
      connections[memory.id] = [];

      memories.forEach((otherMemory, j) => {
        if (i === j) return;

        let connectionStrength = 0;

        // Check shared tags
        const sharedTags = memory.tags?.filter(tag =>
          otherMemory.tags?.includes(tag)
        ) || [];
        connectionStrength += sharedTags.length * 0.3;

        // Check shared concepts
        const sharedConcepts = memory.key_concepts?.filter(concept =>
          otherMemory.key_concepts?.includes(concept)
        ) || [];
        connectionStrength += sharedConcepts.length * 0.4;

        // Check temporal proximity (within same day)
        const memoryDate = new Date(memory.created_at).toDateString();
        const otherDate = new Date(otherMemory.created_at).toDateString();
        if (memoryDate === otherDate) {
          connectionStrength += 0.2;
        }

        // Check cluster relationship
        if (memory.cluster_id && memory.cluster_id === otherMemory.cluster_id) {
          connectionStrength += 0.5;
        }

        // Add connection if strength is significant
        if (connectionStrength > 0.3) {
          connections[memory.id].push(otherMemory.id);
        }
      });
    });

    return connections;
  }, []);

  // Zoom and pan handlers
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  }, []);

  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
    if (!isFullscreen) {
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isFullscreen]);

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

    // Generate connections between memories
    const connections = generateConnections(memories);

    // Create memory nodes for graph view with proper positioning
    const nodes: MemoryNode[] = memories.map((memory) => ({
      id: memory.id,
      x: 0, // Will be set by calculateNodePositions
      y: 0,
      memory,
      connections: connections[memory.id] || []
    }));

    // Calculate proper positions for nodes
    const positionedNodes = calculateNodePositions(nodes, 800, 600);
    setMemoryNodes(positionedNodes);
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

  const renderGraphView = () => {
    const containerHeight = isFullscreen ? '80vh' : 'h-96';

    return (
      <div className={`relative w-full ${containerHeight} bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200`}>
        {/* Graph Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => handleZoom(0.2)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 text-gray-600" /> : <Maximize2 className="h-4 w-4 text-gray-600" />}
          </button>
        </div>

        {/* Main Graph SVG */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            setIsDragging(true);
            setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              const newX = e.clientX - dragStart.x;
              const newY = e.clientY - dragStart.y;
              setPanOffset({ x: newX, y: newY });
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onWheel={(e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? -0.1 : 0.1;
            handleZoom(zoomFactor);
          }}
        >
          <defs>
            {/* Arrow marker for directed connections */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#94a3b8"
              />
            </marker>

            {/* Glow effect for nodes */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
            {/* Render connections with arrows */}
            {memoryNodes.map((node) =>
              node.connections.map((targetId) => {
                const targetNode = memoryNodes.find(n => n.id === targetId);
                if (!targetNode) return null;

                // Calculate control points for curved lines
                const dx = targetNode.x - node.x;
                const dy = targetNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance === 0) return null;

                const controlPointOffset = Math.min(distance * 0.3, 50);
                const midX = (node.x + targetNode.x) / 2;
                const midY = (node.y + targetNode.y) / 2;

                // Perpendicular vector for curve
                const perpX = -dy / distance * controlPointOffset;
                const perpY = dx / distance * controlPointOffset;

                const pathData = `M ${node.x} ${node.y} Q ${midX + perpX} ${midY + perpY} ${targetNode.x} ${targetNode.y}`;

                return (
                  <g key={`${node.id}-${targetId}`}>
                    <path
                      d={pathData}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      opacity="0.6"
                    />
                  </g>
                );
              })
            )}

            {/* Render memory nodes with enhanced styling */}
            {memoryNodes.map((node) => {
              const radius = Math.max(8, Math.min(25, node.memory.importance_score * 20));
              const fillColor = node.memory.priority === 'high' ? '#ef4444' :
                               node.memory.priority === 'medium' ? '#f59e0b' : '#10b981';

              return (
                <g key={node.id}>
                  {/* Node shadow/glow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 2}
                    fill={fillColor}
                    opacity="0.2"
                    filter="url(#glow)"
                  />

                  {/* Main node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={fillColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:stroke-gray-300 transition-all duration-200"
                    onClick={() => {
                      setSelectedMemory(node.memory);
                      onMemorySelect?.(node.memory);
                    }}
                  />

                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + radius + 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 pointer-events-none select-none"
                    style={{ fontSize: '10px' }}
                  >
                    {node.memory.title || 'Untitled'}
                  </text>

                  {/* Importance indicator */}
                  <circle
                    cx={node.x + radius - 5}
                    cy={node.y - radius + 5}
                    r="3"
                    fill="#ffffff"
                    stroke={fillColor}
                    strokeWidth="1"
                  />
                  <text
                    x={node.x + radius - 5}
                    y={node.y - radius + 8}
                    textAnchor="middle"
                    className="text-xs font-bold fill-gray-700 pointer-events-none select-none"
                    style={{ fontSize: '8px' }}
                  >
                    {Math.round(node.memory.importance_score * 100)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <h4 className="font-semibold text-sm text-gray-800 mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">High Priority</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Medium Priority</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Low Priority</span>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <div className="w-4 h-4 border-2 border-slate-400 rounded-full bg-white flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-600">Connection</span>
            </div>
          </div>
        </div>

        {/* Zoom and connection info */}
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200">
          <div className="text-xs text-gray-600">
            Zoom: {Math.round(zoom * 100)}% | Connections: {memoryNodes.reduce((sum, node) => sum + node.connections.length, 0)} | Nodes: {memoryNodes.length}
          </div>
        </div>
      </div>
    );
  };

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
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
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
