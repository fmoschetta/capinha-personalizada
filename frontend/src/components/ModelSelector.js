import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Star } from 'lucide-react';

const ModelSelector = ({ models, onSelect, selectedPhone }) => {
  const popularModels = models.filter(model => model.popular);
  const otherModels = models.filter(model => !model.popular);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Escolha seu Modelo
        </h2>
        <p className="text-purple-200">
          Selecione o modelo do seu celular para ver o preview perfeito
        </p>
      </div>

      {/* Popular Models */}
      {popularModels.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Mais Populares</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {popularModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(model)}
                className={`interactive-card p-6 rounded-2xl cursor-pointer transition-all ${
                  selectedPhone?.id === model.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-purple-400' 
                    : 'bg-black/20 hover:bg-black/30 border-2 border-transparent hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-20 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg flex items-center justify-center border border-gray-600">
                      <Smartphone className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-semibold text-lg">{model.name}</h4>
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-purple-200 text-sm mb-2">{model.brand}</p>
                    
                    {model.dimensions && (
                      <div className="text-xs text-purple-300">
                        {model.dimensions.width}mm × {model.dimensions.height}mm
                      </div>
                    )}
                  </div>
                  
                  {selectedPhone?.id === model.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Other Models */}
      {otherModels.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Outros Modelos</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(model)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedPhone?.id === model.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-black/10 hover:bg-black/20 border border-white/10 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-md flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{model.name}</h4>
                    <p className="text-purple-200 text-sm">{model.brand}</p>
                  </div>
                  
                  {selectedPhone?.id === model.id && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="mt-8 p-4 bg-black/20 rounded-xl border border-purple-500/20">
        <p className="text-purple-200 text-sm text-center">
          💡 Não vê seu modelo? Entre em contato conosco - trabalhamos com todos os smartphones!
        </p>
      </div>
    </motion.div>
  );
};

export default ModelSelector;