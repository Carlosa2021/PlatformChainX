import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InvestorManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('amount');
  const [filterStatus, setFilterStatus] = useState('all');

  const investors = [
    {
      id: 1,
      name: 'Hans Mueller',
      email: 'hans.mueller@swiss-capital.ch',
      country: 'Switzerland',
      totalInvestment: 125000,
      activeInvestments: 3,
      roi: 14.2,
      joinDate: '2024-01-15',
      status: 'active',
      kycStatus: 'verified',
      riskProfile: 'moderate',
      avatar: 'HM'
    },
    {
      id: 2,
      name: 'Maria Gonzalez',
      email: 'maria.g@inversiones-madrid.es',
      country: 'Spain',
      totalInvestment: 89000,
      activeInvestments: 2,
      roi: 11.8,
      joinDate: '2024-02-08',
      status: 'active',
      kycStatus: 'verified',
      riskProfile: 'aggressive',
      avatar: 'MG'
    },
    {
      id: 3,
      name: 'Jean Dubois',
      email: 'j.dubois@patrimoine-france.fr',
      country: 'France',
      totalInvestment: 156000,
      activeInvestments: 4,
      roi: 16.5,
      joinDate: '2023-11-22',
      status: 'active',
      kycStatus: 'verified',
      riskProfile: 'conservative',
      avatar: 'JD'
    },
    {
      id: 4,
      name: 'Klaus Weber',
      email: 'k.weber@deutschland-invest.de',
      country: 'Germany',
      totalInvestment: 203000,
      activeInvestments: 5,
      roi: 18.3,
      joinDate: '2023-09-14',
      status: 'active',
      kycStatus: 'verified',
      riskProfile: 'moderate',
      avatar: 'KW'
    },
    {
      id: 5,
      name: 'Emma Thompson',
      email: 'emma.t@uk-property-fund.co.uk',
      country: 'United Kingdom',
      totalInvestment: 94000,
      activeInvestments: 2,
      roi: 9.7,
      joinDate: '2024-03-01',
      status: 'pending',
      kycStatus: 'pending',
      riskProfile: 'moderate',
      avatar: 'ET'
    }
  ];

  const stats = {
    totalInvestors: investors.length,
    totalInvested: investors.reduce((sum, inv) => sum + inv.totalInvestment, 0),
    averageInvestment: investors.reduce((sum, inv) => sum + inv.totalInvestment, 0) / investors.length,
    activeInvestors: investors.filter(inv => inv.status === 'active').length,
    averageROI: investors.reduce((sum, inv) => sum + inv.roi, 0) / investors.length
  };

  const filteredInvestors = investors
    .filter(investor => {
      const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investor.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || investor.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'amount':
          return b.totalInvestment - a.totalInvestment;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.joinDate) - new Date(a.joinDate);
        case 'roi':
          return b.roi - a.roi;
        default:
          return 0;
      }
    });

  const StatCard = ({ title, value, change, icon, format = 'number' }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
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
      <p className="text-3xl font-bold text-white">
        {format === 'currency' ? `€${value.toLocaleString()}` : 
         format === 'percentage' ? `${value.toFixed(1)}%` :
         value.toLocaleString()}
      </p>
    </motion.div>
  );

  const InvestorRow = ({ investor, isSelected, onSelect }) => (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
      className="border-b border-gray-700 transition-colors duration-200"
    >
      <td className="px-6 py-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(investor.id)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {investor.avatar}
          </div>
          <div>
            <div className="text-white font-semibold">{investor.name}</div>
            <div className="text-gray-400 text-sm">{investor.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getCountryFlag(investor.country)}</span>
          <span className="text-white">{investor.country}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-white font-semibold">€{investor.totalInvestment.toLocaleString()}</div>
        <div className="text-gray-400 text-sm">{investor.activeInvestments} projects</div>
      </td>
      <td className="px-6 py-4">
        <div className={`text-lg font-semibold ${
          investor.roi >= 15 ? 'text-green-400' :
          investor.roi >= 10 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {investor.roi.toFixed(1)}%
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          investor.status === 'active' ? 'bg-green-500/20 text-green-400' :
          investor.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          investor.kycStatus === 'verified' ? 'bg-green-500/20 text-green-400' :
          investor.kycStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {investor.kycStatus}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            👁️
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            ✉️
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
          >
            ⚙️
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );

  const getCountryFlag = (country) => {
    const flags = {
      'Switzerland': '🇨🇭',
      'Spain': '🇪🇸',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'United Kingdom': '🇬🇧'
    };
    return flags[country] || '🏳️';
  };

  const toggleInvestorSelection = (investorId) => {
    setSelectedInvestors(prev => 
      prev.includes(investorId) 
        ? prev.filter(id => id !== investorId)
        : [...prev, investorId]
    );
  };

  const selectAllInvestors = () => {
    if (selectedInvestors.length === filteredInvestors.length) {
      setSelectedInvestors([]);
    } else {
      setSelectedInvestors(filteredInvestors.map(inv => inv.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-white">Investor Management</h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg"
              >
                + Add Investor
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
              >
                📊 Export Report
              </motion.button>
            </div>
          </div>
          <p className="text-gray-400">Manage your investor relationships and track performance</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8"
        >
          <StatCard
            title="Total Investors"
            value={stats.totalInvestors}
            change={12.5}
            icon="👥"
          />
          <StatCard
            title="Total Invested"
            value={stats.totalInvested}
            change={8.7}
            icon="💰"
            format="currency"
          />
          <StatCard
            title="Average Investment"
            value={stats.averageInvestment}
            change={5.2}
            icon="📊"
            format="currency"
          />
          <StatCard
            title="Active Investors"
            value={stats.activeInvestors}
            change={15.3}
            icon="✅"
          />
          <StatCard
            title="Average ROI"
            value={stats.averageROI}
            change={3.1}
            icon="📈"
            format="percentage"
          />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search investors by name, email, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500"
              >
                <option value="amount">Sort by Investment</option>
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Join Date</option>
                <option value="roi">Sort by ROI</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {selectedInvestors.length > 0 && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold">
                  {selectedInvestors.length} investor(s) selected
                </span>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                  >
                    Send Email
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
                  >
                    Update Status
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                  >
                    Remove
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Investors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInvestors.length === filteredInvestors.length && filteredInvestors.length > 0}
                      onChange={selectAllInvestors}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Investor</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Country</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Investment</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">ROI</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">KYC</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.map((investor, index) => (
                  <InvestorRow
                    key={investor.id}
                    investor={investor}
                    isSelected={selectedInvestors.includes(investor.id)}
                    onSelect={toggleInvestorSelection}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvestors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No investors found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredInvestors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mt-8"
          >
            <p className="text-gray-400">
              Showing {filteredInvestors.length} of {investors.length} investors
            </p>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Previous
              </motion.button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InvestorManagement;