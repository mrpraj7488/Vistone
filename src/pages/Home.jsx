import {
  Hero,
  Features,
  Services,
  Products,
  Stats,
  Achievements,
  TechStack,
  CompanyGlance,
  Testimonials,
  EliteAuthor,
  Blog
} from '../components/landing';

export default function Home({ darkMode }) {
  return (
    <>
      <Hero darkMode={darkMode} />
      <Features darkMode={darkMode} />
      <Services darkMode={darkMode} />
      <Products darkMode={darkMode} />
      <Stats darkMode={darkMode} />
      <Achievements darkMode={darkMode} />
      <TechStack darkMode={darkMode} />
      <CompanyGlance darkMode={darkMode} />
      <Testimonials darkMode={darkMode} />
      <EliteAuthor darkMode={darkMode} />
      <Blog darkMode={darkMode} />
    </>
  );
}
