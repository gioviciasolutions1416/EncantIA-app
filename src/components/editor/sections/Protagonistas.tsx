'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Users, 
  Heart, 
  Cross,
  UserPlus,
  MessageCircle,
  Sticker,
  GraduationCap
} from 'lucide-react';

import { SECCIONES_POR_EVENTO } from '@/config/event-sections';

export default function Protagonistas() {
  const { eventData, updateField } = useEditor();
  const tipoKey = eventData.event_type
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace('anos', 'anos') || 'boda';
  
  const config = SECCIONES_POR_EVENTO[tipoKey] 
    || SECCIONES_POR_EVENTO['boda'];

  const showField = (fieldName: string) => {
    switch (fieldName) {
      case 'novia': return config.protagonistas?.campo1 === 'novia';
      case 'novio': return config.protagonistas?.campo2 === 'novio';
      case 'nombre_festejada': return config.protagonistas?.campo1 === 'festejada';
      case 'nombre_festejado': return config.protagonistas?.campo1 === 'bebe' || config.protagonistas?.campo1 === 'graduado';
      case 'nombre_bebe': return config.protagonistas?.campo1 === 'mama';
      case 'institucion': return config.institucion === true;
      case 'carrera': return config.career === true;
      case 'padre_novia': return config.padres === true && tipoKey === 'boda';
      case 'madre_novia': return config.padres === true && tipoKey === 'boda';
      case 'padre_novio': return config.padres === true && tipoKey === 'boda';
      case 'madre_novio': return config.padres === true && tipoKey === 'boda';
      case 'padre': return config.padres === true && tipoKey !== 'boda';
      case 'madre': return config.padres === true && tipoKey !== 'boda';
      case 'padrinos': return config.padrinos === true;
      case 'chambelanes': return config.chambelanes === true;
      default: return false;
    }
  };

  const noviaStr = (eventData.title || '').split('&')[0]?.trim() || '';
  const novioStr = (eventData.title || '').split('&')[1]?.trim() || '';

  const handleBodaNameChange = (isNovia: boolean, val: string) => {
    if (isNovia) {
      if (novioStr) updateField('title', `${val} & ${novioStr}`);
      else updateField('title', val);
    } else {
      if (noviaStr) updateField('title', `${noviaStr} & ${val}`);
      else updateField('title', ` & ${val}`);
    }
  };

  return (
    <div className="space-y-10">
      {/* ── NOMBRES PRINCIPALES ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <Heart size={14} /> 
          Nombre
        </label>
        <div className="flex flex-col gap-4">
          {showField('novia') && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Nombre de la Novia</span>
              <input
                type="text"
                value={noviaStr}
                onChange={(e) => handleBodaNameChange(true, e.target.value)}
                className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] focus:ring-2 focus:ring-[#7B2D8B]/10 focus:border-[#7B2D8B] outline-none"
              />
            </div>
          )}
          {showField('novio') && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Novio</span>
              <input
                type="text"
                value={novioStr}
                onChange={(e) => handleBodaNameChange(false, e.target.value)}
                className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] focus:ring-2 focus:ring-[#7B2D8B]/10 focus:border-[#7B2D8B] outline-none"
              />
            </div>
          )}
          
          {showField('nombre_festejada') && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Nombre de la Festejada</span>
              <input
                type="text"
                value={eventData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] focus:ring-2 focus:ring-[#7B2D8B]/10 focus:border-[#7B2D8B] outline-none"
              />
            </div>
          )}

          {showField('nombre_festejado') && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Festejado</span>
              <input
                type="text"
                value={eventData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] focus:ring-2 focus:ring-[#7B2D8B]/10 focus:border-[#7B2D8B] outline-none"
              />
            </div>
          )}

          {showField('nombre_bebe') && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Bebé</span>
              <input
                type="text"
                value={eventData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] focus:ring-2 focus:ring-[#7B2D8B]/10 focus:border-[#7B2D8B] outline-none"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── GRADUACIÓN / ESCOLARES ── */}
      {(showField('institucion') || showField('carrera')) && (
        <section className="space-y-4">
          <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-rose-100 pb-2">
            <GraduationCap size={14} /> 
            Detalles Académicos
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {showField('institucion') && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Institución</span>
                <input
                  type="text"
                  value={eventData.institucion || ''}
                  onChange={(e) => updateField('institucion', e.target.value)}
                  className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                />
              </div>
            )}
            {showField('carrera') && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Carrera o Nivel</span>
                <input
                  type="text"
                  value={eventData.career || ''}
                  onChange={(e) => updateField('career', e.target.value)}
                  className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CHAMBELANES ── */}
      {showField('chambelanes') && (
        <section className="space-y-4">
          <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-rose-100 pb-2">
            <Users size={14} /> 
            Chambelanes de Honor
          </label>
          <div className="pt-2">
            <input
              type="text"
              value={eventData.chambelanes || ''}
              onChange={(e) => updateField('chambelanes', e.target.value)}
              placeholder="Nombres de tus chambelanes..."
              className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
            />
          </div>
        </section>
      )}

      {/* ── PADRES ── */}
      {(showField('padre_novia') || showField('madre_novia') || showField('padre_novio') || showField('madre_novio') || showField('padre') || showField('madre')) && (
        <section className="space-y-4">
          <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-rose-100 pb-2">
            <Users size={14} /> 
            Padres
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            
            {/* PADRES BODA NOVIA */}
            {(showField('padre_novia') || showField('madre_novia')) && (
              <div className="space-y-4">
                {showField('padre_novia') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Padre de la Novia</span>
                      <button 
                        onClick={() => updateField('parents_bride_father_deceased', !eventData.parents_bride_father_deceased)}
                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase transition-colors ${eventData.parents_bride_father_deceased ? 'text-gray-400' : 'text-rose-200 hover:text-rose-400'}`}
                      >
                        <Cross size={10} /> En memoria
                      </button>
                    </div>
                    <input
                      type="text"
                      value={eventData.parents_bride_father || ''}
                      onChange={(e) => updateField('parents_bride_father', e.target.value)}
                      className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                    />
                  </div>
                )}
                {showField('madre_novia') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Madre de la Novia</span>
                      <button 
                        onClick={() => updateField('parents_bride_mother_deceased', !eventData.parents_bride_mother_deceased)}
                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase transition-colors ${eventData.parents_bride_mother_deceased ? 'text-gray-400' : 'text-rose-200 hover:text-rose-400'}`}
                      >
                        <Cross size={10} /> En memoria
                      </button>
                    </div>
                    <input
                      type="text"
                      value={eventData.parents_bride_mother || ''}
                      onChange={(e) => updateField('parents_bride_mother', e.target.value)}
                      className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* PADRES BODA NOVIO */}
            {(showField('padre_novio') || showField('madre_novio')) && (
              <div className="space-y-4">
                {showField('padre_novio') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Padre del Novio</span>
                      <button 
                        onClick={() => updateField('parents_groom_father_deceased', !eventData.parents_groom_father_deceased)}
                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase transition-colors ${eventData.parents_groom_father_deceased ? 'text-gray-400' : 'text-rose-200 hover:text-rose-400'}`}
                      >
                        <Cross size={10} /> En memoria
                      </button>
                    </div>
                    <input
                      type="text"
                      value={eventData.parents_groom_father || ''}
                      onChange={(e) => updateField('parents_groom_father', e.target.value)}
                      className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                    />
                  </div>
                )}
                {showField('madre_novio') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Madre del Novio</span>
                      <button 
                        onClick={() => updateField('parents_groom_mother_deceased', !eventData.parents_groom_mother_deceased)}
                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase transition-colors ${eventData.parents_groom_mother_deceased ? 'text-gray-400' : 'text-rose-200 hover:text-rose-400'}`}
                      >
                        <Cross size={10} /> En memoria
                      </button>
                    </div>
                    <input
                      type="text"
                      value={eventData.parents_groom_mother || ''}
                      onChange={(e) => updateField('parents_groom_mother', e.target.value)}
                      className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* PADRES (XV, Bautizo, Graduación, Baby Shower) */}
            {(showField('padre') || showField('madre')) && (
              <div className="space-y-4">
                {showField('padre') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Padre</span>
                      <button 
                        onClick={() => updateField('parents_bride_father_deceased', !eventData.parents_bride_father_deceased)}
                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase transition-colors ${eventData.parents_bride_father_deceased ? 'text-gray-400' : 'text-rose-200 hover:text-rose-400'}`}
                      >
                        <Cross size={10} /> En memoria
                      </button>
                    </div>
                    <input
                      type="text"
                      value={eventData.parents_bride_father || ''}
                      onChange={(e) => updateField('parents_bride_father', e.target.value)}
                      className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                    />
                  </div>
                )}
                
                {showField('madre') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Madre</span>
                      <button 
                        onClick={() => updateField('parents_bride_mother_deceased', !eventData.parents_bride_mother_deceased)}
                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase transition-colors ${eventData.parents_bride_mother_deceased ? 'text-gray-400' : 'text-rose-200 hover:text-rose-400'}`}
                      >
                        <Cross size={10} /> En memoria
                      </button>
                    </div>
                    <input
                      type="text"
                      value={eventData.parents_bride_mother || ''}
                      onChange={(e) => updateField('parents_bride_mother', e.target.value)}
                      className="w-full bg-white border border-rose-100 p-3 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none"
                    />
                  </div>
                )}
              </div>
            )}
            
          </div>
        </section>
      )}

      {/* ── PADRINOS / MADRINAS ── */}
      {(showField('padrinos') || showField('padrino') || showField('madrina')) && (
        <section className="space-y-4">
          <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-rose-100 pb-2">
            <UserPlus size={14} /> 
            Padrinos
          </label>
          
          {showField('padrinos') && (
            <div className="space-y-4 mt-4">
              {(!eventData.padrinos_list || eventData.padrinos_list.length === 0) && (
                <p className="text-xs text-gray-400 italic">Aún no hay padrinos agregados.</p>
              )}
              {eventData.padrinos_list && eventData.padrinos_list.map((padrino, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 items-start bg-white border border-rose-100 rounded-2xl p-4 shadow-sm relative pt-6 md:pt-4">
                  <button 
                    onClick={() => {
                      const newList = [...(eventData.padrinos_list || [])];
                      newList.splice(index, 1);
                      updateField('padrinos_list', newList);
                    }}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Cross size={14} className="rotate-45" />
                  </button>
                  <div className="w-full md:w-1/3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Rol</span>
                    <select
                      value={padrino.rol || 'Padrino'}
                      onChange={(e) => {
                        const newList = [...(eventData.padrinos_list || [])];
                        newList[index].rol = e.target.value;
                        updateField('padrinos_list', newList);
                      }}
                      className="w-full bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none mt-1"
                    >
                      <option value="Padrino">Padrino</option>
                      <option value="Madrina">Madrina</option>
                      <option value="Padrino de Anillos">Padrino de Anillos</option>
                      <option value="Padrino de Lazo">Padrino de Lazo</option>
                      <option value="Padrino de Flores">Padrino de Flores</option>
                      <option value="Padrino de Brindis">Padrino de Brindis</option>
                      <option value="Padrinos de Velación">Padrinos de Velación</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="w-full md:w-2/3 pr-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Nombre(s)</span>
                    <input
                      type="text"
                      value={padrino.nombre || ''}
                      onChange={(e) => {
                        const newList = [...(eventData.padrinos_list || [])];
                        newList[index].nombre = e.target.value;
                        updateField('padrinos_list', newList);
                      }}
                      placeholder="Nombre..."
                      className="w-full bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs font-bold text-[#2d1b2d] outline-none mt-1"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newList = [...(eventData.padrinos_list || []), { rol: 'Padrino', nombre: '' }];
                  updateField('padrinos_list', newList);
                }}
                className="w-full bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-500 transition-colors rounded-xl py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-rose-100 border-dashed"
              >
                <UserPlus size={14} /> Agregar Padrino
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
