import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Globe, Lock } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventData: any;
}

export default function PublishModal({ isOpen, onClose, onConfirm, eventData }: PublishModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const validationItems = [
    { label: 'Nombre del evento', isComplete: !!eventData.title },
    { label: 'Fecha del evento', isComplete: !!eventData.event_date },
    { label: 'Lugar del evento', isComplete: !!eventData.venue },
    { label: 'Plantilla seleccionada', isComplete: !!eventData.template_id },
  ];

  const isAllComplete = validationItems.every(item => item.isComplete);

  const handleConfirm = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      onConfirm();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {showConfetti && (
            <>
              <style>{`
                @keyframes confetti-fall {
                  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                .confetti {
                  position: absolute; width: 8px; height: 8px; border-radius: 50%;
                  animation: confetti-fall 2s linear forwards; pointer-events: none; z-index: 1000;
                  top: 0;
                }
              `}</style>
              {[...Array(25)].map((_, i) => (
                <div 
                  key={i} 
                  className="confetti" 
                  style={{ 
                    backgroundColor: ['#a35d6a', '#7B2D8B', '#d4af37', '#e8a0b0', '#00e5ff'][i % 5], 
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    width: `${6 + Math.random() * 4}px`,
                    height: `${6 + Math.random() * 4}px`
                  }} 
                />
              ))}
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10 border border-rose-100/50"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Globe className="text-[#a35d6a]" size={24} />
              </div>
              <h3 className="text-xl font-black text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Publicar invitación
              </h3>
              <p className="text-[#a35d6a]/60 text-xs mt-1">
                Verificación de calidad antes de lanzar
              </p>
            </div>

            <div className="space-y-3 mb-6 bg-rose-50/30 p-4 rounded-2xl border border-rose-100/40">
              {validationItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${item.isComplete ? 'text-[#2d1b2d]' : 'text-[#a35d6a]/50'}`}>
                    {item.label}
                  </span>
                  {item.isComplete ? (
                    <span className="flex items-center justify-center w-5 h-5 bg-green-50 rounded-full border border-green-200">
                      <Check className="text-green-600" size={12} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-5 h-5 bg-red-50 rounded-full border border-red-200">
                      <X className="text-red-600" size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
              ))}
            </div>

            {!isAllComplete && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] font-bold text-amber-800">
                  Completa los campos requeridos para poder publicar la invitación y compartir el enlace.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                disabled={!isAllComplete}
                onClick={handleConfirm}
                className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  isAllComplete 
                    ? 'bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Publicar ahora
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#a35d6a] hover:bg-rose-50 transition-colors"
                style={{ fontFamily: "'Mulish', sans-serif" }}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
