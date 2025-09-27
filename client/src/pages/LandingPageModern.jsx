import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChainXAI } from '../ai/ChainXAI';
import { 
  ModernCard, 
  PremiumButton, 
  AnimatedMetric, 
  ModernBadge,
  PremiumSpinner 
} from '../ui/ModernComponents';

const LandingPage = () => {
  const [demoRunning, setDemoRunning] = useState(false);
  const [competitorComparison, setCompetitorComparison] = useState(null);
  const [activeDemo, setActiveDemo] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadCompetitorData();
    
    // Track mouse for premium effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loadCompetitorData = async () => {
    try {
      const ai = new ChainXAI();
      const comparison = await ai.compareToBrickken({ 
        type: 'real-estate',
        value: 1000000,
        name: 'Sample Property'
      });
      setCompetitorComparison(comparison);
    } catch (error) {
      console.warn('Using mock comparison data');
      setCompetitorComparison({
        speed: '60x más rápido',
        cost: '96% más barato',
        features: 'AI-powered vs Manual'
      });
    }
  };

  const runDemo = async () => {
    setDemoRunning(true);
    setActiveDemo('analyzing');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setActiveDemo('tokenizing');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setActiveDemo('deploying');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setActiveDemo('completed');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDemoRunning(false);
    setActiveDemo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Dynamic background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
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

      {/* Mouse follow gradient */}
      <motion.div
        className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      />

      {/* Hero Section Premium */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Premium Swiss Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-8"
            >
              <ModernBadge variant="success" size="lg">
                🇨🇭 Swiss Premium • AI-Powered • Brickken Killer
              </ModernBadge>
            </motion.div>

            {/* Revolutionary Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
            >
              Tokeniza Cualquier Activo en{' '}
              <motion.span
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200%" }}
              >
                5 Minutos
              </motion.span>
            </motion.h1>

            {/* Premium Sub-headline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed"
            >
              La plataforma de tokenización con IA que hace que <span className="text-red-400 font-bold">Brickken parezca prehistórico</span>.
              <br />
              <span className="text-white font-semibold">Nuestra plataforma se paga sola</span> con yield farming automático.
            </motion.p>

            {/* Premium Value Props Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ModernCard glowColor="blue" className="h-full">
                  <div className="p-8 text-center">
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⚡
                    </motion.div>
                    <AnimatedMetric
                      label="Velocidad"
                      value="60x"
                      suffix=" Más Rápido"
                      color="blue"
                    />
                    <p className="text-gray-400 text-sm mt-2">5 min vs 5 días (Brickken)</p>
                  </div>
                </ModernCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <ModernCard glowColor="green" className="h-full">
                  <div className="p-8 text-center">
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💰
                    </motion.div>
                    <AnimatedMetric
                      label="Ahorro"
                      value="96%"
                      suffix=" Más Barato"
                      color="green"
                    />
                    <p className="text-gray-400 text-sm mt-2">€99 vs €2.500 (Brickken)</p>
                  </div>
                </ModernCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <ModernCard glowColor="purple" className="h-full">
                  <div className="p-8 text-center">
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ rotateY: [0, 180, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🤖
                    </motion.div>
                    <AnimatedMetric
                      label="Tecnología"
                      value="AI"
                      suffix=" Powered"
                      color="purple"
                    />
                    <p className="text-gray-400 text-sm mt-2">100% Automatizado</p>
                  </div>
                </ModernCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <ModernCard glowColor="orange" className="h-full">
                  <div className="p-8 text-center">
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🇨🇭
                    </motion.div>
                    <AnimatedMetric
                      label="Calidad"
                      value="Swiss"
                      suffix=" Premium"
                      color="orange"
                    />
                    <p className="text-gray-400 text-sm mt-2">Regulación Superior</p>
                  </div>
                </ModernCard>
              </motion.div>
            </div>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <PremiumButton
                variant="success"
                size="xl"
                onClick={runDemo}
                loading={demoRunning}
                className="text-xl px-12 py-6 shadow-2xl shadow-green-500/30"
              >
                {demoRunning ? 'Tokenizando...' : 'Demo en 5 Minutos 🚀'}
              </PremiumButton>

              <PremiumButton
                variant="secondary"
                size="lg"
                className="text-lg"
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
              <p className="text-xs text-gray-500 mt-2">🇨🇭 Hosted in Switzerland • Enterprise Security • GDPR Compliant</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Live Demo Section */}
      <AnimatePresence>
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
                  <PremiumSpinner size="xl" color="blue" />
                </div>
                
                <motion.h3
                  key={activeDemo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white mb-4"
                >
                  {activeDemo === 'analyzing' && '🧠 Analizando Activo con IA...'}
                  {activeDemo === 'tokenizing' && '⚡ Creando Smart Contract...'}
                  {activeDemo === 'deploying' && '🚀 Desplegando en Blockchain...'}
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
                  {activeDemo === 'deploying' && 'Lanzando en múltiples blockchains simultáneamente...'}
                  {activeDemo === 'completed' && 'Tu activo está ahora tokenizado y listo para inversores'}
                </motion.p>

                {activeDemo === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <ModernBadge variant="success">Token: ASSET-001</ModernBadge>
                      <ModernBadge variant="info">Supply: 1,000,000</ModernBadge>
                      <ModernBadge variant="warning">Yield: 12.5% APY</ModernBadge>
                      <ModernBadge variant="default">Chains: 5</ModernBadge>
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
      </AnimatePresence>

      {/* Competitor Comparison Section */}
      {competitorComparison && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ModernCard className="p-12">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                ChainX vs Brickken: <span className="text-red-400">La Diferencia es Brutal</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-white mb-2">Velocidad</h3>
                  <div className="space-y-2">
                    <div className="text-green-400 font-bold">ChainX: 5 minutos</div>
                    <div className="text-red-400">Brickken: 5-10 días</div>
                    <ModernBadge variant="success">60x más rápido</ModernBadge>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-xl font-bold text-white mb-2">Precio</h3>
                  <div className="space-y-2">
                    <div className="text-green-400 font-bold">ChainX: €99/mes</div>
                    <div className="text-red-400">Brickken: €2,500/mes</div>
                    <ModernBadge variant="success">96% más barato</ModernBadge>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-bold text-white mb-2">Tecnología</h3>
                  <div className="space-y-2">
                    <div className="text-green-400 font-bold">ChainX: AI-Powered</div>
                    <div className="text-red-400">Brickken: Manual</div>
                    <ModernBadge variant="success">100% Automatizado</ModernBadge>
                  </div>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para Revolucionar la Tokenización?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Únete a la revolución Swiss que está matando a Brickken
            </p>
            <PremiumButton
              variant="warning"
              size="xl"
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

export default LandingPage;