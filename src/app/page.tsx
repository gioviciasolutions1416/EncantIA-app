"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Check, X, Sparkles, Layout, Palette, CreditCard, Send, Menu, MapPin, Heart, Clock } from "lucide-react";

/** 
 * GIOVIS LANDING PAGE - ESPECTACULAR VERSION
 * Based on provided reference images
 */

const StarSparkle = ({ style }: { style?: React.CSSProperties }) => null; // Removed sparkles per user request

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("translate-y-0", "opacity-100");
          entry.target.classList.remove("translate-y-10", "opacity-0");
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8e8ee] text-dark selection:bg-rose/20 relative overflow-hidden">
      {/* Falling Petals Background Layer */}
      <FallingPetals />

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
        }`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="EncantIA Invitaciones"
              className="mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              style={{
                height: isScrolled ? '64px' : '88px',
                width: 'auto',
                transition: 'all 0.35s ease',
              }}
            />
          </Link>

          {/* Desktop Nav - centered */}
          <div className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
            <Link href="#ejemplos" className="text-sm font-semibold text-dark/70 hover:text-[#a35d6a] transition-colors">Ejemplos</Link>
            <Link href="#planes" className="text-sm font-semibold text-dark/70 hover:text-[#a35d6a] transition-colors">Planes</Link>
            <Link href="#faq" className="text-sm font-semibold text-dark/70 hover:text-[#a35d6a] transition-colors">FAQ</Link>
            <Link href="#contacto" className="text-sm font-semibold text-dark/70 hover:text-[#a35d6a] transition-colors">Contacto</Link>
          </div>

          {/* Right side button */}
          <div className="hidden md:flex items-center">
            <Link href="/login" className="bg-[#e65c7b] hover:bg-[#d44e6d] text-white px-8 py-3 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-[#e65c7b]/30">
              Iniciar sesión
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-[#a35d6a]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-blush py-8 px-6 flex flex-col space-y-5 animate-fade-in-down">
            <Link href="#ejemplos" className="text-xl font-bold p-2" onClick={() => setMobileMenuOpen(false)}>Ejemplos</Link>
            <Link href="#planes" className="text-xl font-bold p-2" onClick={() => setMobileMenuOpen(false)}>Planes</Link>
            <Link href="#faq" className="text-xl font-bold p-2" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="#contacto" className="text-xl font-bold p-2" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
            <Link href="/login" className="bg-[#e65c7b] text-white text-center py-4 rounded-2xl font-bold text-lg" onClick={() => setMobileMenuOpen(false)}>
              Iniciar sesión
            </Link>
          </div>
        )}
      </nav>

      {/* 2. HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-[#fbf9f6] pt-[72px]"
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: `64px 64px`
          }}
        />

        {/* Ambient glows and sparkles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Soft color blobs simulating glow */}
          <div className="absolute top-[5%] left-[5%] w-[35vh] h-[35vh] bg-[#a35d6a]/10 blur-[80px] rounded-full" />
          <div className="absolute top-[30%] right-[5%] w-[45vh] h-[45vh] bg-orange-200/20 blur-[90px] rounded-full" />
          <div className="absolute bottom-[10%] left-[20%] w-[40vh] h-[40vh] bg-pink-100/20 blur-[80px] rounded-full" />

          {/* Sparkles */}
          <StarSparkle style={{ top: '15%', left: '25%', transform: 'scale(1.1) rotate(15deg)' }} />
          <StarSparkle style={{ top: '40%', left: '8%', transform: 'rotate(45deg)' }} />
          <StarSparkle style={{ top: '22%', right: '18%', transform: 'scale(0.85) rotate(-15deg)' }} />
          <StarSparkle style={{ top: '55%', right: '8%', transform: 'scale(1.3) rotate(30deg)' }} />
          <StarSparkle style={{ top: '75%', right: '28%', transform: 'scale(1.5)' }} />
          <StarSparkle style={{ top: '65%', left: '32%', transform: 'scale(0.9) rotate(22deg)' }} />
          <StarSparkle style={{ bottom: '15%', right: '15%', transform: 'rotate(-45deg)' }} />
        </div>

        <div className="w-full max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 py-10">

            {/* LEFT: Text */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[#2d1b2d] leading-[1.3] tracking-tight mb-5">
                Crea tu <br />
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(90deg, #7B2D8B, #b76e79, #c8976a, #7B2D8B)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 4s linear infinite',
                  paddingRight: '8px',
                  fontStyle: 'italic',
                }}>invitación digital</span>
                inteligente
              </h1>

              <p className="text-sm md:text-base text-[#7a5060] max-w-sm mb-8 leading-relaxed">
                Bodas, XV Años, Bautizos, Baby Showers y más — experiencias digitales que tus invitados nunca olvidarán.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/login" className="relative overflow-hidden group bg-[#a35d6a] hover:bg-[#8e4f5a] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-[#a35d6a]/25 hover:-translate-y-0.5">
                  <span className="relative z-10">Comenzar gratis</span>
                  {/* Subtle shine sweep effect */}
                  <div className="absolute inset-0 -translate-x-[150%] skew-x-[-30deg] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
                </Link>
                <Link href="#ejemplos" className="text-[#a35d6a] border border-[#a35d6a]/30 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:bg-rose/5">
                  Ver ejemplos →
                </Link>
              </div>
            </div>

            {/* RIGHT: Phone mockup with Parallax */}
            <div
              className="w-full lg:w-1/2 flex items-center justify-center relative transition-transform duration-200 ease-out"
            >
              {/* Soft glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[80%] bg-[#b76e79]/10 rounded-[60px] blur-[60px] -z-10 animate-pulse"></div>

              {/* Phone Frame */}
              <div className="relative w-[320px] h-[660px] lg:w-[340px] lg:h-[700px] bg-[#2d1b2d] rounded-[52px] border-[8px] border-[#2d1b2d] shadow-2xl overflow-hidden flex-shrink-0 relative group">
                <div className="absolute top-0 inset-x-0 h-[24px] flex justify-center z-50">
                  <div className="w-[120px] h-[24px] bg-[#2d1b2d] rounded-b-[18px]"></div>
                </div>
                {/* Screen */}
                <div className="w-full h-full rounded-[37px] overflow-hidden bg-slate-100 relative">
                  <ImageCarousel />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-white/5 z-20" />
                </div>
                {/* Side buttons */}
                <div className="absolute left-[-2px] top-16 w-[3px] h-8 bg-white/10 rounded-r" />
                <div className="absolute left-[-2px] top-28 w-[3px] h-14 bg-white/10 rounded-r" />
                <div className="absolute right-[-2px] top-24 w-[3px] h-14 bg-white/10 rounded-l" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. COMPARATIVA */}
      <section id="ejemplos" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-10 opacity-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-playfair font-bold mb-4 text-dark tracking-tight">¿Por qué <span className="text-[#a35d6a] italic">digital</span>?</h2>
            <div className="w-16 h-1 bg-[#a35d6a]/20 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <BenefitComparison />
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA */}
      <section className="py-20 bg-[#fffafa]">
        <div className="container mx-auto px-6 md:px-12 reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-10 opacity-0 delay-100">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-playfair font-bold mb-3 text-dark">¿Cómo funciona?</h2>
            <p className="text-dark/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed italic">Cuatro pasos sencillos para que tu invitación sea mágica</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative max-w-5xl mx-auto">
            {/* Connection line (desktop) */}
            <div className="hidden md:block absolute top-[38px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[#a35d6a]/20 to-transparent"></div>

            {[
              { title: "Crea tu invitación", icon: <Layout size={28} />, step: "01", desc: "Ingresa los detalles de tu evento en minutos." },
              { title: "Personaliza el diseño", icon: <Palette size={28} />, step: "02", desc: "Elige temas, colores, fotos y música." },
              { title: "Elige tu plan", icon: <CreditCard size={28} />, step: "03", desc: "Pago único sin suscripciones sorpresas." },
              { title: "Comparte", icon: <Send size={28} />, step: "04", desc: "Envía el link por WhatsApp a tus invitados." }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-[24px] bg-white shadow-xl border border-blush flex items-center justify-center text-[#a35d6a] mb-5 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 relative">
                  <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#a35d6a] text-white flex items-center justify-center text-[10px] font-bold shadow-lg border-2 border-white">
                    {s.step}
                  </div>
                  {s.icon}
                </div>
                <h3 className="text-base font-playfair font-bold mb-2 text-dark">{s.title}</h3>
                <p className="text-dark/50 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECCION IA (NEW VERSION) */}
      <section className="py-20 bg-[#2d1b2d] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7B2D8B]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#a35d6a]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-10 opacity-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 bg-[#7B2D8B]/30 border border-white/10 text-rose-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest">
                <Sparkles size={12} /> TECNOLOGÍA PROPIA
              </span>
              <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-5 leading-[1.15]">
                Diseño con <br />
                <span className="text-[#a35d6a] italic">Inteligencia Artificial</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg">
                Describe el evento de tus sueños con tus propias palabras y nuestra IA creará una invitación personalizada en segundos. Sin necesidad de diseñar nada.
              </p>
              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                {[
                  { t: "Cero esfuerzo", d: "Pide el estilo que quieras" },
                  { t: "Resultados únicos", d: "Temas irrepetibles" },
                  { t: "Ahorro total", d: "Sin pagar diseñador" },
                  { t: "Edición instantánea", d: "Cambia con un clic" }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-rose group-hover:bg-[#a35d6a] transition-colors flex-shrink-0">
                        <Check size={14} />
                      </div>
                      <h4 className="font-bold text-sm">{item.t}</h4>
                    </div>
                    <p className="text-white/40 text-xs pl-9">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group perspective-1000">
              {/* IA Chat Mockup */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-rose/40"></div>
                  <div className="w-3 h-3 rounded-full bg-rose/20"></div>
                  <div className="w-3 h-3 rounded-full bg-rose/10"></div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-rose/20 flex items-center justify-center text-rose flex-shrink-0 text-sm">✨</div>
                    <div className="bg-white/10 rounded-xl p-3 text-xs text-white/80 rounded-tl-none">
                      ¿Qué estilo buscas para tu evento?
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-7 h-7 rounded-full bg-primary/40 flex items-center justify-center text-white flex-shrink-0 text-sm">👤</div>
                    <div className="bg-[#a35d6a]/40 rounded-xl p-4 text-sm text-white font-medium italic rounded-tr-none border border-white/10">
                      "Quiero una invitación de boda vintage en tonos perla y oliva, con caligrafía hecha a mano..."
                      <span className="inline-block w-1.5 h-4 bg-white animate-pulse ml-1 align-middle"></span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]">
                  <Sparkles size={18} className="animate-pulse" /> Generar con IA
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PLANES */}
      <section id="planes" className="min-h-screen flex flex-col justify-center pt-[72px] pb-12 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-10 reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-6 opacity-0">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-2 text-dark italic">Planes simples</h2>
            <p className="text-dark/40 text-[15px] font-medium">Pago único. Sin suscripciones sorpresas.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1300px] mx-auto items-stretch">
            {/* Prueba */}
            <div className="reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-12 opacity-0 p-6 md:p-7 rounded-[32px] glass hover:bg-white/40 border border-white/50 shadow-xl hover:shadow-2xl group flex flex-col hover:-translate-y-2">
              <h3 className="text-xl font-playfair font-bold mb-1 text-dark">Prueba</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl lg:text-4xl font-bold text-dark">Gratis</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-grow">
                {["Borrador (No publicable)", "Personalización completa", "1 invitación digital (Demo)", "1 tema de IA incluido", "Mapa con GPS", "Mesa de regalos"].map((f, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-dark/70 font-medium leading-tight">
                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3 border-2 border-[#a35d6a]/20 text-[#a35d6a] font-bold rounded-xl text-center text-[13px] group-hover:bg-[#a35d6a] group-hover:text-white transition-all">
                Probar gratis
              </Link>
            </div>

            {/* Plata */}
            <div className="reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-12 opacity-0 delay-100 p-6 md:p-7 rounded-[32px] glass hover:bg-white/40 border border-white/50 shadow-xl hover:shadow-2xl group flex flex-col hover:-translate-y-2">
              <h3 className="text-xl font-playfair font-bold mb-1 text-dark">Plata</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl lg:text-4xl font-bold text-dark">$299</span>
                <span className="text-dark/30 text-xs font-bold uppercase tracking-widest">MXN</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-grow">
                {["Publicación habilitada", "Todo lo de Prueba, más:", "Creación temas con IA", "Sistema de edición", "Imagen de portada", "Mensaje invitación", "Calendario & Hospedaje", "Código de vestimenta"].map((f, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-dark/70 font-medium leading-tight">
                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3 border-2 border-[#a35d6a]/20 text-[#a35d6a] font-bold rounded-xl text-center text-[13px] group-hover:bg-[#a35d6a] group-hover:text-white transition-all">
                Elegir plan
              </Link>
            </div>

            {/* Oro */}
            <div className="reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-12 opacity-0 delay-150 p-6 md:p-7 rounded-[32px] glass bg-white/80 border-2 border-[#a35d6a]/30 shadow-2xl relative lg:scale-[1.03] z-10 flex flex-col hover:-translate-y-3">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#a35d6a] text-white text-[9px] font-bold px-3 py-1 rounded-full tracking-[0.15em] uppercase shadow-lg whitespace-nowrap">
                MÁS POPULAR 🌸
              </div>
              <h3 className="text-xl font-playfair font-bold mb-1 text-[#a35d6a]">Oro</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl lg:text-4xl font-bold text-[#a35d6a]">$499</span>
                <span className="text-[#a35d6a]/40 text-xs font-bold uppercase tracking-widest">MXN</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-grow">
                {["Todo lo de Plata, más:", "Cuenta regresiva", "Canción (Música)", "Eventos múltiples", "1 imagen por evento", "Hasta 6 fotos de galería", "Itinerario detallado"].map((f, i) => (
                  <li key={i} className="flex gap-2.5 font-bold text-[#2d1b2d] leading-tight" style={{ fontSize: 13 }}>
                    <Check size={16} className="text-[#a35d6a] flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3.5 bg-[#a35d6a] text-white font-bold rounded-xl text-center text-[13px] shadow-lg shadow-[#a35d6a]/20 transition-all active:scale-95">
                Elegir plan
              </Link>
            </div>

            {/* Diamante */}
            <div className="reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-12 opacity-0 delay-200 p-6 md:p-7 rounded-[32px] glass hover:bg-white/40 border border-white/50 shadow-xl hover:shadow-2xl group flex flex-col hover:-translate-y-2">
              <h3 className="text-xl font-playfair font-bold mb-1 text-dark">Diamante</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl lg:text-4xl font-bold text-dark">$799</span>
                <span className="text-dark/30 text-xs font-bold uppercase tracking-widest">MXN</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-grow">
                {["Todo lo de Oro, más:", "Administrador invitados", "Confirmación digital", "Mensajes personalizados", "Hasta 3 imágenes x evento", "Hasta 12 fotos galería", "Eventos exclusivos"].map((f, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-dark/70 font-medium leading-tight">
                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3 border-2 border-[#a35d6a]/20 text-[#a35d6a] font-bold rounded-xl text-center text-[13px] group-hover:bg-[#a35d6a] group-hover:text-white transition-all">
                Elegir plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 TESTIMONIALS */}
      <TestimonialsSection />

      {/* 7. FAQ */}
      <section id="faq" className="min-h-screen flex flex-col justify-center pt-[72px] pb-12 bg-[#fffcfc]">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-3 text-dark tracking-tight italic">Preguntas frecuentes</h2>
            <p className="text-dark/40 text-base font-medium">Todo lo que necesitas saber antes de empezar</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "¿Cómo creo mi invitación?", a: "Es muy sencillo: regístrate, llena el formulario con tus datos y elige un diseño predeterminado o usa nuestra IA para generar uno único." },
              { q: "¿Puedo editar después de publicar?", a: "¡Sí! Puedes entrar a tu panel en cualquier momento y cambiar fotos, fechas o incluso el diseño completo sin costo extra." },
              { q: "¿Cómo confirman los invitados?", a: "Recibirán un botón de confirmación en la invitación. Tú verás el nombre de los confirmados y cuántos invitados traen en tiempo real." },
              { q: "¿Cuánto tiempo está activa mi invitación?", a: "La invitación estará activa durante 12 meses desde la fecha de tu evento." },
              { q: "¿Es un pago único?", a: "Sí, todos nuestros planes son de pago único. No hay cargos mensuales ni suscripciones automáticas." },
              { q: "¿Puedo comprar desde fuera de México?", a: "Sí, aceptamos tarjetas internacionales Visa, Mastercard y Amex mediante Stripe." }
            ].map((faq, i) => (
              <details key={i} className="glass bg-white/40 rounded-3xl border border-white/50 shadow-sm overflow-hidden group">
                <summary className="flex items-center justify-between px-7 py-5 cursor-pointer font-bold font-playfair text-base list-none group-open:bg-[#a35d6a]/5 transition-colors">
                  {faq.q}
                  <ChevronDown size={18} className="text-[#a35d6a] group-open:rotate-180 transition-transform flex-shrink-0 ml-3" />
                </summary>
                <div className="px-7 pb-6 text-dark/60 text-sm leading-relaxed border-t border-white/30 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StickyCTA visible={isScrolled} />

      {/* 8. FOOTER */}
      <footer id="contacto" className="bg-[#1a1a2e] text-white pt-24 pb-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-10 mb-12 border-b border-white/5 pb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="mb-6 block group">
                <img
                  src="/logo.png"
                  alt="EncantIA"
                  style={{
                    height: '64px',
                    width: 'auto',
                    filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.4))',
                    transition: 'filter 0.3s ease',
                  }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <p className="text-white/40 text-sm max-w-xs mb-7 leading-relaxed">
                La plataforma de invitaciones digitales más elegante de México. Diseño, magia y tecnología para tus momentos más especiales.
              </p>
              <div className="flex gap-4">
                {["FB", "IG", "TT", "PN"].map(s => (
                  <div key={s} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-dark transition-all cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-5 uppercase tracking-widest text-[#a35d6a]">Navegación</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><Link href="#ejemplos" className="hover:text-white transition-colors">Ejemplos</Link></li>
                <li><Link href="#planes" className="hover:text-white transition-colors">Planes</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Panel de usuario</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-5 uppercase tracking-widest text-[#a35d6a]">Escríbenos</h4>
              <ul className="space-y-3 text-white/50 text-sm mb-7">
                <li><a href="mailto:hola@giovis.mx" className="hover:text-rose transition-colors">hola@giovis.mx</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp Soporte</a></li>
              </ul>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-[#a35d6a]">Legal</h4>
              <ul className="space-y-2 text-white/40 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aviso de Privacidad</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-xs font-bold uppercase tracking-widest">
            <p>© 2026 EncantIA Digital · Hecho con 🌸 en Guadalajara, México</p>
            <p>Impulsando la elegancia digital.</p>
          </div>
        </div>
      </footer>

      {/* GLOBAL CUSTOM STYLES */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-up { animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-up-delayed { animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-fade-up-slow { animation: fade-up 2.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
        .animate-fade-up-more { animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-float { animation: float 7s ease-in-out infinite; }
        .animate-float-delayed { animation: float 9s ease-in-out 1.5s infinite; }
        .perspective-1000 { perspective: 1000px; }

        @keyframes petalFall {
          0%   { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity:1; }
          100% { transform: translateY(110vh)  rotate(720deg) translateX(100px); opacity:0; }
        }
        .petal {
          position: fixed;
          top: -10vh;
          z-index: 1;
          pointer-events: none;
          animation: petalFall linear infinite;
          border-radius: 50% 0 50% 0;
          opacity: 0;
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #7B2D8B, #b76e79, #c8976a, #7B2D8B);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
          display: inline-block;
        }
      `}} />

    </div>
  );
}

