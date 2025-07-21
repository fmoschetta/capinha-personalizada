import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Type, Leaf, Zap, Minimize, TrendingUp } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const GallerySelector = ({ items, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);

  const categories = [
    { id: 'all', name: 'Todos', icon: Zap },
    { id: 'romantic', name: 'Romântico', icon: Heart },
    { id: 'text', name: 'Texto', icon: Type },
    { id: 'nature', name: 'Natureza', icon: Leaf },
    { id: 'modern', name: 'Moderno', icon: Zap },
    { id: 'minimal', name: 'Minimalista', icon: Minimize }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const trendingItems = items.filter(item => item.trending);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Escolha sua Arte
        </h2>
        <p className="text-purple-200">
          Selecione um design da nossa galeria exclusiva
        </p>
      </div>

      {/* Trending Section */}
      {trendingItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Em Alta</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingItems.map((item) => (
              <motion.div
                key={`trending-${item.id}`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={() => onSelect(item)}
                className="relative cursor-pointer group"
              >
                <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-2xl p-4 border border-orange-400/30 hover:border-orange-400/70 transition-all">
                  <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
                
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  HOT
                </div>
                
                <p className="text-white text-sm font-medium mt-2 text-center">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-black/20 text-purple-200 hover:bg-black/30 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
              onClick={() => onSelect(item)}
              className="relative cursor-pointer group"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-400/30 hover:border-purple-400/70 transition-all">
                {/* Placeholder for actual image */}
                <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* Design preview based on ID */}
                  {item.id === 'hearts-floating' && (
                    <div className="relative w-full h-full">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-pink-400 rounded-full animate-pulse"
                          style={{
                            left: `${20 + (i % 3) * 30}%`,
                            top: `${20 + Math.floor(i / 3) * 40}%`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        >
                          ❤️
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {item.id === 'manuscript-name' && (
                    <div className="text-purple-300 text-center">
                      <div className="text-lg font-script">Seu Nome</div>
                      <div className="text-xs opacity-70">manuscrito</div>
                    </div>
                  )}
                  
                  {item.id === 'delicate-flowers' && (
                    <div className="text-4xl">🌸</div>
                  )}
                  
                  {item.id === 'geometric-modern' && (
                    <div className="grid grid-cols-2 gap-1 p-2">
                      <div className="bg-cyan-400 rounded-sm aspect-square"></div>
                      <div className="bg-pink-400 rounded-sm aspect-square"></div>
                      <div className="bg-yellow-400 rounded-sm aspect-square"></div>
                      <div className="bg-purple-400 rounded-sm aspect-square"></div>
                    </div>
                  )}
                  
                  {item.id === 'motivational-quote' && (
                    <div className="text-purple-300 text-center text-xs">
                      <div>"Dream"</div>
                      <div>"Believe"</div>
                      <div>"Achieve"</div>
                    </div>
                  )}
                  
                  {item.id === 'minimal-elegant' && (
                    <div className="w-full h-full border-2 border-purple-300 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 border border-purple-300 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Trending badge */}
              {item.trending && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  🔥
                </div>
              )}
              
              {/* Item title */}
              <p className="text-white text-sm font-medium mt-2 text-center">
                {item.title}
              </p>
              
              {/* Hover overlay */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent rounded-2xl flex items-end justify-center pb-4"
                  >
                    <span className="text-white text-sm font-bold">
                      Clique para selecionar
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No results */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Nenhum design encontrado
          </h3>
          <p className="text-purple-200">
            Tente selecionar outra categoria ou faça upload da sua própria imagem!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GallerySelector;