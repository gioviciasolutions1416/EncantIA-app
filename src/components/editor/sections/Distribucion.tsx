'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Share2, 
  Copy, 
  QrCode, 
  Download,
  MessageCircle,
  ExternalLink,
  Check,
  UserPlus,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Guest,
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestsSummary,
} from '@/lib/editor-supabase';

export default function Distribucion() {
  const { eventData } = useEditor();
  const [copied, setCopied] = React.useState(false);
  
  // Estados de Invitados
  const [guests, setGuests] = useState<Guest[]>([]);
  const [summary, setSummary] = useState({
    total_invitados: 0,
    total_pases: 0,
    confirmados: 0,
    pendientes: 0,
    declinados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form nuevo invitado
  const [form, setForm] = useState({
    name: '',
    passes: 1,
    phone: '',
    notes: '',
  });

  // Invitado en edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const inviteUrl = `${baseUrl}/invite/${eventData.slug}`;

  const loadData = useCallback(async () => {
    if (!eventData?.id || eventData.id === 'local-test') return;
    setLoading(true);
    const [guestsData, summaryData] = await Promise.all([
      getGuests(eventData.id),
      getGuestsSummary(eventData.id),
    ]);
    setGuests(guestsData);
    setSummary(summaryData);
    setLoading(false);
  }, [eventData?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async () => {
    if (!form.name.trim() || !eventData?.id) return;
    setSaving(true);
    const newGuest = await createGuest({
      event_id: eventData.id,
      name: form.name.trim(),
      passes: form.passes,
      passes_used: 0,
      phone: form.phone.trim(),
      rsvp_status: 'pending',
      notes: form.notes.trim(),
    });
    if (newGuest) {
      setForm({ name: '', passes: 1, phone: '', notes: '' });
      await loadData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este invitado?')) return;
    await deleteGuest(id);
    await loadData();
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    setSaving(true);
    await updateGuest(editingId, editForm);
    setEditingId(null);
    setEditForm({});
    await loadData();
    setSaving(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`¡Hola! Te invito a mi evento: ${inviteUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const downloadQR = () => {
    const canvas = document.getElementById('invitation-qr') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR-${eventData.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColor = (status: string) => {
    if (status === 'confirmed') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (status === 'declined') return 'text-red-500 bg-red-50 border-red-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
  };

  const statusLabel = (status: string) => {
    if (status === 'confirmed') return 'Confirmado';
    if (status === 'declined') return 'Declinó';
    return 'Pendiente';
  };

  return (
    <div className="space-y-10 pb-10">

      {/* ── ENLACE ESTRATÉGICO ── */}
      <section className="bg-white border border-rose-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-[#a35d6a] shadow-inner">
          <Share2 size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¡Tu diseño está listo!
          </h3>
          <p className="text-xs text-gray-400 font-medium max-w-[300px]">
            Copia el enlace o genera el código QR para compartir tu invitación por WhatsApp, Instagram o Facebook.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="flex items-center gap-2 bg-[#fdfafc] p-4 rounded-2xl border border-rose-100 overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 truncate flex-1 text-left">
              {inviteUrl}
            </span>
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-xl transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-white text-[#a35d6a] hover:bg-rose-50 border border-rose-100'}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          
          <button
            onClick={shareWhatsApp}
            className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-3 shadow-lg shadow-green-100 hover:scale-[1.02] transition-transform"
          >
            <MessageCircle size={18} /> Compartir por WhatsApp
          </button>
        </div>
      </section>

      {/* ── CÓDIGO QR ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-rose-50/10 p-8 rounded-[2.5rem] border border-rose-100/50">
        <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
           <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#a35d6a] shadow-sm">
             <QrCode size={20} />
           </div>
           <div className="space-y-1">
             <h4 className="text-[11px] font-black uppercase text-[#a35d6a] tracking-[0.2em]">Código QR Personalizado</h4>
             <p className="text-[10px] text-[#7a5060] font-medium leading-relaxed max-w-[240px]">
               Ideal para imprimirlo en sobres físicos o morderlos en pases impresos.
             </p>
           </div>
           <button
             onClick={downloadQR}
             className="mt-2 flex items-center gap-2 px-6 py-3 bg-white border border-rose-100 text-[#a35d6a] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-rose-50 transition-colors"
           >
             <Download size={14} /> Descargar QR
           </button>
        </div>

        <div className="flex justify-center">
          <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-white">
            <QRCodeCanvas 
              id="invitation-qr"
              value={inviteUrl}
              size={140}
              level="H"
              includeMargin={false}
              fgColor="#2d1b2d"
            />
          </div>
        </div>
      </section>

      {/* ── GESTIÓN DE INVITADOS ── */}
      <section className="space-y-6">
        <div className="border-b border-rose-100 pb-2">
            <h3 className="text-[12px] font-black text-[#a35d6a] uppercase tracking-[0.2em] flex items-center gap-2">
               <UserPlus size={16} /> Distribución de Pases
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Administra tu lista de invitados y sus pases.</p>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Invitados', value: summary.total_invitados },
            { label: 'Pases Totales', value: summary.total_pases },
            { label: 'Confirmados', value: summary.confirmados },
            { label: 'Pendientes', value: summary.pendientes },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-rose-50 rounded-3xl p-4 text-center shadow-sm">
              <div className="text-2xl font-black text-[#a35d6a]">{s.value}</div>
              <div className="text-[8px] text-gray-400 uppercase font-black tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Formulario nuevo invitado */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 space-y-4 shadow-sm">
          <p className="text-[10px] font-black text-[#a35d6a]/60 uppercase tracking-widest">Agregar Invitado</p>
          <input
            type="text"
            placeholder="Nombre o familia *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-xs border border-rose-50 bg-rose-50/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#a35d6a] font-medium"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 mb-1 block uppercase">Pases</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.passes}
                onChange={(e) => setForm({ ...form, passes: parseInt(e.target.value) || 1 })}
                className="w-full text-xs border border-rose-50 bg-rose-50/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#a35d6a] font-bold"
              />
            </div>
            <div className="flex-1">
              <label className="text-[9px] font-bold text-gray-400 mb-1 block uppercase">WhatsApp</label>
              <input
                type="text"
                placeholder="521..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full text-xs border border-rose-50 bg-rose-50/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#a35d6a]"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Notas (mesa, menú...)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full text-xs border border-rose-50 bg-rose-50/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#a35d6a]"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !form.name.trim()}
            className="w-full bg-[#a35d6a] hover:bg-[#8f4d5a] text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-xl disabled:opacity-40 transition-colors shadow-lg shadow-rose-100"
          >
            {saving ? 'Guardando...' : '+ Agregar Invitado'}
          </button>
        </div>

        {/* Lista de invitados */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-xs text-gray-400 py-6">Cargando invitados...</p>
          ) : guests.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6">Aún no has agregado invitados.</p>
          ) : (
            guests.map((guest) => (
              <div key={guest.id} className="bg-white border border-rose-100/50 rounded-2xl p-4 shadow-sm">
                {editingId === guest.id ? (
                  // Modo edición
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full text-xs border border-rose-100 rounded-xl px-3 py-2 focus:outline-none focus:border-[#a35d6a] font-medium"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        value={editForm.passes || 1}
                        onChange={(e) => setEditForm({ ...editForm, passes: parseInt(e.target.value) || 1 })}
                        className="w-20 text-xs border border-rose-100 rounded-xl px-3 py-2 focus:outline-none focus:border-[#a35d6a] font-bold"
                      />
                      <select
                        value={editForm.rsvp_status || 'pending'}
                        onChange={(e) => setEditForm({ ...editForm, rsvp_status: e.target.value as Guest['rsvp_status'] })}
                        className="flex-1 text-xs border border-rose-100 rounded-xl px-3 py-2 focus:outline-none focus:border-[#a35d6a] font-bold cursor-pointer"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="declined">Declinó</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Notas"
                      value={editForm.notes || ''}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      className="w-full text-xs border border-rose-100 rounded-xl px-3 py-2 focus:outline-none focus:border-[#a35d6a]"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleEditSave} disabled={saving} className="flex-1 bg-[#a35d6a] text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-xl disabled:opacity-40">Guardar</button>
                      <button onClick={() => { setEditingId(null); setEditForm({}); }} className="flex-1 bg-rose-50 text-gray-500 text-[10px] font-black uppercase tracking-widest py-2 rounded-xl">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  // Modo visualización
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#2d1b2d] truncate">{guest.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 font-medium">🎟 {guest.passes} pases</span>
                        {guest.phone && <span className="text-[10px] text-gray-400 font-medium">📱 {guest.phone}</span>}
                      </div>
                      {guest.notes && <p className="text-[9px] text-rose-400 font-medium mt-0.5 truncate bg-rose-50/40 px-2 py-0.5 rounded-lg inline-block">{guest.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${statusColor(guest.rsvp_status)}`}>
                        {statusLabel(guest.rsvp_status)}
                      </span>
                      <button onClick={() => { setEditingId(guest.id!); setEditForm(guest); }} className="text-gray-400 hover:text-[#a35d6a] transition-colors p-1">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(guest.id!)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── PREVIEW RÁPIDO ── */}
      <div className="bg-[#2d1b2d] p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl mt-4">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
              <ExternalLink size={18} className="text-rose-200" />
            </div>
            <div className="space-y-0.5">
               <span className="text-[8px] font-bold text-rose-200/50 uppercase tracking-widest">Vista Previa</span>
               <p className="text-[11px] font-medium">Ver cómo lo ven mis invitados</p>
            </div>
         </div>
         <a href={inviteUrl} target="_blank" className="px-5 py-2.5 bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-colors">
           Abrir Enlace
         </a>
      </div>

    </div>
  );
}
