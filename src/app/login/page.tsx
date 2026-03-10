'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase-browser';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Si ya hay sesión, redirigir al dashboard
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) router.replace('/dashboard');
        });

        // Escuchar cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                router.replace('/dashboard');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel — Branding */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #7B2D8B 0%, #a35d6a 60%, #e8c49a 100%)' }}
            >
                {/* Decorative petals */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-[50%_0_50%_0] opacity-20"
                        style={{
                            width: `${20 + i * 10}px`,
                            height: `${25 + i * 10}px`,
                            background: 'rgba(255,255,255,0.6)',
                            top: `${(i * 13) % 100}%`,
                            left: `${(i * 17) % 100}%`,
                            transform: `rotate(${i * 45}deg)`,
                        }}
                    />
                ))}

                <div className="relative z-10 text-center text-white">
                    <img
                        src="/logo.png"
                        alt="EncantIA"
                        className="mx-auto mb-4"
                        style={{
                            height: '90px',
                            width: 'auto',
                            filter: 'brightness(0) invert(1) drop-shadow(0 0 25px rgba(255,255,255,0.5))',
                        }}
                    />
                    <p className="text-xl opacity-90 mb-8 font-light">
                        Invitaciones digitales que enamoran
                    </p>
                    <div className="flex flex-col gap-3 text-sm opacity-75">
                        {['🌸 Bodas', '💃 XV Años', '👶 Baby Shower', '✝️ Comunión'].map((item) => (
                            <span key={item} className="bg-white/10 px-4 py-2 rounded-full">{item}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-10">
                        <img
                            src="/logo.png"
                            alt="EncantIA"
                            style={{
                                height: '68px',
                                width: 'auto',
                                margin: '0 auto 8px',
                                filter: 'drop-shadow(0 2px 8px rgba(163,93,106,0.3))',
                            }}
                        />
                        <p className="text-sm text-gray-500">Invitaciones digitales inteligentes</p>
                    </div>

                    <h2
                        className="text-2xl font-bold text-[#2d1b2d] mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Bienvenido de vuelta
                    </h2>
                    <p className="text-sm text-gray-500 mb-8">
                        Inicia sesión o crea tu cuenta para continuar
                    </p>

                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#a35d6a',
                                        brandAccent: '#8e4f5a',
                                        brandButtonText: 'white',
                                        inputBackground: '#fff',
                                        inputBorder: '#e8d0d7',
                                        inputBorderFocus: '#a35d6a',
                                        inputText: '#2d1b2d',
                                        inputLabelText: '#6b4a55',
                                        anchorTextColor: '#a35d6a',
                                        anchorTextHoverColor: '#7B2D8B',
                                    },
                                    radii: {
                                        borderRadiusButton: '99px',
                                        buttonBorderRadius: '99px',
                                        inputBorderRadius: '12px',
                                    },
                                    fontSizes: {
                                        baseInputSize: '14px',
                                        baseLabelSize: '13px',
                                    },
                                    space: {
                                        inputPadding: '12px 16px',
                                        buttonPadding: '12px 24px',
                                    },
                                },
                            },
                            className: {
                                button: 'font-bold transition-all hover:opacity-90',
                                input: 'focus:ring-2 focus:ring-[#a35d6a]/20',
                            },
                        }}
                        providers={['google']}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: 'Correo electrónico',
                                    password_label: 'Contraseña',
                                    email_input_placeholder: 'tu@correo.com',
                                    password_input_placeholder: '••••••••',
                                    button_label: 'Iniciar sesión',
                                    social_provider_text: 'Continuar con {{provider}}',
                                    link_text: '¿Ya tienes cuenta? Inicia sesión',
                                },
                                sign_up: {
                                    email_label: 'Correo electrónico',
                                    password_label: 'Crea una contraseña',
                                    email_input_placeholder: 'tu@correo.com',
                                    password_input_placeholder: 'Mínimo 6 caracteres',
                                    button_label: 'Crear cuenta',
                                    social_provider_text: 'Continuar con {{provider}}',
                                    link_text: '¿No tienes cuenta? Regístrate',
                                    confirmation_text: '¡Revisa tu email para confirmar tu cuenta!',
                                },
                                forgotten_password: {
                                    link_text: '¿Olvidaste tu contraseña?',
                                    button_label: 'Enviar instrucciones',
                                    email_label: 'Correo electrónico',
                                    email_input_placeholder: 'tu@correo.com',
                                },
                            },
                        }}
                        redirectTo={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                    />
                </div>
            </div>
        </div>
    );
}
