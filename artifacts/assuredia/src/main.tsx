// assuredia/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import App from './App';
import './index.css';

// تحقق من الـ preference المحفوظة أو الـ system preference
const isDark = localStorage.getItem('app-theme') === 'dark' || 
  (!localStorage.getItem('app-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (isDark) {
  document.documentElement.classList.add('dark');
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <App />
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);