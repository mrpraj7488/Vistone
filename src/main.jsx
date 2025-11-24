import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/globals.css'
import App from './App.jsx'

// Initialize dark mode based on saved preference
const initializeDarkMode = () => {
  const savedTheme = localStorage.getItem('adminTheme');
  
  // Apply dark mode if explicitly saved as dark
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
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
