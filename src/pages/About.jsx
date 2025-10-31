import { Link } from 'react-router-dom';

export default function About({ darkMode }) {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-8 text-gradient">About</h1>
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          About page - Coming soon
        </p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 rounded-xl font-bold btn-gradient">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
