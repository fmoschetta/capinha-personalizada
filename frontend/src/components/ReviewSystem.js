import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, MessageCircle, Filter, TrendingUp, Award } from 'lucide-react';

const ReviewSystem = ({ productId, averageRating = 4.8, totalReviews = 1247 }) => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      user: 'Maria Silva',
      avatar: '👩‍💼',
      rating: 5,
      date: '2024-01-15',
      verified: true,
      helpful: 23,
      comment: 'Qualidade incrível! A impressão ficou perfeita e a capa protege muito bem meu iPhone. Recomendo!',
      images: ['📱', '✨'],
      phoneModel: 'iPhone 15 Pro'
    },
    {
      id: 2,
      user: 'João Santos',
      avatar: '👨‍💻',
      rating: 5,
      date: '2024-01-12',
      verified: true,
      helpful: 18,
      comment: 'Superou minhas expectativas! O design ficou exatamente como eu queria. Entrega rápida também.',
      phoneModel: 'Samsung Galaxy S24'
    },
    {
      id: 3,
      user: 'Ana Costa',
      avatar: '👩‍🎨',
      rating: 4,
      date: '2024-01-10',
      verified: true,
      helpful: 12,
      comment: 'Muito boa! Só achei que poderia ter mais opções de personalização de texto.',
      phoneModel: 'iPhone 14'
    },
    {
      id: 4,
      user: 'Pedro Lima',
      avatar: '👨‍🚀',
      rating: 5,
      date: '2024-01-08',
      verified: true,
      helpful: 31,
      comment: 'Terceira capa que compro aqui. Sempre com qualidade excepcional! O preview 3D ajuda muito na escolha.',
      phoneModel: 'iPhone 15'
    }
  ];

  useEffect(() => {
    setReviews(mockReviews);
  }, []);

  const ratingDistribution = [
    { stars: 5, count: 892, percentage: 71.6 },
    { stars: 4, count: 249, percentage: 20.0 },
    { stars: 3, count: 75, percentage: 6.0 },
    { stars: 2, count: 19, percentage: 1.5 },
    { stars: 1, count: 12, percentage: 0.9 }
  ];

  const filterOptions = [
    { id: 'all', label: 'Todas', count: totalReviews },
    { id: '5', label: '5 estrelas', count: 892 },
    { id: '4', label: '4 estrelas', count: 249 },
    { id: 'verified', label: 'Verificadas', count: 1156 },
    { id: 'photos', label: 'Com fotos', count: 234 }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Mais recentes' },
    { id: 'helpful', label: 'Mais úteis' },
    { id: 'rating_high', label: 'Maior avaliação' },
    { id: 'rating_low', label: 'Menor avaliação' }
  ];

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'verified') return review.verified;
    if (filter === 'photos') return review.images && review.images.length > 0;
    return review.rating.toString() === filter;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'rating_high':
        return b.rating - a.rating;
      case 'rating_low':
        return a.rating - b.rating;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Avaliações dos Clientes</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(Math.floor(averageRating), 'w-5 h-5')}
              <span className="text-2xl font-bold text-white">{averageRating}</span>
            </div>
            <span className="text-purple-200">({totalReviews.toLocaleString()} avaliações)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Award className="w-6 h-6 text-yellow-400" />
          <div className="text-right">
            <div className="text-yellow-400 font-bold text-sm">Excelente</div>
            <div className="text-purple-200 text-xs">Baseado em {totalReviews} avaliações</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-6 p-4 bg-black/20 rounded-xl">
        <h4 className="text-white font-medium mb-3">Distribuição das Avaliações</h4>
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-20">
                <span className="text-purple-200 text-sm">{item.stars}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              
              <div className="text-purple-200 text-sm w-16 text-right">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 text-sm">Filtrar:</span>
        </div>
        
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              filter === option.id
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            {option.label} ({option.count})
          </button>
        ))}
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-black/30 border border-purple-400/30 rounded-lg px-3 py-1 text-white text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {sortedReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{review.avatar}</div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{review.user}</span>
                      {review.verified && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                          ✓ Compra verificada
                        </span>
                      )}
                    </div>
                    <span className="text-purple-300 text-sm">
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-purple-200 text-sm">• {review.phoneModel}</span>
                  </div>
                  
                  <p className="text-purple-100 mb-3">{review.comment}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-lg"
                        >
                          {image}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-purple-300 hover:text-purple-200 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Útil ({review.helpful})</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-purple-300 hover:text-purple-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Responder</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Review Button */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowReviewForm(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          Escrever Avaliação
        </motion.button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="text-green-400 font-bold text-lg">98%</div>
          <div className="text-green-300 text-xs">Recomendam</div>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-blue-400 font-bold text-lg">4.8/5</div>
          <div className="text-blue-300 text-xs">Qualidade</div>
        </div>
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="text-purple-400 font-bold text-lg">24h</div>
          <div className="text-purple-300 text-xs">Produção</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewSystem;