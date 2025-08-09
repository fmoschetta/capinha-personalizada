import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Move, RotateCw, ZoomIn, ZoomOut, Trash2, Copy, 
  Layers, Type, Palette, Download, Save, Undo, Redo,
  Grid, Lock, Eye, EyeOff
} from 'lucide-react';

const DesignEditor = ({ design, position, onPositionChange, onSave }) => {
  const [selectedTool, setSelectedTool] = useState('move');
  const [showGrid, setShowGrid] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [history, setHistory] = useState([position]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [textElements, setTextElements] = useState([]);
  const [showTextEditor, setShowTextEditor] = useState(false);

  const tools = [
    { id: 'move', icon: Move, label: 'Mover' },
    { id: 'rotate', icon: RotateCw, label: 'Rotacionar' },
    { id: 'scale', icon: ZoomIn, label: 'Redimensionar' },
    { id: 'text', icon: Type, label: 'Adicionar Texto' },
  ];

  const updatePosition = useCallback((newPosition) => {
    if (isLocked) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPosition);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onPositionChange(newPosition);
  }, [history, historyIndex, isLocked, onPositionChange]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onPositionChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onPositionChange(history[newIndex]);
    }
  };

  const resetPosition = () => {
    const resetPos = { x: 0, y: 0, scale: 1, rotation: 0 };
    updatePosition(resetPos);
  };

  const duplicateDesign = () => {
    // Implementar duplicação do design
    console.log('Duplicar design');
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Editor de Design</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid ? 'bg-purple-500 text-white' : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2 rounded-lg transition-colors ${
              isLocked ? 'bg-red-500 text-white' : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                selectedTool === tool.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-purple-300 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tool.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Position Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-300 text-sm mb-2">Posição X</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={position.x}
                onChange={(e) => updatePosition({
                  ...position,
                  x: parseInt(e.target.value)
                })}
                className="flex-1 accent-purple-500"
                disabled={isLocked}
              />
              <span className="text-white text-sm w-12 text-center">{position.x}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-purple-300 text-sm mb-2">Posição Y</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={position.y}
                onChange={(e) => updatePosition({
                  ...position,
                  y: parseInt(e.target.value)
                })}
                className="flex-1 accent-purple-500"
                disabled={isLocked}
              />
              <span className="text-white text-sm w-12 text-center">{position.y}</span>
            </div>
          </div>
        </div>

        {/* Scale and Rotation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-300 text-sm mb-2">Tamanho</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={position.scale}
                onChange={(e) => updatePosition({
                  ...position,
                  scale: parseFloat(e.target.value)
                })}
                className="flex-1 accent-purple-500"
                disabled={isLocked}
              />
              <span className="text-white text-sm w-12 text-center">{position.scale.toFixed(1)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-purple-300 text-sm mb-2">Rotação</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={position.rotation}
                onChange={(e) => updatePosition({
                  ...position,
                  rotation: parseInt(e.target.value)
                })}
                className="flex-1 accent-purple-500"
                disabled={isLocked}
              />
              <span className="text-white text-sm w-12 text-center">{position.rotation}°</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="flex items-center space-x-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-purple-300 rounded-lg transition-colors"
          >
            <Undo className="w-4 h-4" />
            <span className="text-sm">Desfazer</span>
          </button>
          
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="flex items-center space-x-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-purple-300 rounded-lg transition-colors"
          >
            <Redo className="w-4 h-4" />
            <span className="text-sm">Refazer</span>
          </button>
          
          <button
            onClick={resetPosition}
            className="flex items-center space-x-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-purple-300 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
          
          <button
            onClick={duplicateDesign}
            className="flex items-center space-x-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-purple-300 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm">Duplicar</span>
          </button>
        </div>

        {/* Layers Panel */}
        <div className="bg-black/20 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-2 mb-3">
            <Layers className="w-4 h-4 text-purple-400" />
            <h4 className="text-white font-medium">Camadas</h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500/30 rounded flex items-center justify-center">
                  <span className="text-xs">🎨</span>
                </div>
                <span className="text-white text-sm">{design?.title || 'Design Principal'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 hover:bg-white/10 rounded">
                  <Eye className="w-3 h-3 text-purple-300" />
                </button>
                <button className="p-1 hover:bg-white/10 rounded">
                  <Lock className="w-3 h-3 text-purple-300" />
                </button>
              </div>
            </div>
            
            {textElements.map((text, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500/30 rounded flex items-center justify-center">
                    <Type className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-white text-sm">Texto {index + 1}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-white/10 rounded">
                    <Eye className="w-3 h-3 text-purple-300" />
                  </button>
                  <button className="p-1 hover:bg-white/10 rounded">
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Salvar Design</span>
        </motion.button>
      </div>
    </div>
  );
};

export default DesignEditor;