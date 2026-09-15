import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </HelmetProvider>
  );
}