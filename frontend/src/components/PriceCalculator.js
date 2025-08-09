import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Truck, Shield, Clock, Star } from 'lucide-react';

const PriceCalculator = ({ phoneModel, design, quantity = 1, onPriceChange }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedMaterial, setSelectedMaterial] = useState('premium');
  const [pricing, setPricing] = useState({
    base: 0,
    material: 0,
    shipping: 0,
    discount: 0,
    total: 0
  });

  const materials = [
    {
      id: 'basic',
      name: 'Básica',
      description: 'Silicone flexível',
      price: 29.90,
      features: ['Proteção básica', 'Cores vibrantes']
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'TPU + PC rígido',
      price: 49.90,
      features: ['Proteção superior', 'Acabamento premium', 'Anti-amarelamento'],
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'Couro sintético',
      price: 79.90,
      features: ['Máxima proteção', 'Textura premium', 'Suporte para cartão']
    }
  ];

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Padrão',
      description: '5-7 dias úteis',
      price: 0,
      icon: '📦'
    },
    {
      id: 'express',
      name: 'Expressa',
      description: '2-3 dias úteis',
      price: 15.90,
      icon: '⚡'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: '1-2 dias úteis',
      price: 29.90,
      icon: '🚀'
    }
  ];

  const quantityDiscounts = [
    { min: 1, max: 1, discount: 0, label: '1 unidade' },
    { min: 2, max: 4, discount: 0.1, label: '2-4 unidades (10% off)' },
    { min: 5, max: 9, discount: 0.15, label: '5-9 unidades (15% off)' },
    { min: 10, max: Infinity, discount: 0.2, label: '10+ unidades (20% off)' }
  ];

  useEffect(() => {
    calculatePrice();
  }, [selectedQuantity, selectedShipping, selectedMaterial]);

  const calculatePrice = () => {
    const material = materials.find(m => m.id === selectedMaterial);
    const shipping = shippingOptions.find(s => s.id === selectedShipping);
    const discount = quantityDiscounts.find(d => selectedQuantity >= d.min && selectedQuantity <= d.max);

    const basePrice = material.price * selectedQuantity;
    const discountAmount = basePrice * (discount?.discount || 0);
    const shippingCost = selectedQuantity >= 2 ? 0 : shipping.price; // Frete grátis para 2+ itens
    const total = basePrice - discountAmount + shippingCost;

    const newPricing = {
      base: basePrice,
      material: material.price,
      shipping: shippingCost,
      discount: discountAmount,
      total: total
    };

    setPricing(newPricing);
    onPriceChange?.(newPricing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Calculadora de Preço</h3>
      </div>

      {/* Material Selection */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Material da Capa</h4>
        <div className="grid grid-cols-1 gap-3">
          {materials.map((material) => (
            <motion.div
              key={material.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMaterial(material.id)}
              className={`relative p-4 rounded-xl cursor-pointer transition-all ${
                selectedMaterial === material.id
                  ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {material.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Popular</span>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="text-white font-semibold">{material.name}</h5>
                  <p className="text-purple-200 text-sm">{material.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold text-lg">R$ {material.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {material.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Quantidade</h4>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white font-bold"
          >
            -
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold text-white">{selectedQuantity}</span>
            <div className="text-purple-300 text-sm">
              {quantityDiscounts.find(d => selectedQuantity >= d.min && selectedQuantity <= d.max)?.label}
            </div>
          </div>
          
          <button
            onClick={() => setSelectedQuantity(selectedQuantity + 1)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Entrega</h4>
        <div className="space-y-2">
          {shippingOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedShipping(option.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                selectedShipping === option.id
                  ? 'bg-purple-500/20 border border-purple-400/50'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h5 className="text-white font-medium">{option.name}</h5>
                  <p className="text-purple-200 text-sm">{option.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                {option.price === 0 ? (
                  <span className="text-green-400 font-bold">Grátis</span>
                ) : (
                  <span className="text-white font-bold">R$ {option.price.toFixed(2)}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {selectedQuantity >= 2 && (
          <div className="mt-2 p-2 bg-green-500/20 rounded-lg border border-green-400/30">
            <p className="text-green-300 text-sm text-center">
              🎉 Frete grátis para pedidos com 2+ capas!
            </p>
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-bold mb-3">Resumo do Pedido</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-purple-200">
            <span>{selectedQuantity}x {materials.find(m => m.id === selectedMaterial)?.name}</span>
            <span>R$ {pricing.base.toFixed(2)}</span>
          </div>
          
          {pricing.discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Desconto por quantidade</span>
              <span>-R$ {pricing.discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-purple-200">
            <span>Frete ({shippingOptions.find(s => s.id === selectedShipping)?.name})</span>
            <span>{pricing.shipping === 0 ? 'Grátis' : `R$ ${pricing.shipping.toFixed(2)}`}</span>
          </div>
          
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span>R$ {pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <Shield className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <span className="text-xs text-green-300">Garantia</span>
          </div>
          <div className="text-center">
            <Truck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <span className="text-xs text-blue-300">Rastreamento</span>
          </div>
          <div className="text-center">
            <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-xs text-purple-300">Produção 24h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceCalculator;