import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChainXAI } from '../ai/ChainXAI';

const LandingPage = () => {
  const [demoRunning, setDemoRunning] = useState(false);
  const [competitorComparison, setCompetitorComparison] = useState(null);

  useEffect(() => {
    // Load competitor comparison data
    loadCompetitorData();
  }, []);

  const loadCompetitorData = async () => {
    const ai = new ChainXAI();
    const comparison = await ai.compareToBrickken({ 
      type: 'real-estate',
      value: 1000000,
      name: 'Sample Property'
    });
    setCompetitorComparison(comparison);
  };

  const runDemo = async () => {
    setDemoRunning(true);
    // Simulate 5-minute tokenization process
    await new Promise(resolve => setTimeout(resolve, 5000));
    setDemoRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Brickken Killer Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold mb-8">
              🔥 The Brickken Killer • 60x Faster • 6x Cheaper
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Tokenize Any Asset in{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                5 Minutes
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              The AI-powered tokenization platform that makes Brickken look ancient. 
              <br />
              <strong className="text-white">Our platform pays for itself</strong> through auto-yield farming.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-white font-semibold mb-2">60x Faster</h3>
                <p className="text-gray-300 text-sm">5 minutes vs 5 days (Brickken)</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-white font-semibold mb-2">6x Cheaper</h3>
                <p className="text-gray-300 text-sm">0.3% vs 2-5% fees</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-white font-semibold mb-2">AI Powered</h3>
                <p className="text-gray-300 text-sm">Fully automated process</p>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                onClick={runDemo}
                disabled={demoRunning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {demoRunning ? '🚀 Tokenizing...' : '🚀 Start Free Trial - No Code Required'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300"
              >
                📊 See Brickken Comparison
              </motion.button>
            </div>

            {/* Social Proof */}
            <div className="text-center text-gray-400">
              <p className="mb-4">Powered by Enterprise Infrastructure:</p>
              <div className="flex items-center justify-center space-x-8 opacity-75">
                <span className="text-purple-400 font-semibold">Thirdweb Pro</span>
                <span className="text-gray-500">•</span>
                <span className="text-blue-400 font-semibold">2,500+ Chains</span>
                <span className="text-gray-500">•</span>
                <span className="text-green-400 font-semibold">Enterprise Grade</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Competitor Comparison Section */}
      {competitorComparison && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              ChainX vs Brickken: The Numbers Don't Lie
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {competitorComparison.speed.advantage}
                </div>
                <div className="text-white font-semibold mb-2">Speed Advantage</div>
                <div className="text-gray-300 text-sm">
                  {competitorComparison.speed.chainx} vs {competitorComparison.speed.brickken}
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  $50,000+
                </div>
                <div className="text-white font-semibold mb-2">Annual Savings</div>
                <div className="text-gray-300 text-sm">
                  vs Brickken fees and setup costs
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  3-6 months
                </div>
                <div className="text-white font-semibold mb-2">Payback Time</div>
                <div className="text-gray-300 text-sm">
                  Platform pays for itself through auto-yield
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Features Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          What Makes ChainX Revolutionary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🤖",
              title: "AI Contract Generation",
              description: "Smart contracts created and audited by AI in 2 minutes"
            },
            {
              icon: "💸",
              title: "Auto-Yield Farming",
              description: "Platform invests your fees and pays your subscription back"
            },
            {
              icon: "🌐",
              title: "2,500+ Blockchains",
              description: "Deploy on any chain vs Brickken's limited options"
            },
            {
              icon: "⚡",
              title: "Instant Compliance",
              description: "AI handles MiCA/KYC/AML automatically"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Beta CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make Brickken Obsolete?
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Join our exclusive beta. First 50 companies get 3 months FREE + migration support.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-white text-purple-600 font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🚀 Claim Your Spot • Limited to 50 Companies
          </motion.button>
          <p className="text-white/70 text-sm mt-4">
            ✅ No setup fees • ✅ Free migration • ✅ Revenue sharing 90/10 in your favor
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;