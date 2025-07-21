import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Mail, Phone, MapPin, CreditCard, Check, Package } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const FinalizeOrder = ({ designId, phoneModel, design, onComplete }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  
  const [orderStep, setOrderStep] = useState(1); // 1: Info, 2: Review, 3: Success
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    const { name, email, phone, address } = customerInfo;
    
    if (!name.trim()) {
      toast.error('Nome é obrigatório');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast.error('Email válido é obrigatório');
      return false;
    }
    
    if (!phone.trim()) {
      toast.error('Telefone é obrigatório');
      return false;
    }
    
    if (!address.street.trim() || !address.city.trim() || !address.zipCode.trim()) {
      toast.error('Endereço completo é obrigatório');
      return false;
    }
    
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const orderData = {
        design_id: designId,
        customer_info: customerInfo
      };
      
      const response = await axios.post(`${API_BASE}/api/create-order`, orderData);
      
      if (response.data.success) {
        setOrderStep(3);
        toast.success('Pedido realizado com sucesso!');
        
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          {orderStep === 1 && 'Finalizar Pedido'}
          {orderStep === 2 && 'Revisar Pedido'}
          {orderStep === 3 && 'Pedido Confirmado!'}
        </h2>
        <p className="text-purple-200">
          {orderStep === 1 && 'Preencha seus dados para finalizar'}
          {orderStep === 2 && 'Confirme as informações do seu pedido'}
          {orderStep === 3 && 'Seu pedido foi recebido com sucesso'}
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                orderStep >= step ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {step < orderStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  orderStep > step ? 'bg-purple-500' : 'bg-purple-500/20'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Customer Info */}
      {orderStep === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Personal Info */}
          <div className="bg-black/20 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Informações Pessoais</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-purple-200 text-sm mb-2">Telefone *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-black/20 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Endereço de Entrega</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-purple-200 text-sm mb-2">Endereço *</label>
                <input
                  type="text"
                  value={customerInfo.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="Rua, número, complemento"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm mb-2">Cidade *</label>
                <input
                  type="text"
                  value={customerInfo.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="Sua cidade"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm mb-2">Estado</label>
                <input
                  type="text"
                  value={customerInfo.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="SP"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-purple-200 text-sm mb-2">CEP *</label>
                <input
                  type="text"
                  value={customerInfo.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (validateForm()) {
                setOrderStep(2);
              }
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
          >
            Revisar Pedido
          </motion.button>
        </motion.div>
      )}

      {/* Step 2: Review */}
      {orderStep === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Order Summary */}
          <div className="bg-black/20 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Resumo do Pedido</h3>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl mb-4">
              <div className="w-16 h-20 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-semibold">{phoneModel?.name}</h4>
                <p className="text-purple-200 text-sm">{design?.title}</p>
                <p className="text-green-400 font-bold text-lg">R$ 49,90</p>
              </div>
            </div>
            
            <div className="border-t border-purple-400/20 pt-4">
              <div className="flex justify-between text-white">
                <span>Subtotal:</span>
                <span>R$ 49,90</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Frete:</span>
                <span className="text-green-400">Grátis</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg border-t border-purple-400/20 pt-2 mt-2">
                <span>Total:</span>
                <span>R$ 49,90</span>
              </div>
            </div>
          </div>

          {/* Customer Info Review */}
          <div className="bg-black/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dados de Entrega</h3>
            <div className="space-y-2 text-purple-200">
              <p><strong className="text-white">Nome:</strong> {customerInfo.name}</p>
              <p><strong className="text-white">Email:</strong> {customerInfo.email}</p>
              <p><strong className="text-white">Telefone:</strong> {customerInfo.phone}</p>
              <p><strong className="text-white">Endereço:</strong> {customerInfo.address.street}, {customerInfo.address.city} - {customerInfo.address.state}, {customerInfo.address.zipCode}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setOrderStep(1)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              Voltar
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50"
            >
              {submitting ? 'Finalizando...' : 'Finalizar Pedido'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Success */}
      {orderStep === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Pedido Confirmado! 🎉
          </h3>
          
          <p className="text-purple-200 mb-6">
            Sua capa personalizada está sendo preparada com muito carinho.<br/>
            Você receberá um email com os detalhes do pedido.
          </p>
          
          <div className="bg-black/20 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-white font-semibold mb-2">Próximos passos:</p>
            <ul className="text-purple-200 text-sm space-y-1 text-left">
              <li>✅ Produção: 1-2 dias úteis</li>
              <li>✅ Envio: Correios (3-5 dias úteis)</li>
              <li>✅ Acompanhamento por email</li>
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FinalizeOrder;