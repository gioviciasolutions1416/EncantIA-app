'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { 
    Users, Plus, Upload, Search, Trash2, Edit, Link as LinkIcon, 
    CheckCircle, Clock, XCircle, Share2, Loader2, Eye, Ticket, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
    id: string;
    title: string;
    slug: string;
    views: number;
}

interface Guest {
    id: string;
    name: string;
    passes: number;
    phone?: string;
    status: 'pending' | 'confirmed' | 'declined';
    notes?: string;
    created_at: string;
}

export default function InvitadosPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [guestsLoading, setGuestsLoading] = useState(false);
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        passes: 1,
        phone: '',
        notes: ''
    });
    
    // Stats calculation
    const totalGuests = guests.length;
    const totalPasses = guests.reduce((acc, curr) => acc + (curr.passes || 0), 0);
    const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
    const pendingCount = guests.filter(g => g.status === 'pending').length;

    const loadEvents = useCallback(async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
            .from('events')
            .select('id, title, slug, views')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
            setEvents(data);
            setSelectedEvent(data[0]); // Default to first event
        }
        setLoading(false);
    }, []);

    const loadGuests = useCallback(async (eventId: string) => {
        setGuestsLoading(true);
        const { data, error } = await supabase
            .from('guests')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setGuests(data as Guest[]);
        }
        setGuestsLoading(false);
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    useEffect(() => {
        if (selectedEvent?.id) {
            loadGuests(selectedEvent.id);
        } else {
            setGuests([]);
        }
    }, [selectedEvent, loadGuests]);

    const handleSaveGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;

        const dataToSave = {
            event_id: selectedEvent.id,
            name: formData.name,
            passes: Math.max(1, formData.passes),
            phone: formData.phone || null,
            notes: formData.notes || null,
        };

        try {
            if (editingGuest) {
                const { error } = await supabase
                    .from('guests')
                    .update(dataToSave)
                    .eq('id', editingGuest.id)
                    .select();
                if (error) throw error;
                toast.success('Invitado actualizado');
            } else {
                const { error } = await supabase
                    .from('guests')
                    .insert([{ ...dataToSave, status: 'pending' }])
                    .select();
                if (error) throw error;
                toast.success('Invitado agregado');
            }
            
            setIsAddModalOpen(false);
            setEditingGuest(null);
            setFormData({ name: '', passes: 1, phone: '', notes: '' });
            loadGuests(selectedEvent.id);
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar');
        }
    };

    const handleDeleteGuest = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este invitado?')) return;
        
        const { error } = await supabase.from('guests').delete().eq('id', id);
        if (!error) {
            toast.success('Invitado eliminado');
            if (selectedEvent) loadGuests(selectedEvent.id);
        } else {
            toast.error('Error al eliminar');
        }
    };

    const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedEvent) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const rows = text.split('\n');
            const list = [];
            
            for (let i = 1; i < rows.length; i++) { // Skip header
                const row = rows[i].split(',');
                if (row.length >= 1) {
                    const name = row[0].replace(/"/g, '').trim();
                    const passes = row[1] ? parseInt(row[1].trim()) : 1;
                    const phone = row[2] ? row[2].replace(/"/g, '').trim() : '';
                    if (name) {
                        list.push({ 
                            event_id: selectedEvent.id, 
                            name, 
                            passes: isNaN(passes) ? 1 : passes, 
                            phone: phone || null, 
                            status: 'pending' 
                        });
                    }
                }
            }
            if (list.length > 0) {
                const { error } = await supabase.from('guests').insert(list);
                if (error) {
                    toast.error('Error al importar CSV');
                } else {
                    toast.success(`Se importaron ${list.length} invitados`);
                    loadGuests(selectedEvent.id);
                }
            } else {
                toast.error('No se encontraron datos válidos');
            }
        };
        reader.readAsText(file);
    };

    const getGuestLink = (guestId: string) => {
        if (!selectedEvent) return '';
        return `https://encant-ia-app.vercel.app/invite/${selectedEvent.slug}?inv=${guestId}`;
    };

    const downloadQR = async (guestId: string, guestName: string) => {
        const url = getGuestLink(guestId);
        try {
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, url, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#2d1b2d',
                    light: '#fdfafc',
                },
            });
            const link = document.createElement('a');
            link.download = `QR-${guestName.replace(/\s+/g, '-')}.png`;
            link.href = canvas.toDataURL();
            link.click();
            toast.success(`QR de ${guestName} descargado`);
        } catch (err) {
            toast.error('Error al generar QR');
        }
    };

    const copyLink = (guestId: string) => {
        const url = getGuestLink(guestId);
        navigator.clipboard.writeText(url);
        toast.success('Link copiado al portapapeles');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFAFC]"><Loader2 className="animate-spin text-[#a35d6a]" size={36} /></div>;

    return (
        <div className="p-6 md:p-10 bg-[#FDFAFC] min-h-screen space-y-8 text-slate-800">
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link 
                        href="/dashboard"
                        className="flex items-center gap-2 text-[#a35d6a]/60 hover:text-[#a35d6a] transition-colors mb-2 text-[11px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} /> Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>Mis Invitados</h1>
                    <p className="text-xs text-[#a35d6a] font-bold uppercase tracking-widest mt-0.5">Gestión y Control de Accesos</p>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    {/* Selected Event Drodown */}
                    {events.length > 0 && (
                        <select 
                            value={selectedEvent?.id}
                            onChange={(e) => setSelectedEvent(events.find(ev => ev.id === e.target.value) || null)}
                            className="bg-white border border-rose-100 p-3 rounded-2xl text-xs font-black text-[#a35d6a] outline-none shadow-sm focus:ring-2 focus:ring-[#a35d6a]/10"
                        >
                            {events.map(e => (
                                <option key={e.id} value={e.id}>{e.title}</option>
                            ))}
                        </select>
                    )}

                    <div className="flex gap-2">
                        <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#f0dde3] text-[#7a5060] rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm cursor-pointer hover:bg-rose-50 transition-all">
                            <Upload size={14} /> Importar CSV
                            <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                        </label>
                        <button 
                            disabled={!selectedEvent}
                            onClick={() => { setEditingGuest(null); setFormData({ name: '', passes: 1, phone: '', notes: '' }); setIsAddModalOpen(true); }}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-300/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Plus size={14} /> Agregar Invitado
                        </button>
                    </div>
                </div>
            </div>

            {/* ── STATS CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Invitados', value: totalGuests, color: 'from-[#a35d6a] to-[#a35d6a]/80', icon: Users },
                    { label: 'Total Pases', value: totalPasses, color: 'from-[#7B2D8B] to-[#7B2D8B]/80', icon: Ticket },
                    { label: 'Confirmados', value: confirmedCount, color: 'from-emerald-500 to-emerald-600', icon: CheckCircle },
                    { label: 'Pendientes', value: pendingCount, color: 'from-amber-500 to-amber-600', icon: Clock },
                    { label: 'Vistas', value: selectedEvent ? selectedEvent.views : 0, color: 'from-blue-500 to-blue-600', icon: Eye },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-rose-100/40 shadow-[0_10px_30px_rgba(163,93,106,0.03)] flex flex-col justify-between h-28 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} filter blur-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                            <stat.icon size={16} className="text-slate-300" />
                        </div>
                        <span className="text-3xl font-black text-slate-900" style={{ fontFamily: stat.label === 'Vistas' ? 'sans-serif' : "'Playfair Display', serif" }}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* ── SEARCH & TABLE ── */}
            <div className="bg-white rounded-3xl border border-rose-100/50 shadow-[0_12px_40px_rgba(163,93,106,0.05)] overflow-hidden">
                <div className="p-5 border-b border-rose-50 flex items-center gap-3">
                    <Search size={16} className="text-[#a35d6a]/40" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-xs font-bold text-slate-700 outline-none placeholder:text-slate-300"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-rose-50/30 text-[#a35d6a] text-[9px] font-black uppercase tracking-widest border-b border-rose-100/50">
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Pases</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Link Personalizado</th>
                                <th className="px-6 py-4">QR</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-rose-50/40">
                            {guestsLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <Loader2 className="animate-spin text-[#a35d6a] mx-auto" size={24} />
                                    </td>
                                </tr>
                            ) : guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 text-slate-400 text-xs font-bold">
                                        No se encontraron invitados
                                    </td>
                                </tr>
                            ) : (
                                guests
                                    .filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
                                    .map(guest => (
                                    <tr key={guest.id} className="hover:bg-rose-50/10 transition-colors text-xs text-slate-700 font-bold">
                                        <td className="px-6 py-4">
                                            <p className="font-black text-slate-900 text-sm">{guest.name}</p>
                                            {guest.phone && <p className="text-[10px] text-slate-400 mt-0.5">{guest.phone}</p>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-black text-[10px]">{guest.passes}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {guest.status === 'confirmed' ? (
                                                <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-wider"><CheckCircle size={12} /> Confirmado</span>
                                            ) : guest.status === 'declined' ? (
                                                <span className="flex items-center gap-1 text-red-500 text-[10px] font-black uppercase tracking-wider"><XCircle size={12} /> No asiste</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-amber-500 text-[10px] font-black uppercase tracking-wider"><Clock size={12} /> Pendiente</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                <p className="truncate text-slate-400 font-medium text-[10px]">{getGuestLink(guest.id)}</p>
                                                <button onClick={() => copyLink(guest.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-[#a35d6a] transition-colors"><Share2 size={14} /></button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => downloadQR(guest.id, guest.name)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d1b2d] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#a35d6a] transition-colors"
                                            >
                                                <Ticket size={11} /> QR
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2 border-l border-rose-50 pl-2">
                                                <button 
                                                    onClick={() => {
                                                        setEditingGuest(guest);
                                                        setFormData({ name: guest.name, passes: guest.passes, phone: guest.phone || '', notes: guest.notes || '' });
                                                        setIsAddModalOpen(true);
                                                    }}
                                                    className="p-1.5 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors"
                                                ><Edit size={16} /></button>
                                                <button 
                                                    onClick={() => handleDeleteGuest(guest.id)}
                                                    className="p-1.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                                                ><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── ADD/EDIT MODAL ── */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                            className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative z-10 space-y-5 border border-rose-100"
                        >
                            <div className="text-center">
                                <h3 className="text-xl font-black text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Completa la información</p>
                            </div>

                            <form onSubmit={handleSaveGuest} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-[#a35d6a]/80 tracking-widest pl-1">Nombre</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#fdfafc] border border-rose-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none" 
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase text-[#a35d6a]/80 tracking-widest pl-1">Pases</label>
                                        <input 
                                            type="number" 
                                            required
                                            min={1}
                                            value={formData.passes}
                                            onChange={e => setFormData({ ...formData, passes: parseInt(e.target.value) })}
                                            className="w-full bg-[#fdfafc] border border-rose-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none text-center" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black uppercase text-[#a35d6a]/80 tracking-widest pl-1">Teléfono</label>
                                        <input 
                                            type="text" 
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-[#fdfafc] border border-rose-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none" 
                                            placeholder="5551234567"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-[#a35d6a]/80 tracking-widest pl-1">Notas (Opcional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full bg-[#fdfafc] border border-rose-100 p-3 rounded-2xl text-xs font-bold text-slate-700 outline-none" 
                                        placeholder="Ej: Solo adultos, etc."
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-300/30 active:scale-95 transition-transform mt-2"
                                >
                                    {editingGuest ? 'Guardar Cambios' : 'Registrar'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
