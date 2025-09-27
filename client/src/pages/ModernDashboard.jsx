// Dashboard moderno y profesional
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ModernCard, 
  PremiumButton, 
  AnimatedMetric, 
  ModernBadge,
  PremiumSpinner 
} from '../ui/ModernComponents';

const ModernDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Datos simulados para demo
  const metrics = {
    totalInvested: { value: '€125,850', change: 12.5 },
    activeProperties: { value: '8', change: 3.2 },
    monthlyReturn: { value: '€2,847', change: 8.1 },
    portfolioValue: { value: '€134,720', change: 15.3 }
  };

  const properties = [
    {
      id: 1,
      name: 'Reyes Católicos 97',
      location: 'Alzira, Valencia',
      type: 'Residencial',
      status: 'Financiado',
      progress: 85,
      investment: '€15,500',
      expectedReturn: '8.5%',
      image: '/images/property1.jpg'
    },
    {
      id: 2,
      name: 'Centro Comercial Marina',
      location: 'Valencia',
      type: 'Comercial',
      status: 'Activo',
      progress: 100,
      investment: '€25,000',
      expectedReturn: '12.2%',
      image: '/images/property2.jpg'
    },
    {
      id: 3,
      name: 'Edificio Oficinas Tech',
      location: 'Barcelona',
      type: 'Oficinas',
      status: 'Nuevo',
      progress: 15,
      investment: '€8,750',
      expectedReturn: '15.8%',
      image: '/images/property3.jpg'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <PremiumSpinner size="xl" color="blue" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg"
          >
            Cargando tu portfolio suizo...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header Premium */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-white font-bold">CX</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">ChainX Platform</h1>
                <p className="text-gray-400 text-sm">Tokenización Premium Suiza</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ModernBadge variant="success" glow>
                🇨🇭 Swiss Quality
              </ModernBadge>
              <PremiumButton variant="primary" size="sm">
                Invertir Ahora
              </PremiumButton>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navegación de Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-1 mb-8 bg-gray-800/30 p-1 rounded-2xl backdrop-blur-sm"
        >
          {[
            { id: 'overview', label: 'Resumen', icon: '📊' },
            { id: 'properties', label: 'Propiedades', icon: '🏢' },
            { id: 'investments', label: 'Inversiones', icon: '💰' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-3 rounded-xl font-medium transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-white/10 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ModernCard glowColor="blue">
                  <div className="p-6">
                    <AnimatedMetric
                      label="Total Invertido"
                      value={metrics.totalInvested.value}
                      change={metrics.totalInvested.change}
                      icon="💰"
                      color="blue"
                    />
                  </div>
                </ModernCard>

                <ModernCard glowColor="green">
                  <div className="p-6">
                    <AnimatedMetric
                      label="Propiedades Activas"
                      value={metrics.activeProperties.value}
                      change={metrics.activeProperties.change}
                      icon="🏢"
                      color="green"
                    />
                  </div>
                </ModernCard>

                <ModernCard glowColor="orange">
                  <div className="p-6">
                    <AnimatedMetric
                      label="Retorno Mensual"
                      value={metrics.monthlyReturn.value}
                      change={metrics.monthlyReturn.change}
                      icon="📈"
                      color="orange"
                    />
                  </div>
                </ModernCard>

                <ModernCard glowColor="purple">
                  <div className="p-6">
                    <AnimatedMetric
                      label="Valor Portfolio"
                      value={metrics.portfolioValue.value}
                      change={metrics.portfolioValue.change}
                      icon="💎"
                      color="purple"
                    />
                  </div>
                </ModernCard>
              </div>

              {/* Gráfico y Actividad Reciente */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ModernCard className="lg:col-span-2">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Rendimiento del Portfolio</h3>
                    <div className="h-64 bg-gradient-to-t from-blue-500/10 to-transparent rounded-xl flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center space-y-2"
                      >
                        <div className="text-4xl">📈</div>
                        <p className="text-gray-400">Gráfico interactivo próximamente</p>
                        <ModernBadge variant="info">Chart.js Integration</ModernBadge>
                      </motion.div>
                    </div>
                  </div>
                </ModernCard>

                <ModernCard>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Actividad Reciente</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'Inversión recibida', amount: '€2,500', time: '2h ago', type: 'success' },
                        { action: 'Dividendo pagado', amount: '€847', time: '1d ago', type: 'info' },
                        { action: 'Nueva propiedad', amount: 'Alzira 97', time: '3d ago', type: 'warning' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl"
                        >
                          <div>
                            <p className="text-white text-sm">{item.action}</p>
                            <p className="text-gray-400 text-xs">{item.time}</p>
                          </div>
                          <ModernBadge variant={item.type} size="sm">
                            {item.amount}
                          </ModernBadge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ModernCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'properties' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ModernCard hover className="group">
                      <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <div className="absolute top-4 right-4 z-20">
                          <ModernBadge 
                            variant={property.status === 'Financiado' ? 'success' : property.status === 'Activo' ? 'info' : 'warning'}
                          >
                            {property.status}
                          </ModernBadge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                          🏢
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {property.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{property.location}</p>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Inversión</span>
                          <span className="text-white font-semibold">{property.investment}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Retorno Esperado</span>
                          <span className="text-green-400 font-semibold">{property.expectedReturn}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progreso</span>
                            <span className="text-white">{property.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${property.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </div>

                        <PremiumButton variant="primary" className="w-full">
                          Ver Detalles
                        </PremiumButton>
                      </div>
                    </ModernCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernDashboard;