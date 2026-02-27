import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/posts';

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Server responded with an error');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle clicking the Like button
  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/like`, { method: 'POST' });
      const updatedData = await response.json();

      // Update the local state so the UI changes instantly
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.sys.id === id ? { ...post, likes: updatedData.likes } : post
        )
      );
    } catch (err) {
      console.error("Failed to like:", err);
    }
  };

  if (loading) return <div className="status">📡 Loading your project...</div>;
  if (error) return <div className="status error">❌ Error: {error}</div>;

return (
  <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    {/* Header Section */}
    <header className="max-w-5xl mx-auto text-center mb-16">
      <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
        Project Dashboard
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Real-time data from Contentful & MongoDB Cloud
      </p>
    </header>

    {/* Posts Grid */}
    <main className="max-w-5xl mx-auto">
      {posts.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <p className="text-slate-500">No entries found in Contentful.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article 
              key={post.sys.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Entry ID: {post.sys.id.slice(0, 8)}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {/* Dynamic Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.fields.arGerai 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {post.fields.arGerai ? '● Verified' : '○ Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Content Area */}
              <div className="mb-8">
                <p className="text-slate-700 leading-relaxed italic">
                  {/* We'll add Rich Text rendering here later */}
                  "Tekstas" content is ready for rendering...
                </p>
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">❤️</span>
                  <span className="text-lg font-bold text-slate-900">
                    {post.likes || 0}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleLike(post.sys.id)}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Give Like
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  </div>
);
}

export default App;