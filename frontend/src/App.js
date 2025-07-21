import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import PhoneModel3D from './components/PhoneModel3D';
import ModelSelector from './components/ModelSelector';
import GallerySelector from './components/GallerySelector';
import ImageUploader from './components/ImageUploader';
import FinalizeOrder from './components/FinalizeOrder';
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [designPosition, setDesignPosition] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  });
  const [phoneModels, setPhoneModels] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [designId, setDesignId] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [modelsRes, galleryRes] = await Promise.all([
        axios.get(`${API_BASE}/api/phone-models`),
        axios.get(`${API_BASE}/api/gallery`)
      ]);
      
      setPhoneModels(modelsRes.data.models);
      setGalleryItems(galleryRes.data.items);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados iniciais');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSelect = (phone) => {
    setSelectedPhone(phone);
    setCurrentStep(2);
    toast.success(`${phone.name} selecionado!`);
  };

  const handleDesignSelect = (design, type = 'gallery') => {
    setSelectedDesign({ ...design, type });
    setCurrentStep(3);
    toast.success('Design selecionado!');
  };

  const handleImageUpload = (imageUrl) => {
    const uploadDesign = {
      id: 'custom-upload',
      title: 'Sua Imagem',
      image_url: imageUrl,
      type: 'upload'
    };
    setSelectedDesign(uploadDesign);
    setCurrentStep(3);
    toast.success('Imagem carregada com sucesso!');
  };

  const handlePositionChange = (newPosition) => {
    setDesignPosition(newPosition);
  };

  const saveDesign = async () => {
    try {
      const designData = {
        phone_model: selectedPhone.id,
        design_type: selectedDesign.type,
        image_url: selectedDesign.image_url,
        position: designPosition
      };

      const response = await axios.post(`${API_BASE}/api/create-design`, designData);
      setDesignId(response.data.design.id);
      setCurrentStep(4);
      toast.success('Design salvo! Finalize seu pedido.');
    } catch (error) {
      console.error('Erro ao salvar design:', error);
      toast.error('Erro ao salvar design');
    }
  };

  const handleOrderComplete = () => {
    toast.success('Pedido realizado com sucesso!');
    // Reset to beginning
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedPhone(null);
      setSelectedDesign(null);
      setDesignId(null);
      setDesignPosition({ x: 0, y: 0, scale: 1, rotation: 0 });
    }, 2000);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Crie Sua Capa
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8">
            Em 3 passos simples • Preview 3D • Resultado incrível
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step 
                      ? 'bg-purple-500 border-purple-400 text-white' 
                      : 'bg-transparent border-purple-400 text-purple-400'
                  }`}
                  animate={{ 
                    scale: currentStep === step ? 1.2 : 1,
                    backgroundColor: currentStep >= step ? '#8b5cf6' : 'transparent'
                  }}
                >
                  {step}
                </motion.div>
                {step < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-purple-400' : 'bg-purple-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side - 3D Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Preview 3D
            </h3>
            
            <div className="h-96 lg:h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
              <Suspense fallback={<LoadingSpinner />}>
                <Canvas>
                  <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                  <ambientLight intensity={0.4} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
                  <Environment preset="studio" />
                  
                  <PhoneModel3D 
                    phoneModel={selectedPhone}
                    design={selectedDesign}
                    position={designPosition}
                  />
                  
                  <OrbitControls 
                    enablePan={false} 
                    enableZoom={true} 
                    minDistance={4} 
                    maxDistance={12}
                    autoRotate={!selectedDesign}
                    autoRotateSpeed={2}
                  />
                </Canvas>
              </Suspense>
            </div>

            {/* Controls */}
            {currentStep === 3 && selectedDesign && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 space-y-4"
              >
                <div className="text-white text-sm font-medium">Ajustar Posição:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-300 text-xs mb-1">Tamanho</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={designPosition.scale}
                      onChange={(e) => handlePositionChange({
                        ...designPosition,
                        scale: parseFloat(e.target.value)
                      })}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-300 text-xs mb-1">Rotação</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={designPosition.rotation}
                      onChange={(e) => handlePositionChange({
                        ...designPosition,
                        rotation: parseInt(e.target.value)
                      })}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
                <button
                  onClick={saveDesign}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Finalizar Design
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - Step Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <ModelSelector 
                  models={phoneModels}
                  onSelect={handlePhoneSelect}
                  selectedPhone={selectedPhone}
                />
              )}

              {currentStep === 2 && (
                <>
                  <GallerySelector
                    items={galleryItems}
                    onSelect={handleDesignSelect}
                  />
                  <ImageUploader
                    onUpload={handleImageUpload}
                  />
                </>
              )}

              {currentStep === 3 && selectedDesign && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Perfeito! 🎉
                  </h3>
                  <p className="text-purple-200 mb-6">
                    Use os controles ao lado para ajustar a posição do seu design na capa.
                    Quando estiver satisfeito, clique em "Finalizar Design".
                  </p>
                  <div className="flex items-center space-x-4 p-4 bg-black/20 rounded-xl">
                    <img 
                      src={`${API_BASE}${selectedDesign.image_url}`} 
                      alt={selectedDesign.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-white font-medium">{selectedDesign.title}</p>
                      <p className="text-purple-300 text-sm">
                        {selectedPhone?.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && designId && (
                <FinalizeOrder
                  designId={designId}
                  phoneModel={selectedPhone}
                  design={selectedDesign}
                  onComplete={handleOrderComplete}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <ToastContainer 
        position="bottom-right"
        theme="dark"
        className="z-50"
      />
    </div>
  );
}

export default App;