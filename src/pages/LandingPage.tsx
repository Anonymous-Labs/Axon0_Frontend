import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Shield, Database, ChevronRight, Users, Cpu } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">AXON</span>
              <span className="ml-1 text-sm text-gray-500">Universal Memory Layer</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Universal Memory Layer
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              AXON is your intelligent memory system that learns, adapts, and remembers.
              Perfect for AI agents, chatbots, and intelligent applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Memory Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for AI agents and intelligent applications with advanced memory management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <Brain className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Semantic Search
              </h3>
              <p className="text-gray-600">
                Find memories using natural language queries with advanced semantic understanding.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <Database className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Intelligent Storage
              </h3>
              <p className="text-gray-600">
                Automatic compression and clustering of memories for optimal storage efficiency.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Processing
              </h3>
              <p className="text-gray-600">
                Fast retrieval and processing with WebSocket support for live applications.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with proper authentication and data encryption.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Multi-tenant Ready
              </h3>
              <p className="text-gray-600">
                Built for multiple users and organizations with proper isolation.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <Cpu className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Integration
              </h3>
              <p className="text-gray-600">
                Seamless integration with LangChain, CrewAI, Agno, and other AI frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Easy Integration
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Works seamlessly with popular AI frameworks and libraries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">LangChain</h3>
              <p className="text-gray-600 mb-4">
                Use AXON as a memory provider for LangChain agents and chains.
              </p>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                from axon_memory import AxonMemory
              </code>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">CrewAI</h3>
              <p className="text-gray-600 mb-4">
                Integrate with CrewAI for persistent memory across agent interactions.
              </p>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                memory=AxonMemory(api_key="...")
              </code>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Agno</h3>
              <p className="text-gray-600 mb-4">
                Enhanced memory capabilities for Agno agents and workflows.
              </p>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                agent.memory = AxonMemory()
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Smarter AI?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join developers building the next generation of intelligent applications.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Start Building <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Brain className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-xl font-bold">AXON</span>
          </div>
          <div className="text-center mt-4 text-gray-400">
            <p>&copy; 2024 AXON Memory System. Built for the future of AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
