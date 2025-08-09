import React from 'react';
import { motion } from 'framer-motion';
import { Check, Smartphone, Palette, Settings, ShoppingCart } from 'lucide-react';

const ProgressTracker = ({ currentStep, completedSteps = [] }) => {
  const steps = [
    {
      id: 1,
      title: 'Escolher Modelo',
      description: 'Selecione seu celular',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Selecionar Design',
      description: 'Escolha sua arte',
      icon: Palette,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Personalizar',
      description: 'Ajuste posição e tamanho',
      icon: Settings,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'Finalizar',
      description: 'Complete seu pedido',
      icon: ShoppingCart,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-6 text-center">
        Progresso do Pedido
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) || currentStep > step.id;
          const isAccessible = step.id <= currentStep;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center p-4 rounded-xl transition-all ${
                isActive
                  ? `bg-gradient-to-r ${step.color} shadow-lg`
                  : isCompleted
                  ? 'bg-green-500/20 border border-green-400/30'
                  : isAccessible
                  ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                  : 'bg-white/5 border border-white/10 opacity-50'
              }`}
            >
              {/* Step Number/Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-green-500'
                  : isActive
                  ? 'bg-white/20'
                  : 'bg-white/10'
              }`}>
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <Icon className={`w-6 h-6 ${
                    isActive ? 'text-white' : 'text-purple-300'
                  }`} />
                )}
              </div>
              
              {/* Step Content */}
              <div className="ml-4 flex-1">
                <h4 className={`font-semibold ${
                  isActive || isCompleted ? 'text-white' : 'text-purple-200'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-sm ${
                  isActive || isCompleted ? 'text-white/80' : 'text-purple-300'
                }`}>
                  {step.description}
                </p>
              </div>
              
              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                )}
                {isCompleted && (
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                )}
              </div>
              
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`absolute left-6 top-16 w-0.5 h-4 ${
                  isCompleted ? 'bg-green-400' : 'bg-white/20'
                }`} />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm text-purple-300 mb-2">
          <span>Progresso</span>
          <span>{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;