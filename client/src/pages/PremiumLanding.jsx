import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Componentes modernos simples sin dependencias externas
const ModernCard = ({ children, className = '', glow = false }) => (
  <div className={`
    bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl
    shadow-2xl transition-all duration-500 hover:scale-[1.02]
    ${glow ? 'shadow-blue-500/20 hover:shadow-blue-500/40' : ''}
    ${className}
  `}>
    {children}
  </div>
);

const PremiumButton = ({ children, onClick, loading, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500',
    warning: 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500'
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        px-8 py-4 rounded-xl font-semibold text-white
        shadow-lg transition-all duration-300 transform
        hover:scale-105 active:scale-95 disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Cargando...
        </div>
      ) : children}
    </button>
  );
};

const PremiumLanding = () => {
  const [demoRunning, setDemoRunning] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);

  const runDemo = async () => {
    setDemoRunning(true);
    setActiveDemo('analyzing');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setActiveDemo('tokenizing');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setActiveDemo('completed');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDemoRunning(false);
    setActiveDemo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Swiss Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-lg font-medium">
                🇨🇭 Swiss Premium • AI-Powered • Brickken Killer
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
            >
              Tokeniza Cualquier Activo en{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                5 Minutos
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed"
            >
              La plataforma de tokenización con IA que hace que{' '}
              <span className="text-red-400 font-bold">Brickken parezca prehistórico</span>.
              <br />
              <span className="text-white font-semibold">Nuestra plataforma se paga sola</span>{' '}
              con yield farming automático.
            </motion.p>

            {/* Value Props Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
              {[
                { icon: '⚡', title: 'Velocidad', value: '60x Más Rápido', desc: '5 min vs 5 días (Brickken)' },
                { icon: '💰', title: 'Ahorro', value: '96% Más Barato', desc: '€99 vs €2.500 (Brickken)' },
                { icon: '🤖', title: 'Tecnología', value: 'AI Powered', desc: '100% Automatizado' },
                { icon: '🇨🇭', title: 'Calidad', value: 'Swiss Premium', desc: 'Regulación Superior' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                >
                  <ModernCard glow className="h-full">
                    <div className="p-8 text-center">
                      <motion.div
                        className="text-5xl mb-4"
                        animate={{ 
                          rotate: index === 0 ? [0, 10, -10, 0] : 0,
                          scale: index === 1 ? [1, 1.2, 1] : 1,
                          rotateY: index === 2 ? [0, 180, 0] : 0,
                          y: index === 3 ? [0, -10, 0] : 0
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className="text-sm text-gray-400 mb-2">{item.title}</h3>
                      <div className="text-3xl font-bold text-blue-400 mb-2">{item.value}</div>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <PremiumButton
                variant="success"
                onClick={runDemo}
                loading={demoRunning}
                className="text-xl px-12 py-6 shadow-2xl"
              >
                {demoRunning ? 'Tokenizando...' : 'Demo en 5 Minutos 🚀'}
              </PremiumButton>

              <PremiumButton
                variant="primary"
                className="text-lg px-8 py-4"
              >
                Ver Comparación vs Brickken
              </PremiumButton>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center text-gray-400"
            >
              <p className="mb-4">Powered by Enterprise Infrastructure:</p>
              <div className="flex items-center justify-center space-x-8 opacity-75 flex-wrap gap-y-2">
                <span className="text-purple-400 font-semibold">Thirdweb Pro</span>
                <span className="text-gray-500">•</span>
                <span className="text-blue-400 font-semibold">2,500+ Chains</span>
                <span className="text-gray-500">•</span>
                <span className="text-green-400 font-semibold">Swiss Hosted</span>
                <span className="text-gray-500">•</span>
                <span className="text-orange-400 font-semibold">Enterprise Grade</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                🇨🇭 Hosted in Switzerland • Enterprise Security • GDPR Compliant
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Demo Modal */}
      {demoRunning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <ModernCard className="max-w-2xl w-full">
            <div className="p-12 text-center">
              <div className="mb-8">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto" />
              </div>
              
              <motion.h3
                key={activeDemo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white mb-4"
              >
                {activeDemo === 'analyzing' && '🧠 Analizando Activo con IA...'}
                {activeDemo === 'tokenizing' && '⚡ Creando Smart Contract...'}
                {activeDemo === 'completed' && '✅ ¡Tokenización Completada!'}
              </motion.h3>

              <motion.p
                key={`${activeDemo}-desc`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 mb-8"
              >
                {activeDemo === 'analyzing' && 'Evaluando valor, riesgo y potencial de mercado...'}
                {activeDemo === 'tokenizing' && 'Generando tokenomics optimizados automáticamente...'}
                {activeDemo === 'completed' && 'Tu activo está ahora tokenizado y listo para inversores'}
              </motion.p>

              {activeDemo === 'completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">
                      Token: ASSET-001
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-sm">
                      Supply: 1,000,000
                    </span>
                    <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-sm">
                      Yield: 12.5% APY
                    </span>
                    <span className="bg-gray-700/50 text-gray-300 border border-gray-600/50 px-3 py-1 rounded-full text-sm">
                      Chains: 5
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Tiempo total: 4m 32s • 60x más rápido que Brickken
                  </p>
                </motion.div>
              )}
            </div>
          </ModernCard>
        </motion.div>
      )}

      {/* Comparison Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <ModernCard className="p-12">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              ChainX vs Brickken:{' '}
              <span className="text-red-400">La Diferencia es Brutal</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">Velocidad</h3>
                <div className="space-y-2">
                  <div className="text-green-400 font-bold">ChainX: 5 minutos</div>
                  <div className="text-red-400">Brickken: 5-10 días</div>
                  <span className="inline-block bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">
                    60x más rápido
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-white mb-2">Precio</h3>
                <div className="space-y-2">
                  <div className="text-green-400 font-bold">ChainX: €99/mes</div>
                  <div className="text-red-400">Brickken: €2,500/mes</div>
                  <span className="inline-block bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">
                    96% más barato
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-white mb-2">Tecnología</h3>
                <div className="space-y-2">
                  <div className="text-green-400 font-bold">ChainX: AI-Powered</div>
                  <div className="text-red-400">Brickken: Manual</div>
                  <span className="inline-block bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">
                    100% Automatizado
                  </span>
                </div>
              </div>
            </div>
          </ModernCard>
        </motion.div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para Revolucionar la Tokenización?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Únete a la revolución Swiss que está matando a Brickken
            </p>
            <PremiumButton
              variant="warning"
              className="text-xl px-12 py-6"
            >
              Comenzar Beta Gratis 🇨🇭
            </PremiumButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLanding;