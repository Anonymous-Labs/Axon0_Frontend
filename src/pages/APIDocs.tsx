import React, { useState } from 'react';
import { Code, Copy, Check, Book, Zap, Users, Cpu } from 'lucide-react';

const APIDocs: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
      >
        {copiedCode === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Book className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AXON API Documentation</h1>
              <p className="text-gray-600 mt-1">Integrate AXON's universal memory layer into your applications</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Get Your API Key</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Log in to your AXON account</li>
              <li>Navigate to the API Keys tab in your dashboard</li>
              <li>Click "Create API Key" and configure permissions</li>
              <li>Copy the generated API key (store it securely!)</li>
            </ol>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Security Note:</strong> Keep your API keys secure. They provide access to your memory data.
                Use appropriate permissions and consider key rotation for production use.
              </p>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700 mb-4">
              All API requests require authentication using your API key in the Authorization header:
            </p>

            <CodeBlock
              code={`Authorization: Bearer YOUR_API_KEY_HERE`}
              id="auth-header"
            />

            <h4 className="font-semibold mt-6 mb-2">Example Request:</h4>
            <CodeBlock
              code={`curl -X GET "http://localhost:8000/api/v1/memories/" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json"`}
              id="curl-example"
            />
          </div>
        </section>

        {/* Framework Integrations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Framework Integrations</h2>

          {/* LangChain */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-orange-500 mr-2" />
              <h3 className="text-xl font-semibold">LangChain Integration</h3>
            </div>

            <p className="text-gray-700 mb-4">
              Use AXON as a memory provider for LangChain agents and chains.
            </p>

            <CodeBlock
              code={`from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
import requests

class AxonMemory(ConversationBufferMemory):
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        super().__init__()
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}

    def save_context(self, inputs, outputs):
        """Save conversation to AXON"""
        memory_data = {
            "content": f"Input: {inputs['input']}\\nOutput: {outputs['output']}",
            "importance_score": 0.7,
            "tags": ["conversation", "langchain"]
        }

        requests.post(
            f"{self.base_url}/api/v1/memories/",
            json=memory_data,
            headers=self.headers
        )

        super().save_context(inputs, outputs)

    def search_memories(self, query: str, limit: int = 5):
        """Search memories in AXON"""
        response = requests.post(
            f"{self.base_url}/api/v1/memories/search",
            json={"query": query, "limit": limit},
            headers=self.headers
        )
        return response.json()

# Usage
memory = AxonMemory(api_key="your_api_key_here")
llm = OpenAI(temperature=0.7)
conversation = ConversationChain(llm=llm, memory=memory)`}
              id="langchain-integration"
            />
          </div>

          {/* CrewAI */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold">CrewAI Integration</h3>
            </div>

            <p className="text-gray-700 mb-4">
              Integrate with CrewAI for persistent memory across agent interactions.
            </p>

            <CodeBlock
              code={`from crewai import Agent, Task, Crew
import requests

class CrewAIAxonMemory:
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}

    def store(self, content: str, metadata: dict = None):
        """Store memory in AXON"""
        memory_data = {
            "content": content,
            "importance_score": metadata.get("importance", 0.5) if metadata else 0.5,
            "tags": metadata.get("tags", []) if metadata else [],
            "extra_metadata": metadata or {}
        }

        response = requests.post(
            f"{self.base_url}/api/v1/memories/",
            json=memory_data,
            headers=self.headers
        )
        return response.json()

    def retrieve(self, query: str, limit: int = 10):
        """Retrieve relevant memories"""
        response = requests.post(
            f"{self.base_url}/api/v1/memories/search",
            json={"query": query, "limit": limit},
            headers=self.headers
        )
        return response.json()

    def get_context(self, task_description: str):
        """Get relevant context for a task"""
        memories = self.retrieve(task_description, limit=5)
        context = "\\n".join([m["content"] for m in memories.get("memories", [])])
        return context

# Usage
memory_system = CrewAIAxonMemory(api_key="your_api_key_here")

agent = Agent(
    role="Research Assistant",
    goal="Conduct thorough research on given topics",
    backstory="You are an expert researcher with access to a comprehensive memory system",
    # Pass memory system to agent (implementation depends on CrewAI version)
)`}
              id="crewai-integration"
            />
          </div>

          {/* Agno */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <Cpu className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Agno Integration</h3>
            </div>

            <p className="text-gray-700 mb-4">
              Enhanced memory capabilities for Agno agents and workflows.
            </p>

            <CodeBlock
              code={`from agno.agent import Agent
from agno.memory import Memory
import requests

class AgnoAxonMemory(Memory):
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}

    def add(self, content: str, metadata: dict = None):
        """Add memory to AXON"""
        memory_data = {
            "content": content,
            "importance_score": metadata.get("importance", 0.5) if metadata else 0.5,
            "tags": metadata.get("tags", []) if metadata else [],
            "extra_metadata": metadata or {}
        }

        response = requests.post(
            f"{self.base_url}/api/v1/memories/",
            json=memory_data,
            headers=self.headers
        )
        return response.json()

    def search(self, query: str, limit: int = 10):
        """Search memories in AXON"""
        response = requests.post(
            f"{self.base_url}/api/v1/memories/search",
            json={"query": query, "limit": limit},
            headers=self.headers
        )
        return [m["content"] for m in response.json().get("memories", [])]

    def get_all(self):
        """Get all memories"""
        response = requests.get(
            f"{self.base_url}/api/v1/memories/",
            headers=self.headers
        )
        return [m["content"] for m in response.json()]

# Usage
memory = AgnoAxonMemory(api_key="your_api_key_here")

agent = Agent(
    name="Research Agent",
    memory=memory,
    instructions="You are a research agent with persistent memory capabilities"
)`}
              id="agno-integration"
            />
          </div>

          {/* Python SDK */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold">Python SDK</h3>
            </div>

            <p className="text-gray-700 mb-4">
              Simple Python client for direct API integration.
            </p>

            <CodeBlock
              code={`import requests

class AxonClient:
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}

    def store_memory(self, content: str, title: str = "", tags: list = None,
                    importance: float = 0.5):
        """Store a memory"""
        data = {
            "content": content,
            "importance_score": importance
        }
        if title:
            data["title"] = title
        if tags:
            data["tags"] = tags

        response = requests.post(
            f"{self.base_url}/api/v1/memories/",
            json=data,
            headers=self.headers
        )
        return response.json()

    def search_memories(self, query: str, limit: int = 10):
        """Search memories"""
        response = requests.post(
            f"{self.base_url}/api/v1/memories/search",
            json={"query": query, "limit": limit},
            headers=self.headers
        )
        return response.json()

    def get_stats(self):
        """Get memory statistics"""
        response = requests.get(
            f"{self.base_url}/api/v1/memories/stats/overview",
            headers=self.headers
        )
        return response.json()

# Usage
client = AxonClient(api_key="your_api_key_here")

# Store a memory
client.store_memory(
    content="Machine learning is a subset of artificial intelligence",
    title="ML Definition",
    tags=["AI", "machine-learning"],
    importance=0.9
)

# Search memories
results = client.search_memories("artificial intelligence")
print(f"Found {len(results['memories'])} memories")

# Get stats
stats = client.get_stats()
print(f"Total memories: {stats['total_memories']}")`}
              id="python-sdk"
            />
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>

          <div className="space-y-6">
            {/* Memories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Memories</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Create Memory</h4>
                  <CodeBlock
                    code={`POST /api/v1/memories/
Content-Type: application/json

{
  "content": "Your memory content here",
  "title": "Optional title",
  "tags": ["tag1", "tag2"],
  "importance_score": 0.8,
  "priority": "high"
}`}
                    id="create-memory"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Search Memories</h4>
                  <CodeBlock
                    code={`POST /api/v1/memories/search
Content-Type: application/json

{
  "query": "search terms",
  "limit": 10,
  "tags": ["tag1"],
  "priority": "high",
  "min_importance": 0.5
}`}
                    id="search-memories"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Get Memory Statistics</h4>
                  <CodeBlock
                    code={`GET /api/v1/memories/stats/overview`}
                    id="memory-stats"
                  />
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">API Keys</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Create API Key</h4>
                  <CodeBlock
                    code={`POST /api/v1/api-keys/
Content-Type: application/json

{
  "name": "My API Key",
  "description": "For production use",
  "permissions": ["read", "write"],
  "expires_at": "2025-12-31T23:59:59Z"
}`}
                    id="create-api-key"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">List API Keys</h4>
                  <CodeBlock
                    code={`GET /api/v1/api-keys/`}
                    id="list-api-keys"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limiting</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700 mb-4">
              AXON implements rate limiting to ensure fair usage:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>General requests:</strong> 60 requests per minute per IP</li>
              <li><strong>API key requests:</strong> 100 requests per minute per API key</li>
              <li><strong>Rate limit headers:</strong> Check `X-RateLimit-*` headers in responses</li>
              <li><strong>Retry-After:</strong> When rate limited, wait for the time specified in `Retry-After` header</li>
            </ul>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> Implement exponential backoff in your client applications when encountering rate limits.
              </p>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Support & Resources</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Getting Help</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Check the <a href="#" className="text-blue-600 hover:underline">troubleshooting guide</a></li>
                  <li>• Review <a href="#" className="text-blue-600 hover:underline">common integration patterns</a></li>
                  <li>• Join our <a href="#" className="text-blue-600 hover:underline">community forum</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Resources</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• <a href="#" className="text-blue-600 hover:underline">Interactive API Explorer</a></li>
                  <li>• <a href="#" className="text-blue-600 hover:underline">SDK Downloads</a></li>
                  <li>• <a href="#" className="text-blue-600 hover:underline">Example Applications</a></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default APIDocs;
