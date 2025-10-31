import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Products from './components/Products';
import Stats from './components/Stats';
import Achievements from './components/Achievements';
import TechStack from './components/TechStack';
import CompanyGlance from './components/CompanyGlance';
import Testimonials from './components/Testimonials';
import EliteAuthor from './components/EliteAuthor';
import Blog from './components/Blog';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero darkMode={darkMode} />
      <Services darkMode={darkMode} />
      <Products darkMode={darkMode} />
      <Stats darkMode={darkMode} />
      <Achievements darkMode={darkMode} />
      <TechStack darkMode={darkMode} />
      <CompanyGlance darkMode={darkMode} />
      <Testimonials darkMode={darkMode} />
      <EliteAuthor darkMode={darkMode} />
      <Blog darkMode={darkMode} />
      <Newsletter darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;
