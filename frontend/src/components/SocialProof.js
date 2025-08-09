import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Star, TrendingUp, Award, Shield } from 'lucide-react';

const SocialProof = () => {
  const stats = [
    {
      icon: Users,
      value: '50.000+',
      label: 'Clientes Satisfeitos',
      color: 'text-blue-400'
    },
    {
      icon: Heart,
      value: '98%',
      label: 'Taxa de Satisfação',
      color: 'text-pink-400'
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Avaliação Média',
      color: 'text-yellow-400'
    },
    {
      icon: TrendingUp,
      value: '1M+',
      label: 'Capas Vendidas',
      color: 'text-green-400'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      text: 'Qualidade incrível! Minha capa ficou exatamente como imaginei.',
      rating: 5,
      verified: true
    },
    {
      name: 'Carlos R.',
      text: 'Entrega super rápida e produto de primeira qualidade.',
      rating: 5,
      verified: true
    },
    {
      name: 'Ana L.',
      text: 'Já é minha terceira capa. Sempre perfeitas!',
      rating: 5,
      verified: true
    }
  ];

  const certifications = [
    {
      icon: Shield,
      title: 'Pagamento Seguro',
      description: 'SSL 256-bit'
    },
    {
      icon: Award,
      title: 'Qualidade Premium',
      description: 'Materiais certificados'
    },
    {
      icon: TrendingUp,
      title: 'Loja Confiável',
      description: 'Desde 2020'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          Confiado por milhares de clientes
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-white/5 rounded-xl"
              >
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-purple-200 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          O que nossos clientes dizem
        </h3>
        
        <div className="space-y-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">
                    {testimonial.name}
                  </span>
                  {testimonial.verified && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      ✓
                    </span>
                  )}
                </div>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-purple-200 text-sm">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <div key={index} className="text-center">
                <Icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium text-sm mb-1">
                  {cert.title}
                </div>
                <div className="text-purple-300 text-xs">
                  {cert.description}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SocialProof;