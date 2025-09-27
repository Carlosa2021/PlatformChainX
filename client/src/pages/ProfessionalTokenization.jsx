import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalTokenization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    assetType: '',
    assetName: '',
    location: '',
    totalValue: '',
    tokenSupply: '',
    minimumInvestment: '',
    expectedROI: '',
    documents: [],
    description: ''
  });

  const steps = [
    {
      id: 1,
      title: 'Asset Selection',
      subtitle: 'Choose your digital asset type',
      icon: '🏢'
    },
    {
      id: 2,
      title: 'Asset Details',
      subtitle: 'Provide property information',
      icon: '📋'
    },
    {
      id: 3,
      title: 'Tokenomics',
      subtitle: 'Configure token economics',
      icon: '💰'
    },
    {
      id: 4,
      title: 'Documentation',
      subtitle: 'Upload legal documents',
      icon: '📄'
    },
    {
      id: 5,
      title: 'Review & Launch',
      subtitle: 'Finalize and deploy',
      icon: '🚀'
    }
  ];

  const assetTypes = [
    {
      type: 'equity',
      title: 'Equity Digital Asset',
      description: 'Traditional equity tokenization with voting rights',
      icon: '🏢',
      popular: true
    },
    {
      type: 'debt',
      title: 'Debt Digital Asset',
      description: 'Fixed-income instruments with regular returns',
      icon: '📊',
      popular: false
    },
    {
      type: 'real-estate',
      title: 'Real Estate Token',
      description: 'Property-backed tokens with rental income',
      icon: '🏠',
      popular: true
    },
    {
      type: 'revenue',
      title: 'Revenue Digitalization',
      description: 'Revenue streams tokenization',
      icon: '💎',
      popular: false
    }
  ];

  const StepIndicator = ({ step, isActive, isCompleted }) => (
    <div className="flex items-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
          isCompleted ? 'bg-green-500 text-white' :
          isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' :
          'bg-gray-700 text-gray-400'
        }`}
      >
        {isCompleted ? '✓' : step.id}
      </motion.div>
      <div className="ml-4 hidden md:block">
        <h3 className={`font-semibold transition-colors ${
          isActive ? 'text-white' : 'text-gray-400'
        }`}>
          {step.title}
        </h3>
        <p className="text-sm text-gray-500">{step.subtitle}</p>
      </div>
    </div>
  );

  const AssetTypeCard = ({ asset, isSelected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500' 
          : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600'
      }`}
    >
      {asset.popular && (
        <div className="absolute -top-3 right-4">
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </span>
        </div>
      )}
      
      <div className="text-center">
        <div className="text-4xl mb-4">{asset.icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{asset.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{asset.description}</p>
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}
    </motion.div>
  );

  const InputField = ({ label, type = "text", placeholder, value, onChange, required = false }) => (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
      />
    </div>
  );

  const SelectField = ({ label, options, value, onChange, required = false }) => (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Asset Type</h2>
              <p className="text-gray-400 text-lg">Select the type of digital asset you want to create</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assetTypes.map((asset) => (
                <AssetTypeCard
                  key={asset.type}
                  asset={asset}
                  isSelected={formData.assetType === asset.type}
                  onClick={() => setFormData({...formData, assetType: asset.type})}
                />
              ))}
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Asset Details</h2>
              <p className="text-gray-400 text-lg">Provide comprehensive information about your asset</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Asset Name"
                  placeholder="e.g., Swiss Prime Real Estate"
                  value={formData.assetName}
                  onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                  required
                />
                
                <InputField
                  label="Location"
                  placeholder="e.g., Zurich, Switzerland"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
                
                <InputField
                  label="Total Asset Value (EUR)"
                  type="number"
                  placeholder="1000000"
                  value={formData.totalValue}
                  onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                  required
                />
                
                <InputField
                  label="Expected Annual ROI (%)"
                  type="number"
                  placeholder="12.5"
                  value={formData.expectedROI}
                  onChange={(e) => setFormData({...formData, expectedROI: e.target.value})}
                  required
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-white font-semibold mb-2">
                  Asset Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide a detailed description of your asset, including key features, location benefits, and investment highlights..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Token Economics</h2>
              <p className="text-gray-400 text-lg">Configure your token structure and pricing</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Total Token Supply"
                  type="number"
                  placeholder="10000"
                  value={formData.tokenSupply}
                  onChange={(e) => setFormData({...formData, tokenSupply: e.target.value})}
                  required
                />
                
                <InputField
                  label="Minimum Investment (EUR)"
                  type="number"
                  placeholder="100"
                  value={formData.minimumInvestment}
                  onChange={(e) => setFormData({...formData, minimumInvestment: e.target.value})}
                  required
                />
              </div>
              
              <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">💡 Token Economics Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Price per Token</p>
                    <p className="text-2xl font-bold text-white">
                      €{formData.totalValue && formData.tokenSupply ? 
                        (parseFloat(formData.totalValue) / parseFloat(formData.tokenSupply)).toFixed(2) : 
                        '0.00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Total Supply</p>
                    <p className="text-2xl font-bold text-white">{formData.tokenSupply || '0'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Min. Investment</p>
                    <p className="text-2xl font-bold text-white">€{formData.minimumInvestment || '0'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Legal Documentation</h2>
              <p className="text-gray-400 text-lg">Upload required legal and compliance documents</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="space-y-6">
                {[
                  { name: 'Property Title Deed', required: true, uploaded: true },
                  { name: 'Valuation Report', required: true, uploaded: false },
                  { name: 'Legal Due Diligence', required: true, uploaded: true },
                  { name: 'Insurance Documentation', required: false, uploaded: false },
                  { name: 'Environmental Compliance', required: false, uploaded: false }
                ].map((doc, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
                      doc.uploaded ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          doc.uploaded ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {doc.uploaded ? '✓' : '📄'}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{doc.name}</h4>
                          <p className="text-sm text-gray-400">
                            {doc.required ? 'Required' : 'Optional'} • {doc.uploaded ? 'Uploaded' : 'Not uploaded'}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          doc.uploaded 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      >
                        {doc.uploaded ? 'Replace' : 'Upload'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Review & Launch</h2>
              <p className="text-gray-400 text-lg">Review your tokenization setup and launch your project</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">🏢 Asset Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset Type:</span>
                      <span className="text-white font-semibold">
                        {assetTypes.find(a => a.type === formData.assetType)?.title || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-semibold">{formData.assetName || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white font-semibold">{formData.location || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value:</span>
                      <span className="text-white font-semibold">€{formData.totalValue?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected ROI:</span>
                      <span className="text-green-400 font-semibold">{formData.expectedROI || '0'}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">💰 Token Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Supply:</span>
                      <span className="text-white font-semibold">{formData.tokenSupply?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price per Token:</span>
                      <span className="text-white font-semibold">
                        €{formData.totalValue && formData.tokenSupply ? 
                          (parseFloat(formData.totalValue) / parseFloat(formData.tokenSupply)).toFixed(2) : 
                          '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min. Investment:</span>
                      <span className="text-white font-semibold">€{formData.minimumInvestment || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-purple-400 font-semibold">Polygon</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Standard:</span>
                      <span className="text-blue-400 font-semibold">ERC-20</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-2">🚀 Ready to Launch</h3>
                <p className="text-gray-300 mb-4">
                  Your tokenization project is configured and ready for deployment. 
                  Once launched, investors can start purchasing tokens immediately.
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">Estimated deployment time:</span>
                  <span className="text-green-400 font-semibold">~5 minutes</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Digital Asset <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Tokenization</span>
          </h1>
          <p className="text-xl text-gray-400">
            Transform your real-world assets into digital tokens in minutes
          </p>
        </motion.div>

        {/* Steps Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepIndicator 
                  step={step} 
                  isActive={currentStep === step.id}
                  isCompleted={currentStep > step.id}
                />
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[600px] mb-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentStep === 1 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            ← Previous
          </motion.button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentStep === steps.length) {
                alert('🚀 Launching tokenization project!');
              } else {
                setCurrentStep(Math.min(steps.length, currentStep + 1));
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {currentStep === steps.length ? '🚀 Launch Project' : 'Continue →'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTokenization;