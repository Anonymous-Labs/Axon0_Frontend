import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Database, Users, Cpu, Sparkles, ArrowRight, Star, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-18 h-18 bg-indigo-200 rounded-full opacity-25"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-50 bg-white/80 backdrop-blur-lg shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div>
                <Brain className="h-8 w-8 text-blue-600" />
              </motion.div>
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AXON
              </span>
              <span className="ml-2 text-sm text-gray-500 font-medium">Universal Memory Layer</span>
            </motion.div>
            <div className="flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-white font-medium">Next-Generation AI Memory</span>
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Universal
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Memory Layer
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Transform your AI agents with intelligent memory that learns, adapts, and remembers.
              Built for the future of intelligent applications.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  to="/signup"
                  className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl inline-flex items-center"
                >
                  Start Building Free
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#features"
                  className="group border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm inline-flex items-center"
                >
                  <Globe className="h-6 w-6 mr-3" />
                  Explore Features
                </a>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-200"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="font-medium">Trusted by 10,000+ developers</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-green-300 mr-2" />
                <span className="font-medium">99.9% uptime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g fill="none" fillRule="evenodd">
              <g fill="#9C92AC" fillOpacity="0.05">
                <circle cx="30" cy="30" r="2"/>
              </g>
            </g>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold">Advanced Capabilities</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Powerful Memory
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Capabilities
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built for AI agents and intelligent applications with advanced memory management,
              real-time processing, and enterprise-grade security.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Brain,
                title: "Semantic Search",
                description: "Find memories using natural language queries with advanced semantic understanding and context awareness.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-50 to-cyan-50",
                delay: 0
              },
              {
                icon: Database,
                title: "Intelligent Storage",
                description: "Automatic compression and clustering of memories for optimal storage efficiency and lightning-fast retrieval.",
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-50 to-emerald-50",
                delay: 0.1
              },
              {
                icon: Zap,
                title: "Real-time Processing",
                description: "Fast retrieval and processing with WebSocket support for live applications and instant memory access.",
                color: "from-yellow-500 to-orange-500",
                bgColor: "from-yellow-50 to-orange-50",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Enterprise-grade security with proper authentication, data encryption, and privacy-first architecture.",
                color: "from-red-500 to-pink-500",
                bgColor: "from-red-50 to-pink-50",
                delay: 0.3
              },
              {
                icon: Users,
                title: "Multi-tenant Ready",
                description: "Built for multiple users and organizations with proper isolation, scalability, and team collaboration.",
                color: "from-purple-500 to-violet-500",
                bgColor: "from-purple-50 to-violet-50",
                delay: 0.4
              },
              {
                icon: Cpu,
                title: "AI Integration",
                description: "Seamless integration with LangChain, CrewAI, Agno, and other leading AI frameworks out of the box.",
                color: "from-indigo-500 to-blue-500",
                bgColor: "from-indigo-50 to-blue-50",
                delay: 0.5
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className={`relative bg-gradient-to-br ${feature.bgColor} p-8 rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Icon with animation */}
                  <motion.div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"
            animate={{
              background: [
                "radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="h-5 w-5 text-blue-300 mr-2" />
              <span className="text-white font-semibold">Seamless Integration</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Works with Your
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {" "}Favorite Frameworks
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Drop-in replacement for existing memory solutions. No code changes required.
              Just plug in and start building smarter AI agents.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                name: "LangChain",
                description: "Use AXON as a memory provider for LangChain agents and chains",
                color: "from-orange-400 to-red-500",
                logo: "🔗"
              },
              {
                name: "CrewAI",
                description: "Integrate with CrewAI for persistent memory across agent interactions",
                color: "from-green-400 to-blue-500",
                logo: "🤖"
              },
              {
                name: "Agno",
                description: "Enhanced memory capabilities for Agno agents and workflows",
                color: "from-purple-400 to-pink-500",
                logo: "⚡"
              }
            ].map((framework) => (
              <motion.div
                key={framework.name}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500 shadow-2xl hover:shadow-3xl">
                  {/* Framework logo */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${framework.color} mb-6 text-2xl shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {framework.logo}
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4">{framework.name}</h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">{framework.description}</p>

                  {/* Animated border */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${framework.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional integrations hint */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-blue-200 mb-6">And many more frameworks...</p>
            <div className="flex justify-center space-x-8 opacity-60">
              <span className="text-white font-semibold">AutoGen</span>
              <span className="text-white font-semibold">LlamaIndex</span>
              <span className="text-white font-semibold">Haystack</span>
              <span className="text-white font-semibold">Custom APIs</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20"
              animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0.1)", "0 0 30px rgba(255,255,255,0.2)", "0 0 20px rgba(255,255,255,0.1)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-white font-semibold">Join the Revolution</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Ready to Build
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Smarter AI?
              </span>
            </h2>

            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers building the next generation of intelligent applications
              with AXON's universal memory layer.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  to="/signup"
                  className="group bg-white text-blue-600 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl inline-flex items-center"
                >
                  Start Building Free
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-7 w-7" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#features"
                  className="border-2 border-white/30 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm inline-flex items-center"
                >
                  <Globe className="h-7 w-7 mr-3" />
                  View Demo
                </a>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-blue-200">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-blue-200">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500ms</div>
                <div className="text-blue-200">Average Response</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-60">
          <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g fill="none" fillRule="evenodd">
              <g fill="#ffffff" fillOpacity="0.02">
                <circle cx="30" cy="30" r="1"/>
              </g>
            </g>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div>
                <Brain className="h-10 w-10 text-blue-400" />
              </motion.div>
              <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AXON
              </span>
            </motion.div>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              The universal memory layer for AI agents and intelligent applications.
              Built for the future of AI development.
            </p>

            <div className="flex justify-center space-x-8 mb-8">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Documentation
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                API Reference
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Community
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Support
              </motion.a>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                &copy; 2024 AXON Memory System. Built for the future of AI.
                <span className="text-blue-400 ml-2">Made with ❤️ for developers</span>
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
