import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORY_ICONS: Record<string, string> = {
  Umum: '📋',
  Keamanan: '🔒',
  Pembayaran: '💳',
  Garansi: '🛡️',
};

export function FAQPage() {
  const { faqs, settings } = useApp();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Semua');

  const activeFaqs = faqs.filter(f => f.active);
  const categories = ['Semua', ...Array.from(new Set(activeFaqs.map(f => f.category)))];
  const filtered = activeCategory === 'Semua'
    ? activeFaqs
    : activeFaqs.filter(f => f.category === activeCategory);

  const grouped = categories.filter(c => c !== 'Semua').reduce<Record<string, typeof activeFaqs>>((acc, cat) => {
    acc[cat] = activeFaqs.filter(f => f.category === cat);
    return acc;
  }, {});

  const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Halo! Saya punya pertanyaan tentang layanan Zeroth Store.')}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-[#0A0A0A] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Pertanyaan yang Sering Ditanya
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Temukan jawaban dari pertanyaan-pertanyaan yang sering diajukan klien kami
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat !== 'Semua' && <span>{CATEGORY_ICONS[cat] ?? '❓'}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        {activeCategory === 'Semua' ? (
          Object.entries(grouped).map(([category, categoryFaqs]) => (
            <div key={category} className="mb-10">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0A0A0A] mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span>{CATEGORY_ICONS[category] ?? '❓'}</span>
                {category}
              </h2>
              <div className="space-y-3">
                {categoryFaqs.map(faq => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-medium text-[#0A0A0A] text-sm text-left">{faq.question}</span>
                      {openFaq === faq.id
                        ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      }
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-6 pb-4 border-t border-gray-50">
                        <p className="text-gray-500 text-sm leading-relaxed pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {filtered.map(faq => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-[#0A0A0A] text-sm text-left">{faq.question}</span>
                  {openFaq === faq.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-4 border-t border-gray-50">
                    <p className="text-gray-500 text-sm leading-relaxed pt-3">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
          <h3 className="font-bold text-[#0A0A0A] text-xl mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Pertanyaan Anda Tidak Ada di Sini?
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Langsung tanyakan kepada admin kami via WhatsApp. Kami siap membantu!
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-7 py-3.5 rounded-xl text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Tanya via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
