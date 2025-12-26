export interface Memory {
  id: number;
  user_id: number;
  content: string;
  title?: string;
  summary?: string;
  extra_metadata?: Record<string, any>;
  tags?: string[];
  importance_score: number;
  priority: 'low' | 'medium' | 'high';
  cluster_id?: string;
  parent_memory_id?: number;
  is_compressed: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
  last_accessed?: string;
  // New episodic fields
  key_concepts?: string[];
  episodic_markers?: string[];
  feedback_score?: number;
  chunks_count?: number;
  related_memories_count?: number;
}

export interface MemoryCreate {
  content: string;
  title?: string;
  extra_metadata?: Record<string, any>;
  tags?: string[];
  importance_score?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface MemoryUpdate {
  content?: string;
  title?: string;
  extra_metadata?: Record<string, any>;
  tags?: string[];
  importance_score?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface MemorySearch {
  query: string;
  limit?: number;
  offset?: number;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  min_importance?: number;
  cluster_id?: string;
  semantic_search?: boolean;
}

export interface MemorySearchResponse {
  memories: Memory[];
  total_count: number;
  search_score?: number;
}

export interface Feedback {
  id: number;
  memory_id: number;
  user_id: number;
  feedback_type: 'thumbs_up' | 'thumbs_down' | 'relevance_score';
  feedback_value?: number;
  feedback_text?: string;
  created_at: string;
}

export interface FeedbackCreate {
  memory_id: number;
  feedback_type: 'thumbs_up' | 'thumbs_down' | 'relevance_score';
  feedback_value?: number;
  feedback_text?: string;
}

export interface MemoryStats {
  total_memories: number;
  active_memories: number;
  compressed_memories: number;
  total_clusters: number;
  average_importance: number;
  memories_by_priority: Record<string, number>;
}

// New episodic memory interfaces
export interface EpisodicCluster {
  id: string;
  user_id: number;
  name?: string;
  description?: string;
  cluster_type: 'episodic' | 'semantic' | 'temporal';
  start_date?: string;
  end_date?: string;
  duration_minutes?: number;
  importance_score: number;
  priority: 'low' | 'medium' | 'high';
  summary?: string;
  key_memories?: number[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MemoryChunk {
  id: number;
  memory_id: number;
  user_id: number;
  content: string;
  chunk_index: number;
  chunk_type: string;
  token_count?: number;
  importance_score: number;
}

export interface MemoryRelationship {
  memory_id: number;
  related_memory_id: number;
  relationship_type: 'similar' | 'follows' | 'contradicts' | 'expands' | 'references' | 'nearly_identical' | 'very_similar' | 'related' | 'loosely_related';
  strength: number;
  created_at: string;
}

export interface MemoryGraph {
  id: number;
  user_id: number;
  name?: string;
  description?: string;
  graph_type: 'semantic' | 'temporal' | 'contextual';
  nodes: number[];
  edges: Array<{
    source: number;
    target: number;
    weight: number;
    type: string;
  }>;
  centrality_scores?: Record<string, number>;
  clusters?: number[][];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ContextComposition {
  id: number;
  user_id: number;
  name?: string;
  query: string;
  composition_type: 'search' | 'recommendation' | 'summary';
  memory_ids: number[];
  composed_content: string;
  ranking_scores?: Record<string, number>;
  total_memories: number;
  relevance_score?: number;
  feedback_count: number;
  average_feedback: number;
  created_at: string;
}

export interface FeedbackInsights {
  total_feedback: number;
  average_rating: number;
  common_themes: string[];
  improvement_areas: string[];
  positive_trends: string[];
}

export interface MemorySearchFilters {
  cluster_id?: string;
  episodic_markers?: string[];
  min_feedback_score?: number;
  has_chunks?: boolean;
  relationship_types?: string[];
}
