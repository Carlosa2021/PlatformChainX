import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalDashboard = () => {
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeProjects: 0,
    totalInvestors: 0,
    digitalAssets: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'investment', amount: '€50,000', project: 'Swiss Real Estate Token', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'tokenization', amount: '€500,000', project: 'Munich Commercial Property', time: '5 hours ago', status: 'processing' },
    { id: 3, type: 'dividend', amount: '€12,500', project: 'Berlin Residential Complex', time: '1 day ago', status: 'completed' },
    { id: 4, type: 'investment', amount: '€75,000', project: 'Zurich Office Building', time: '2 days ago', status: 'completed' }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Swiss Prime Real Estate',
      location: 'Zurich, Switzerland',
      totalValue: 1200000,
      tokensSold: 650,
      totalTokens: 1000,
      roi: 12.5,
      status: 'Active',
      raised: 780000,
      investors: 42,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Munich Tech Hub',
      location: 'Munich, Germany',
      totalValue: 850000,
      tokensSold: 320,
      totalTokens: 850,
      roi: 8.7,
      status: 'Funding',
      raised: 320000,
      investors: 28,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Berlin Luxury Residences',
      location: 'Berlin, Germany',
      totalValue: 2500000,
      tokensSold: 1200,
      totalTokens: 2500,
      roi: 15.2,
      status: 'Completed',
      raised: 1200000,
      investors: 89,
      image: '/api/placeholder/300/200'
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        totalRaised: prev.totalRaised + Math.floor(Math.random() * 1000),
        activeProjects: projects.filter(p => p.status === 'Active').length,
        totalInvestors: projects.reduce((sum, p) => sum + p.investors, 0),
        digitalAssets: projects.length
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [projects]);

  const StatCard = ({ title, value, change, icon, color = "blue" }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color === 'blue' ? 'from-blue-500 to-purple-600' : 
                         color === 'green' ? 'from-green-500 to-emerald-600' :
                         color === 'orange' ? 'from-orange-500 to-yellow-600' :
                         'from-purple-500 to-pink-600'} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );

  const ProjectCard = ({ project }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -10 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-6xl opacity-20">🏢</div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            project.status === 'Active' ? 'bg-green-500/20 text-green-400' :
            project.status === 'Funding' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            {project.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex items-center">
          <span className="mr-2">📍</span>
          {project.location}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs">Total Value</p>
            <p className="text-white font-semibold">€{project.totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">ROI</p>
            <p className="text-green-400 font-semibold">{project.roi}%</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Tokens Sold</span>
            <span className="text-white">{project.tokensSold}/{project.totalTokens}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(project.tokensSold / project.totalTokens) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Raised</p>
            <p className="text-white font-semibold">€{project.raised.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Investors</p>
            <p className="text-white font-semibold">{project.investors}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-white">
            Investment Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg"
            >
              + New Project
            </motion.button>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
          </div>
        </div>
        <p className="text-gray-400">
          Welcome back! Here's your tokenization portfolio overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          title="Total Amount Raised"
          value={`€${(2300000 + stats.totalRaised).toLocaleString()}`}
          change={8.2}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Active Digital Assets"
          value={stats.digitalAssets || projects.length}
          change={12.5}
          icon="🏢"
          color="blue"
        />
        <StatCard
          title="Total Investors"
          value={stats.totalInvestors || 159}
          change={5.7}
          icon="👥"
          color="orange"
        />
        <StatCard
          title="Average ROI"
          value="12.1%"
          change={2.3}
          icon="📈"
          color="purple"
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Projects Grid */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Active Projects</h2>
            <p className="text-gray-400">Your tokenized real estate portfolio</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Recent Activity</h2>
            <p className="text-gray-400 mb-6">Latest transactions and updates</p>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'investment' ? 'bg-green-500/20 text-green-400' :
                      activity.type === 'tokenization' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {activity.type === 'investment' ? '💰' :
                       activity.type === 'tokenization' ? '🏗️' : '💎'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.amount}</p>
                      <p className="text-gray-400 text-sm">{activity.project}</p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {activity.status}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full mt-4 py-3 text-blue-400 font-medium hover:bg-gray-800/50 rounded-lg transition-all duration-300"
              >
                View All Activity →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Tokenize New Asset', icon: '🏗️', desc: 'Start tokenizing a new real estate property', color: 'from-blue-600 to-purple-600' },
            { title: 'Manage Investors', icon: '👥', desc: 'Review and manage your investor base', color: 'from-green-600 to-emerald-600' },
            { title: 'Analytics & Reports', icon: '📊', desc: 'View detailed performance analytics', color: 'from-orange-600 to-yellow-600' }
          ].map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl cursor-pointer shadow-2xl`}
            >
              <div className="text-4xl mb-4">{action.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
              <p className="text-white/80 text-sm">{action.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalDashboard;