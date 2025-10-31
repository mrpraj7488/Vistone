import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import Stats from '../components/Stats';
import Achievements from '../components/Achievements';
import TechStack from '../components/TechStack';
import CompanyGlance from '../components/CompanyGlance';
import Testimonials from '../components/Testimonials';
import EliteAuthor from '../components/EliteAuthor';
import Blog from '../components/Blog';
import Newsletter from '../components/Newsletter';

export default function Home({ darkMode }) {
  return (
    <>
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
    </>
  );
}
