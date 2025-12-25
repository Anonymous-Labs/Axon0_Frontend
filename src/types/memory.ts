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
