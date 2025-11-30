import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/globals.css'
import App from './App.jsx'

// One-time migration: Remove old theme keys
if (!localStorage.getItem('vistone_theme_migrated')) {
  localStorage.removeItem('theme');
  localStorage.removeItem('adminTheme');
  localStorage.removeItem('vistone_theme');
  localStorage.removeItem('vistone_admin_theme');
  localStorage.setItem('vistone_theme_migrated', 'true');
}

// Initialize dark mode based on saved preference
const initializeDarkMode = () => {
  const savedTheme = localStorage.getItem('vistone_theme_v2');

  // Apply dark mode unless explicitly saved as light
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
};

// Apply dark mode immediately to prevent flash
initializeDarkMode();

// Service worker disabled for now
// Uncomment when you have a proper service worker file
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(registration => console.log('SW registered:', registration))
//       .catch(error => console.log('SW registration failed:', error));
//   });
// }

// Handle PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Show install button or notification
  console.log('PWA install prompt available');
});

// Handle PWA installation
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
