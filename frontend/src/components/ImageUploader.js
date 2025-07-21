import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ImageUploader = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 10MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE}/api/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadedImage(response.data.image_url);
        onUpload(response.data.image_url);
        toast.success('Imagem carregada com sucesso!');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao carregar imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    disabled: uploading
  });

  const clearUpload = () => {
    setUploadedImage(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mt-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Ou Use Sua Própria Imagem
        </h3>
        <p className="text-purple-200">
          Faça upload da sua foto, logo ou arte personalizada
        </p>
      </div>

      {!uploadedImage ? (
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'dragover' : ''} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="text-center">
            {uploading ? (
              <div className="space-y-4">
                <div className="loading-spinner mx-auto"></div>
                <p className="text-purple-200">Carregando sua imagem...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                
                <div>
                  <p className="text-white font-medium mb-2">
                    {isDragActive 
                      ? 'Solte sua imagem aqui...' 
                      : 'Arraste sua imagem ou clique para selecionar'
                    }
                  </p>
                  <p className="text-purple-300 text-sm">
                    Suporta PNG, JPG, GIF • Máximo 10MB
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  type="button"
                >
                  Selecionar Arquivo
                </motion.button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/20 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-400/30">
                <Image className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Check className="w-5 h-5 text-green-400" />
                <h4 className="text-white font-semibold">Imagem Carregada!</h4>
              </div>
              
              <p className="text-purple-200 text-sm mb-3">
                Sua imagem personalizada está pronta para ser usada na capa.
              </p>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearUpload}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">Remover</span>
                </motion.button>
                
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Trocar</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/20 rounded-xl p-4 border border-green-500/20">
          <h4 className="text-green-400 font-semibold text-sm mb-2">✅ Dicas para melhor resultado:</h4>
          <ul className="text-green-300 text-xs space-y-1">
            <li>• Use imagens de alta qualidade (300 DPI+)</li>
            <li>• Prefira fundo transparente (PNG)</li>
            <li>• Evite imagens muito pequenas</li>
          </ul>
        </div>
        
        <div className="bg-black/20 rounded-xl p-4 border border-blue-500/20">
          <h4 className="text-blue-400 font-semibold text-sm mb-2">💡 Ideias criativas:</h4>
          <ul className="text-blue-300 text-xs space-y-1">
            <li>• Sua foto favorita</li>
            <li>• Logo da sua empresa</li>
            <li>• Arte que você criou</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageUploader;