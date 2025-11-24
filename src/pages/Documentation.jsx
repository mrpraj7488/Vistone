import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Documentation({ darkMode }) {
  const { slug } = useParams();
  const [currentDoc, setCurrentDoc] = useState(null);
  const [docs, setDocs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState('2.0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, [selectedVersion]);

  useEffect(() => {
    if (slug && docs.length > 0) {
      const doc = docs.find((d) => d.slug === slug);
      setCurrentDoc(doc || docs[0]);
    } else if (docs.length > 0) {
      setCurrentDoc(docs[0]);
    }
  }, [slug, docs]);

  const fetchDocs = async () => {
    const { data } = await supabase
      .from('documentation_pages')
      .select('*')
      .eq('version', selectedVersion)
      .order('category')
      .order('sort_order');

    setDocs(data || []);

    const uniqueCategories = [...new Set(data?.map((d) => d.category) || [])];
    setCategories(uniqueCategories);
    setLoading(false);
  };

  const groupedDocs = categories.reduce((acc, category) => {
    acc[category] = docs.filter((doc) => doc.category === category);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/" className="hover:text-cyan-500">Home</Link> /{' '}
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Documentation</span>
        </nav>

        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className={`rounded-2xl p-6 sticky top-24 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
              <div className="mb-6">
                <label className={`block mb-2 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Version
                </label>
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border-2 outline-none ${
                    darkMode ? 'glass-dark border-cyan-500/30 text-white' : 'glass-light border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="2.0">v2.0 (Latest)</option>
                  <option value="1.5">v1.5</option>
                  <option value="1.0">v1.0</option>
                </select>
              </div>

              <nav className="space-y-4">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category}
                    </h3>
                    <ul className="space-y-1">
                      {groupedDocs[category]?.map((doc) => (
                        <li key={doc.id}>
                          <Link
                            to={`/docs/${doc.slug}`}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              currentDoc?.id === doc.id
                                ? 'bg-cyan-500 text-white'
                                : darkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {doc.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin text-6xl">⚙️</div>
              </div>
            ) : currentDoc ? (
              <div className={`rounded-2xl p-8 ${darkMode ? 'glass-dark' : 'glass-light'}`}>
                <div className="mb-8">
                  <span className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {currentDoc.category}
                  </span>
                  <h1 className={`text-4xl font-black mt-2 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentDoc.title}
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Version {currentDoc.version} • Last updated {new Date(currentDoc.updated_at).toLocaleDateString()}
                  </p>
                </div>

                <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                  <div className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentDoc.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Code Example
                    </h3>
                    <pre
                      className={`p-4 rounded-lg overflow-x-auto ${
                        darkMode ? 'bg-gray-900 text-green-400' : 'bg-gray-800 text-green-300'
                      }`}
                    >
                      <code>{`import { supabase } from './supabaseClient'

// Example API call
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'software')
  .limit(10)

if (error) console.error(error)
else console.log(data)`}</code>
                    </pre>
                  </div>
                </div>

                <div className={`flex items-center justify-between mt-12 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div>
                    {docs.indexOf(currentDoc) > 0 && (
                      <Link
                        to={`/docs/${docs[docs.indexOf(currentDoc) - 1].slug}`}
                        className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}
                      >
                        ← Previous
                      </Link>
                    )}
                  </div>
                  <div>
                    {docs.indexOf(currentDoc) < docs.length - 1 && (
                      <Link
                        to={`/docs/${docs[docs.indexOf(currentDoc) + 1].slug}`}
                        className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} hover:underline`}
                      >
                        Next →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📚</div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  No documentation found
                </h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
