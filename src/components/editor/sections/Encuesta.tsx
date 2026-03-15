'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  BarChart3, 
  HelpCircle,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Encuesta() {
  const { eventData, updateField } = useEditor();
  
  const isEnabled = eventData.survey_active ?? false;
  // Usamos sections_done u otra estructura para guardar encuestas si es necesario.
  // Por ahora lo mapearemos de "survey_questions".
  const surveyQuestions = (eventData as any).survey_questions || [
    { id: '1', question: '¿Tienes alguna restricción alimentaria?', type: 'text' }
  ];

  const updateQuestions = (newQuestions: any[]) => {
    updateField('survey_questions' as any, newQuestions);
  };

  const addQuestion = () => {
    updateQuestions([
      ...surveyQuestions, 
      { id: Math.random().toString(36).substr(2, 9), question: 'Nueva pregunta...', type: 'text' }
    ]);
  };

  const removeQuestion = (id: string) => {
    updateQuestions(surveyQuestions.filter((q: any) => q.id !== id));
  };

  const updateQuestion = (id: string, value: string) => {
    updateQuestions(
      surveyQuestions.map((q: any) => q.id === id ? { ...q, question: value } : q)
    );
  };

  return (
    <div className="space-y-10">
      {/* ── TOGGLE SECCIÓN ── */}
      <section className="bg-gradient-to-br from-white to-rose-50/30 border border-rose-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} /> Preguntas Adicionales
            </label>
            <p className="text-[10px] text-gray-400 font-medium max-w-[280px]">
              Añade un breve cuestionario a tu RSVP para opciones de comida, transporte, etc.
            </p>
          </div>
          
          <button
            onClick={() => updateField('survey_active', !isEnabled)}
            className={`w-14 h-7 rounded-full transition-all relative ${
              isEnabled ? 'bg-[#a35d6a] shadow-inner' : 'bg-gray-200'
            }`}
          >
            <motion.div 
              animate={{ x: isEnabled ? 30 : 2 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              {isEnabled && <div className="w-1 h-1 bg-[#a35d6a] rounded-full" />}
            </motion.div>
          </button>
        </div>
      </section>

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            {/* ── LISTA DE PREGUNTAS ── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <HelpCircle size={14} /> Crear Preguntas
                </label>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-[#a35d6a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                >
                  <Plus size={14} /> Nueva
                </button>
              </div>

              <div className="space-y-3">
                {surveyQuestions.map((q: any, i: number) => (
                  <motion.div
                    key={q.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-rose-100 p-4 rounded-3xl shadow-sm flex items-center gap-3 group"
                  >
                    <div className="w-6 h-6 bg-rose-50 text-[#a35d6a] rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                      {i + 1}
                    </div>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, e.target.value)}
                      placeholder="Ej: ¿Tienes alguna alergia o dieta especial?"
                      className="flex-1 bg-transparent border-none focus:ring-1 focus:ring-rose-100 rounded-lg p-2 text-xs font-bold text-[#7a5060] outline-none"
                    />
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="p-2 text-rose-200 hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
                {surveyQuestions.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-rose-100 rounded-3xl text-rose-300">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Sin preguntas activas</p>
                  </div>
                )}
              </div>
            </section>

            {/* ── NOTA INFO ── */}
            <div className="bg-rose-50/50 p-4 rounded-2xl flex items-start gap-3 border border-rose-100/50">
              <Info className="text-[#a35d6a]/40 mt-0.5" size={18} />
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase text-[#a35d6a] tracking-widest">Dónde se mostrará</h5>
                <p className="text-[10px] text-[#7a5060] font-medium leading-relaxed">
                  Estas preguntas aparecerán en el formulario de confirmación (RSVP) cuando los invitados acepten su asistencia.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
