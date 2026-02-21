import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch posts from Backend (which gets them from Contentful)
  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // 2. Function to send a "Like" to the Backend (which saves to MongoDB)
  const handleLike = (id) => {
    fetch(`http://localhost:5000/api/posts/${id}/like`, { 
      method: 'POST' 
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Success! This post now has ${data.likes} likes in your MongoDB.`);
      })
      .catch((err) => {
        console.error("Error liking post:", err);
        alert("Check if your backend is running!");
      });
  };

  if (loading) return <div className="loader"><h1>Loading from Contentful...</h1></div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>🚀 Full-Stack Blog</h1>
        <p>Content from <strong>Contentful</strong> | Interactions in <strong>MongoDB</strong></p>
      </header>

      <div style={{ display: 'grid', gap: '30px' }}>
        {posts.map((post) => (
          <div 
            key={post.sys.id} 
            style={{ 
              border: '1px solid #eee', 
              padding: '20px', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
            }}
          >
            <h2 style={{ marginTop: 0, color: '#333' }}>
              {post.fields.title || "Untitled Post"}
            </h2>
            
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              ID: {post.sys.id}
            </p>

            <button 
              onClick={() => handleLike(post.sys.id)}
              style={{ 
                backgroundColor: '#ff4b5c', 
                color: 'white', 
                border: 'none', 
                padding: '12px 20px', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ❤️ Like this post
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App