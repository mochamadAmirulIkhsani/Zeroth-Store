import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { TestimoniPage } from './pages/TestimoniPage';
import { FAQPage } from './pages/FAQPage';
import { KontakPage } from './pages/KontakPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminGames } from './pages/admin/AdminGames';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminWhatsApp } from './pages/admin/AdminWhatsApp';
import { AdminFAQ } from './pages/admin/AdminFAQ';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'games', Component: GamesPage },
      { path: 'games/:slug', Component: GameDetailPage },
      { path: 'testimoni', Component: TestimoniPage },
      { path: 'faq', Component: FAQPage },
      { path: 'kontak', Component: KontakPage },
    ],
  },
  {
    path: '/admin',
    children: [
      { index: true, Component: AdminLogin },
      {
        Component: AdminLayout,
        children: [
          { path: 'dashboard', Component: AdminDashboard },
          { path: 'games', Component: AdminGames },
          { path: 'services', Component: AdminServices },
          { path: 'testimonials', Component: AdminTestimonials },
          { path: 'faq', Component: AdminFAQ },
          { path: 'settings', Component: AdminSettings },
          { path: 'whatsapp', Component: AdminWhatsApp },
        ],
      },
    ],
  },
]);