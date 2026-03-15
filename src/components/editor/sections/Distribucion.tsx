'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Share2, 
  Copy, 
  QrCode, 
  Download,
  MessageCircle,
  ExternalLink,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

export default function Distribucion() {
  const { eventData } = useEditor();
  const [copied, setCopied] = React.useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const inviteUrl = `${baseUrl}/invite/${eventData.slug}`;

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

  return (
    <div className="space-y-10">
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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-rose-50/30 p-8 rounded-[2.5rem] border border-rose-100">
        <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
           <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#a35d6a] shadow-sm">
             <QrCode size={20} />
           </div>
           <div className="space-y-1">
             <h4 className="text-[11px] font-black uppercase text-[#a35d6a] tracking-[0.2em]">Código QR Personalizado</h4>
             <p className="text-[10px] text-[#7a5060] font-medium leading-relaxed max-w-[240px]">
               Ideal para imprimirlo en sobres físicos o mostrarlo en pases impresos para el ingreso rápido (Check-in).
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
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-white">
            <QRCodeCanvas 
              id="invitation-qr"
              value={inviteUrl}
              size={160}
              level="H"
              includeMargin={false}
              fgColor="#2d1b2d"
            />
          </div>
        </div>
      </section>
      
      {/* ── PREVIEW RÁPIDO ── */}
      <div className="bg-gray-900 p-6 rounded-[2.5rem] text-white flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
              <ExternalLink size={18} className="text-rose-200" />
            </div>
            <div className="space-y-0.5">
               <span className="text-[9px] font-bold text-rose-200/50 uppercase tracking-widest">Vista Previa</span>
               <p className="text-[11px] font-medium">Ver cómo lo ven mis invitados</p>
            </div>
         </div>
         <a 
            href={inviteUrl} 
            target="_blank"
            className="px-5 py-2.5 bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-colors"
         >
           Abrir Enlace
         </a>
      </div>
    </div>
  );
}
