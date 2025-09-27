// Sistema de componentes UI modernos y profesionales
import React from 'react';
import { motion } from 'framer-motion';

// Card moderna con efectos avanzados
export const ModernCard = ({ 
  children, 
  className = '', 
  hover = true, 
  glowColor = 'blue',
  ...props 
}) => {
  const glowColors = {
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40',
    orange: 'shadow-orange-500/20 hover:shadow-orange-500/40',
    green: 'shadow-green-500/20 hover:shadow-green-500/40',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40',
    red: 'shadow-red-500/20 hover:shadow-red-500/40'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br 
        from-gray-900/90 via-gray-800/90 to-gray-900/90
        backdrop-blur-xl border border-gray-700/50
        shadow-2xl ${glowColors[glowColor]}
        ${hover ? 'hover:scale-[1.02] hover:border-gray-600/70' : ''}
        transition-all duration-500 ease-out
        ${className}
      `}
      whileHover={hover ? { y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      {...props}
    >
      {/* Efecto de brillo superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Efecto de partículas animadas */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-ping" />
        <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-white/15 rounded-full animate-bounce" />
      </div>
    </motion.div>
  );
};

// Botón premium con efectos avanzados
export const PremiumButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  glow = true,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
      hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500
      text-white shadow-lg shadow-blue-500/30
      ${glow ? 'hover:shadow-xl hover:shadow-blue-500/50' : ''}
    `,
    secondary: `
      bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700
      hover:from-gray-600 hover:via-gray-500 hover:to-gray-600
      text-white shadow-lg shadow-gray-500/20
    `,
    success: `
      bg-gradient-to-r from-green-600 via-emerald-500 to-green-600
      hover:from-green-500 hover:via-emerald-400 hover:to-green-500
      text-white shadow-lg shadow-green-500/30
    `,
    warning: `
      bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500
      hover:from-orange-500 hover:via-orange-400 hover:to-yellow-400
      text-white shadow-lg shadow-orange-500/30
    `,
    danger: `
      bg-gradient-to-r from-red-600 via-red-500 to-pink-600
      hover:from-red-500 hover:via-red-400 hover:to-pink-500
      text-white shadow-lg shadow-red-500/30
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-semibold
        border border-white/20 backdrop-blur-sm
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={loading}
      {...props}
    >
      {/* Efecto de ondas al hacer click */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
      
      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </span>
    </motion.button>
  );
};

// Input moderno con efectos
export const ModernInput = ({ 
  label, 
  icon, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          className={`
            block w-full rounded-xl border-0 bg-gray-800/50 
            backdrop-blur-sm px-4 py-3 text-white
            ring-1 ring-inset ring-gray-700/50
            placeholder:text-gray-400
            focus:ring-2 focus:ring-blue-500/70
            transition-all duration-300
            ${icon ? 'pl-10' : ''}
            ${error ? 'ring-red-500/70 focus:ring-red-500/70' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Métrica con animación
export const AnimatedMetric = ({ 
  label, 
  value, 
  prefix = '', 
  suffix = '',
  change, 
  color = 'blue',
  icon 
}) => {
  const colors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
    purple: 'text-purple-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      
      <motion.div
        className={`text-3xl font-bold ${colors[color]}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {value}
        </motion.span>
        {suffix}
      </motion.div>
      
      {change && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`flex items-center gap-1 text-sm ${
            change > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          <span>{change > 0 ? '↗️' : '↘️'}</span>
          <span>{Math.abs(change)}%</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Badge moderno
export const ModernBadge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  glow = false 
}) => {
  const variants = {
    default: 'bg-gray-700/80 text-gray-300',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium
      backdrop-blur-sm border transition-all duration-300
      ${variants[variant]}
      ${sizes[size]}
      ${glow ? 'shadow-lg' : ''}
    `}>
      {children}
    </span>
  );
};

// Loading Spinner Premium
export const PremiumSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    blue: 'border-blue-500/30 border-t-blue-400',
    green: 'border-green-500/30 border-t-green-400',
    orange: 'border-orange-500/30 border-t-orange-400'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`
        ${sizes[size]} 
        border-2 rounded-full animate-spin
        ${colors[color]}
      `} />
    </div>
  );
};