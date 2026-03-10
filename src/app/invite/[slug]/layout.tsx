import { createServerSupabaseClient } from '@/lib/supabase';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { slug: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const supabase = createServerSupabaseClient();
    const { data: event } = await supabase
        .from('events')
        .select('title, message, cover_image_url, event_type')
        .eq('slug', params.slug)
        .single();

    if (!event) {
        return {
            title: 'Invitación | Giovis App',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${event.title} | Invitación Digital`,
        description: event.message || `Estás invitado a este increíble evento: ${event.event_type}`,
        openGraph: {
            title: event.title,
            description: event.message || `Estás invitado a nuestro evento de ${event.event_type}`,
            images: event.cover_image_url ? [event.cover_image_url, ...previousImages] : previousImages,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.message || `Invitación para ${event.title}`,
            images: event.cover_image_url ? [event.cover_image_url] : [],
        },
    };
}

export default function InviteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