function BenefitComparison() {
  const traditionalPoints = [
    "Altos costos de impresión y papel",
    "Entrega lenta y manual (invitado por invitado)",
    "Sin confirmación de asistencia en tiempo real",
    "Imposible de corregir errores tras la impresión",
    "Cero interactividad (sin mapas ni música)",
    "Dañino para el medio ambiente"
  ];

  const encantiaPoints = [
    "Ahorro de hasta el 80% en tu presupuesto",
    "Envío instantáneo a todo el mundo por WhatsApp",
    "Gestión automática de invitados (RSVP)",
    "Ediciones ilimitadas en tiempo real",
    "Experiencia con GPS, Música y Galerías",
    "100% Ecológico y sin desperdicio"
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 py-8 max-w-6xl mx-auto px-4">

      {/* TRADITIONAL SIDE */}
      <div className="relative group perspective-1000">
        <div className="h-full bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:rotate-y-[-2deg] hover:shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-6">
            <X size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-playfair font-bold text-slate-600 mb-2">La Tradición</h3>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6">Papel e Impresos</p>

          <ul className="space-y-4">
            {traditionalPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-4 text-slate-500/70 text-sm font-medium transition-all duration-300 group-hover:pl-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                {p}
              </li>
            ))}
          </ul>

          {/* Decorative tag */}
          <div className="mt-8 pt-6 border-t border-slate-200/50">
            <p className="text-slate-400 text-[10px] font-bold italic leading-relaxed">Limitado por el costo y el tiempo.</p>
          </div>
        </div>
      </div>

      {/* ENCANTIA SIDE */}
      <div className="relative group perspective-1000">
        {/* Magical Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] rounded-[34px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative h-full bg-white border border-rose/10 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:rotate-y-[2deg] shadow-xl hover:shadow-[#a35d6a]/20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a35d6a] to-[#7B2D8B] flex items-center justify-center text-white mb-6 shadow-lg shadow-[#a35d6a]/30">
            <Check size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-playfair font-bold text-[#a35d6a] mb-2">La Revolución</h3>
          <p className="text-[#a35d6a]/50 font-bold text-[10px] uppercase tracking-widest mb-6">Experiencia EncantIA</p>

          <ul className="space-y-4">
            {encantiaPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-3.5 text-dark/70 text-sm font-bold transition-all duration-300 group-hover:pl-2">
                <span className="mt-1 w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <Check size={10} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          {/* Highlight feature */}
          <div className="mt-8 p-5 bg-rose/5 rounded-[20px] border border-rose/10 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#a35d6a] shadow-sm">
              <Sparkles size={16} />
            </div>
            <p className="text-[#a35d6a] text-[11px] md:text-xs font-bold leading-tight">Mismo impacto visual, <br />Fracción del costo.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: "Mariana R.", date: "Boda Junio 2024", text: "¡Quedé encantada! Mis invitados amaron la facilidad de confirmar por WhatsApp. El mapa de GPS les salvó la vida a todos.", stars: 5 },
    { name: "Lucía P.", date: "XV de Sofía", text: "La IA diseñó exactamente lo que mi hija soñaba en segundos. El muro de felicitaciones fue el hit de la fiesta.", stars: 5 },
    { name: "Andrés B.", date: "Baby Shower", text: "Súper práctico. Pude organizar la mesa de regalos y controlar quién asistía sin estrés. 100% recomendado.", stars: 5 }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-10 opacity-0">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-dark tracking-tight italic">Momentos mágicos realizados</h2>
          <div className="w-16 h-1 bg-[#a35d6a]/20 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="reveal-on-scroll transform transition-all duration-1000 ease-out translate-y-12 opacity-0 p-8 rounded-[36px] bg-white border border-rose/5 shadow-xl hover:shadow-rose/10 transition-shadow">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Sparkles key={j} size={14} className="text-[#c8976a]" />
                ))}
              </div>
              <p className="text-dark/70 italic text-base leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-rose/10 flex items-center justify-center text-[#a35d6a] font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm">{t.name}</h4>
                  <p className="text-rose/50 text-xs font-bold uppercase tracking-wider">{t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyCTA({ visible }: { visible: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
      <Link href="/login" className="flex items-center gap-2 bg-[#a35d6a] hover:bg-[#8e4f5a] text-white pl-6 pr-4 py-2.5 rounded-full font-bold shadow-[0_15px_30px_rgba(163,93,106,0.5)] transition-all hover:scale-105 active:scale-95 group">
        <span className="text-[12px] md:text-sm">Crear mi invitación</span>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Sparkles size={14} />
        </div>
      </Link>
    </div>
  );
}

function CountdownCard() {
  return (
    <div className="bg-white rounded-[48px] shadow-2xl p-10 md:p-14 border border-rose/5 max-w-[420px] relative overflow-hidden group">
      {/* Pink border top like Image 1 */}
      <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#a35d6a] via-[#e65c7b] to-[#a35d6a]"></div>

      <div className="flex justify-center items-center gap-3 mb-10 opacity-80 group-hover:scale-110 transition-transform duration-500">
        <span className="text-3xl">🌸</span>
        <span className="text-3xl">💍</span>
        <span className="text-3xl">🌸</span>
      </div>

      <div className="text-center mb-10">
        <p className="text-[12px] md:text-[14px] font-bold text-dark/30 tracking-[0.4em] uppercase mb-4">CONTEO REGRESIVO</p>
        <h3 className="text-3xl md:text-4xl font-playfair font-bold text-[#a35d6a] italic mb-3">Sofía & Emilio</h3>
        <p className="text-sm md:text-base text-dark/40 font-bold">Sábado 14 de Junio, 2025 — 18:30 hrs</p>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-5 mb-12">
        {[
          { label: "DÍAS", val: "46" },
          { label: "HRS", val: "22" },
          { label: "MIN", val: "45" },
          { label: "SEG", val: "49" }
        ].map((item, i) => (
          <div key={i} className="bg-[#8c4a56] hover:bg-[#a35d6a] rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center shadow-lg shadow-[#8c4a56]/20 transition-all transform hover:-translate-y-1">
            <span className="text-2xl md:text-4xl font-bold text-white mb-2 leading-none line-height-[0.8]">{item.val}</span>
            <span className="text-[8px] md:text-[10px] text-white/50 uppercase font-bold tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>

      <button className="w-full py-5 bg-[#8c4a56] hover:bg-[#a35d6a] text-white rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98]">
        <Heart size={20} fill="white" /> Confirmar asistencia
      </button>

      <div className="flex justify-center items-center gap-2 mt-8 text-xs font-bold text-dark/30 tracking-tight">
        <MapPin size={14} className="text-rose" />
        <span>Jardín Villa Toscana, Guadalajara</span>
      </div>
    </div>
  );
}

function FallingPetals() {
  const petals = Array.from({ length: 15 });
  const colors = ["#f8c8d8", "#e8a8c4", "#f3e8f7", "#b76e79"];
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {petals.map((_, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - (Math.random() * 20)}%`,
            width: `${10 + Math.random() * 15}px`,
            height: `${12 + Math.random() * 15}px`,
            background: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 10}s`,
            opacity: 0.6 + Math.random() * 0.4,
            filter: `blur(${Math.random() * 0.5}px)`,
          }}
        />
      ))}
    </div>
  );
}

function LiveCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hrs: "00", min: "00", seg: "00" });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff < 0) return;

      setTimeLeft({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hrs: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        min: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seg: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-1.5 mb-4">
      {[
        { l: "DÍAS", v: timeLeft.days },
        { l: "HRS", v: timeLeft.hrs },
        { l: "MIN", v: timeLeft.min },
        { l: "SEG", v: timeLeft.seg }
      ].map((c, i) => (
        <div key={i} className="border border-white/50 rounded-lg py-2 px-1.5 backdrop-blur-md bg-white/15 text-center">
          <p className="text-base font-bold leading-tight">{c.v}</p>
          <p className="text-[7px] font-bold tracking-wider opacity-80 uppercase mt-0.5">{c.l}</p>
        </div>
      ))}
    </div>
  );
}

function ImageCarousel() {
  const images = [
    { src: "/img_wedding.png", title: "Sofía & Roberto", date: "14 de Febrero, 2027", target: "2027-02-14T18:00:00" },
    { src: "/img_quince.png", title: "Mis XV Años", date: "22 de Agosto, 2026", target: "2026-08-22T20:00:00" },
    { src: "/img_communion.png", title: "Mi Primera Comunión", date: "10 de Mayo, 2026", target: "2026-05-10T11:00:00" },
    { src: "/img_baby.png", title: "Baby Shower", date: "05 de Julio, 2026", target: "2026-07-05T16:00:00" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full h-full relative">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
        >
          <img
            src={img.src}
            alt={img.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle dark overlay to make text pop */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* OVERLAY CONTENT — pushed to lower 60% of phone */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-white text-center pb-14 px-4 z-10">
            <h4 className="font-playfair text-2xl font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] leading-tight">
              {img.title}
            </h4>

            {/* LIVE COUNTDOWN */}
            <LiveCountdown targetDate={img.target} />

            {/* Date line */}
            <div className="flex items-center gap-2 mb-0 w-full max-w-[190px]">
              <div className="h-[1px] bg-white/40 flex-grow"></div>
              <p className="text-[10px] font-semibold tracking-[0.15em] whitespace-nowrap opacity-90">{img.date}</p>
              <div className="h-[1px] bg-white/40 flex-grow"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-700 ${idx === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
