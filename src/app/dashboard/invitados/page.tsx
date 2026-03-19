'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { Users, Plus, Upload, Search, Trash2, Edit, CheckCircle, Clock, XCircle, Share2, Loader2, Eye, Ticket, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Event { id: string; title: string; slug: string; views: number; cover_image_url?: string; }
interface Guest { id: string; name: string; passes: number; phone?: string; status: 'pending' | 'confirmed' | 'declined'; notes?: string; created_at: string; }

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['from-[#a35d6a] to-[#7B2D8B]', 'from-blue-400 to-blue-600', 'from-emerald-400 to-emerald-600', 'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-black text-sm shrink-0`}>
      {initials}
    </div>
  );
}

export default function InvitadosPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({ name: '', passes: 1, phone: '', notes: '' });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');

  const totalGuests = guests.length;
  const totalPasses = guests.reduce((acc, curr) => acc + (curr.passes || 0), 0);
  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;
  const confirmRate = totalGuests > 0 ? Math.round((confirmedCount / totalGuests) * 100) : 0;

  const filteredGuests = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || g.status === filter;
    return matchSearch && matchFilter;
  });

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase.from('events').select('id, title, slug, views, cover_image_url').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (!error && data && data.length > 0) { setEvents(data); setSelectedEvent(data[0]); }
    setLoading(false);
  }, []);

  const loadGuests = useCallback(async (eventId: string) => {
    setGuestsLoading(true);
    const { data, error } = await supabase.from('guests').select('*').eq('event_id', eventId).order('created_at', { ascending: false });
    if (!error && data) setGuests(data as Guest[]);
    setGuestsLoading(false);
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);
  useEffect(() => { if (selectedEvent?.id) loadGuests(selectedEvent.id); else setGuests([]); }, [selectedEvent, loadGuests]);

  const handleSaveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    const dataToSave = { event_id: selectedEvent.id, name: formData.name, passes: Math.max(1, formData.passes), phone: formData.phone || null, notes: formData.notes || null };
    try {
      if (editingGuest) {
        const { error } = await supabase.from('guests').update(dataToSave).eq('id', editingGuest.id).select();
        if (error) throw error;
        toast.success('Invitado actualizado');
      } else {
        const { error } = await supabase.from('guests').insert([{ ...dataToSave, status: 'pending' }]).select();
        if (error) throw error;
        toast.success('Invitado agregado');
      }
      setIsAddModalOpen(false); setEditingGuest(null); setFormData({ name: '', passes: 1, phone: '', notes: '' });
      loadGuests(selectedEvent.id);
    } catch (error: any) { toast.error(error.message || 'Error al guardar'); }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('¿Eliminar este invitado?')) return;
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) { toast.success('Invitado eliminado'); if (selectedEvent) loadGuests(selectedEvent.id); }
    else toast.error('Error al eliminar');
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEvent) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n');
      const list = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        if (row.length >= 1) {
          const name = row[0].replace(/"/g, '').trim();
          const passes = row[1] ? parseInt(row[1].trim()) : 1;
          const phone = row[2] ? row[2].replace(/"/g, '').trim() : '';
          if (name) list.push({ event_id: selectedEvent.id, name, passes: isNaN(passes) ? 1 : passes, phone: phone || null, status: 'pending' });
        }
      }
      if (list.length > 0) {
        const { error } = await supabase.from('guests').insert(list);
        if (error) toast.error('Error al importar CSV');
        else { toast.success(`${list.length} invitados importados`); loadGuests(selectedEvent.id); }
      } else toast.error('No se encontraron datos válidos');
    };
    reader.readAsText(file);
  };

  const getGuestLink = (guestId: string) => selectedEvent ? `https://encant-ia-app.vercel.app/invite/${selectedEvent.slug}?inv=${guestId}` : '';

  const downloadQR = async (guestId: string, guestName: string) => {
    const url = getGuestLink(guestId);
    try {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, url, { width: 400, margin: 2, color: { dark: '#2d1b2d', light: '#fdfafc' } });
      const link = document.createElement('a');
      link.download = `QR-${guestName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success(`QR descargado`);
    } catch { toast.error('Error al generar QR'); }
  };

  const copyLink = (guestId: string) => {
    navigator.clipboard.writeText(getGuestLink(guestId));
    toast.success('Link copiado');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFAFC]"><Loader2 className="animate-spin text-[#a35d6a]" size={36} /></div>;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confirmRate / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── HERO HEADER ── */}
      <div className="relative h-48 overflow-hidden">
        {selectedEvent?.cover_image_url ? (
          <img src={selectedEvent.cover_image_url} className="w-full h-full object-cover" alt="" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #a35d6a 0%, #7B2D8B 100%)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        
        {/* Barra de progreso global */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confirmRate}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
          />
        </div>

        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[11px] font-black uppercase tracking-widest w-fit">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div className="flex items-end justify-between">
            <div>
              {selectedEvent && (
                <select
                  value={selectedEvent.id}
                  onChange={(e) => setSelectedEvent(events.find(ev => ev.id === e.target.value) || null)}
                  className="bg-transparent text-white/60 text-[10px] font-black uppercase tracking-widest outline-none mb-1 cursor-pointer"
                >
                  {events.map(e => <option key={e.id} value={e.id} className="text-black">{e.title}</option>)}
                </select>
              )}
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Lista de Invitados</h1>
            </div>
            {/* Mini gráfico circular */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                <circle cx="50" cy="50" r={radius} fill="none" stroke="white" strokeWidth="10"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" className="transition-all duration-700" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-white">{confirmRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total', value: totalGuests, color: '#6366f1', filter: 'all' as const },
            { label: 'Confirmados', value: confirmedCount, color: '#10b981', filter: 'confirmed' as const },
            { label: 'Pendientes', value: pendingCount, color: '#f59e0b', filter: 'pending' as const },
            { label: 'Declinaron', value: declinedCount, color: '#ef4444', filter: 'declined' as const },
          ].map((stat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setFilter(filter === stat.filter ? 'all' : stat.filter)}
              className={`bg-white rounded-2xl p-3 shadow-lg border-2 transition-all text-left ${filter === stat.filter ? 'border-current scale-105' : 'border-transparent'}`}
              style={{ borderColor: filter === stat.filter ? stat.color : 'transparent' }}
            >
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black" style={{ color: stat.color, fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="px-4 mt-4 flex items-center gap-2">
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 px-3 py-2.5">
          <Search size={14} className="text-gray-300 shrink-0" />
          <input type="text" placeholder="Buscar invitado..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-xs font-bold text-slate-700 outline-none placeholder:text-gray-300" />
        </div>
        <label className="w-10 h-10 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 cursor-pointer hover:text-[#a35d6a] transition-colors shrink-0">
          <Upload size={16} />
          <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
        </label>
      </div>

      {/* ── LISTA ── */}
      <div className="px-4 mt-4 pb-28 space-y-2">
        {guestsLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-[#a35d6a]" size={24} /></div>
        ) : filteredGuests.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Users size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-black text-gray-300">Sin invitados</p>
            <p className="text-xs text-gray-200 mt-1">Agrega tu primer invitado</p>
          </div>
        ) : (
          filteredGuests.map((guest, i) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar name={guest.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-black text-slate-900 truncate">{guest.name}</p>
                    {guest.status === 'confirmed' ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase bg-emerald-50 px-2 py-1 rounded-full shrink-0"><CheckCircle size={9} /> OK</span>
                    ) : guest.status === 'declined' ? (
                      <span className="flex items-center gap-1 text-red-500 text-[9px] font-black uppercase bg-red-50 px-2 py-1 rounded-full shrink-0"><XCircle size={9} /> No</span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-500 text-[9px] font-black uppercase bg-amber-50 px-2 py-1 rounded-full shrink-0"><Clock size={9} /> Pendiente</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {guest.phone && <p className="text-[10px] text-gray-400">{guest.phone}</p>}
                    <span className="flex items-center gap-1 text-[10px] text-[#a35d6a] font-bold">
                      <Ticket size={10} /> {guest.passes} {guest.passes === 1 ? 'pase' : 'pases'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu(activeMenu === guest.id ? null : guest.id)}
                  className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-[#a35d6a] transition-colors shrink-0"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Menu de acciones */}
              <AnimatePresence>
                {activeMenu === guest.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-50">
                      <button onClick={() => copyLink(guest.id)} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors">
                        <Share2 size={14} className="text-[#a35d6a]" />
                        <span className="text-[8px] font-black text-gray-400 uppercase">Link</span>
                      </button>
                      <button onClick={() => downloadQR(guest.id, guest.name)} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-[#2d1b2d] group transition-colors">
                        <Ticket size={14} className="text-[#2d1b2d] group-hover:text-white transition-colors" />
                        <span className="text-[8px] font-black text-gray-400 group-hover:text-white uppercase transition-colors">QR</span>
                      </button>
                      <button onClick={() => { setEditingGuest(guest); setFormData({ name: guest.name, passes: guest.passes, phone: guest.phone || '', notes: guest.notes || '' }); setIsAddModalOpen(true); setActiveMenu(null); }} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                        <Edit size={14} className="text-blue-400" />
                        <span className="text-[8px] font-black text-gray-400 uppercase">Editar</span>
                      </button>
                      <button onClick={() => handleDeleteGuest(guest.id)} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} className="text-red-400" />
                        <span className="text-[8px] font-black text-gray-400 uppercase">Borrar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* ── FAB ── */}
      <button
        disabled={!selectedEvent}
        onClick={() => { setEditingGuest(null); setFormData({ name: '', passes: 1, phone: '', notes: '' }); setIsAddModalOpen(true); }}
        className="fixed bottom-6 right-4 z-50 flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white rounded-2xl shadow-2xl shadow-rose-300/40 font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
      >
        <Plus size={16} /> Agregar
      </button>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative z-10 space-y-4 border border-rose-100"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto sm:hidden" />
              <div>
                <h3 className="text-lg font-black text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Completa la información</p>
              </div>
              <form onSubmit={handleSaveGuest} className="space-y-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-[#a35d6a]/70 tracking-widest pl-1 mb-1 block">Nombre completo *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-[#a35d6a] transition-colors" placeholder="Ej: Juan Pérez" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-[#a35d6a]/70 tracking-widest pl-1 mb-1 block">Pases</label>
                    <input type="number" required min={1} value={formData.passes} onChange={e => setFormData({ ...formData, passes: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none text-center focus:border-[#a35d6a] transition-colors" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-[#a35d6a]/70 tracking-widest pl-1 mb-1 block">Teléfono</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-[#a35d6a] transition-colors" placeholder="55..." />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-[#a35d6a]/70 tracking-widest pl-1 mb-1 block">Notas</label>
                  <input type="text" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-gray-50 border border-gray-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-[#a35d6a] transition-colors" placeholder="Mesa, menú, etc." />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  {editingGuest ? 'Guardar Cambios' : '+ Registrar Invitado'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
