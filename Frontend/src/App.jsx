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
    <div className="app-container">
      <header className="header">
        <h1>Contentful + MongoDB Project</h1>
        <p>Managing the "FirstPage" Content Model</p>
      </header>

      <main className="posts-grid">
        {posts.length === 0 ? (
          <p>No posts found in Contentful.</p>
        ) : (
          posts.map((post) => (
            <section key={post.sys.id} className="post-card">
              {/* Note: 'tekstas' and 'arGerai' match your Contentful IDs */}
              <h3>ID: {post.sys.id}</h3>
              
              <div className="post-content">
                <p><strong>Status:</strong> {post.fields.arGerai ? '✅ Taip' : '❌ Ne'}</p>
                
                {/* Rich Text fields come back as objects, not simple strings */}
                <div className="rich-text-placeholder">
                  <em>[Rich Text Content: Tekstas]</em>
                </div>
              </div>

              <div className="actions">
                <span className="like-count">❤️ {post.likes || 0} Likes</span>
                <button 
                  className="like-button" 
                  onClick={() => handleLike(post.sys.id)}
                >
                  Like
                </button>
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

export default App;