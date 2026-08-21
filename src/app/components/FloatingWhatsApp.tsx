import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function FloatingWhatsApp() {
  const { settings } = useApp();
  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo Admin! Saya ingin tanya tentang layanan Zeroth Store.')}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30 scale-110" />
        <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200 hover:scale-110">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat Admin
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black" />
        </div>
      </div>
    </a>
  );
}
