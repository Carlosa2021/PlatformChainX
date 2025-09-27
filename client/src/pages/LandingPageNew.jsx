import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChainXAI } from '../ai/ChainXAISimple';

const LandingPage = () => {
  const [demoRunning, setDemoRunning] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { value: '€2,401', label: 'Saved per client vs Brickken', color: 'text-green-400' },
    { value: '5 min', label: 'Average tokenization time', color: 'text-blue-400' },
    { value: '96%', label: 'Cost reduction vs competitors', color: 'text-purple-400' },
    { value: '2,500+', label: 'Supported blockchains', color: 'text-orange-400' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDemo = async () => {
    setDemoRunning(true);
    try {
      const chainXAI = new ChainXAI();
      await chainXAI.simulateTokenization();
    } catch (error) {
      console.log('Demo mode:', error);
    } finally {
      setTimeout(() => setDemoRunning(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-white font-bold text-xl">ChainX</span>
          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full font-semibold">🇨🇭 SWISS</span>
        </motion.div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 text-white hover:text-purple-400 transition-colors duration-300"
          >
            Features
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 text-white hover:text-blue-400 transition-colors duration-300"
          >
            Pricing
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Free Trial
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Tokenize Assets in
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                5 Minutes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              The Swiss AI-Powered Platform Disrupting Brickken
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
              🚀 <strong>60x faster</strong> • 💰 <strong>96% cheaper</strong> • 🇨🇭 <strong>Swiss regulated</strong> • 🤖 <strong>AI-powered</strong>
            </p>
          </motion.div>

          {/* Comparison Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-red-900/20 via-orange-900/20 to-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 mb-12 max-w-4xl mx-auto backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-red-400 font-bold text-lg mb-2">❌ Brickken (Old Way)</h3>
                <p className="text-gray-300">€2,500/month • 6+ hours • Manual process</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-4xl">⚡</div>
              </div>
              <div>
                <h3 className="text-green-400 font-bold text-lg mb-2">✅ ChainX (New Way)</h3>
                <p className="text-gray-300">€99/month • 5 minutes • AI-automated</p>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className={`text-5xl font-bold ${stats[currentStat].color} mb-2`}>
                  {stats[currentStat].value}
                </div>
                <div className="text-gray-400 text-lg">
                  {stats[currentStat].label}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
          >
            <motion.button
              onClick={handleDemo}
              disabled={demoRunning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px]"
            >
              {demoRunning ? '🚀 Tokenizing Real Estate...' : '🚀 Start 5-Minute Demo - Free'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              📊 Compare vs Brickken
            </motion.button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center text-gray-400"
          >
            <p className="mb-4 text-sm">🏆 Powered by Enterprise Infrastructure:</p>
            <div className="flex items-center justify-center space-x-6 opacity-75 text-sm">
              <span className="text-purple-400 font-semibold">Thirdweb Pro</span>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400 font-semibold">2,500+ Chains</span>
              <span className="text-gray-600">•</span>
              <span className="text-green-400 font-semibold">Swiss Hosted</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              🇨🇭 <strong>Swiss Regulated</strong> • 🔒 <strong>Enterprise Security</strong> • ⚡ <strong>GDPR Compliant</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Why <span className="text-gradient">Swiss Precision</span> Beats Spanish Bureaucracy
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built with Swiss engineering standards to deliver what Brickken promises but can't deliver
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: '60x Faster',
              description: '5 minutes vs 6 hours',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              icon: '💰',
              title: '96% Cheaper',
              description: '€99/month vs €2,500/month',
              color: 'from-green-500 to-blue-500'
            },
            {
              icon: '🧠',
              title: 'AI-Powered',
              description: 'Automated compliance & smart contracts',
              color: 'from-purple-500 to-pink-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glassmorphism p-8 rounded-2xl text-center group cursor-pointer"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className="text-gray-400 text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Beta CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-500/30 rounded-3xl p-12 text-center backdrop-blur-sm"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            🚀 Join the Swiss Revolution
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Be among the first to experience <strong>5-minute tokenization</strong> at <strong>Swiss precision</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              🇨🇭 Get Swiss Beta Access
            </motion.button>
            <p className="text-sm text-gray-400">
              ✅ <strong>Free beta</strong> • 🎯 <strong>Limited spots</strong> • ⚡ <strong>No commitment</strong>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;