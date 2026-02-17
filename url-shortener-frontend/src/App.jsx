import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'https://url-shortener-6p2u.onrender.com'; // Your backend URL

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [longUrl, setLongUrl] = useState('');

  // Clear errors when switching views
  useEffect(() => { setError(''); }, [isSignup]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isSignup ? '/user/signup' : '/user/login';
    const payload = isSignup 
      ? { email, password, firstname } 
      : { email, password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || data.error || 'Something went wrong');

      if (isSignup) {
        alert('Account created! Please login.');
        setIsSignup(false);
      } else {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: longUrl })
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to shorten');

      // Construct the full short URL (assuming backend handles the redirect)
      setShortUrl(`${API_BASE}/${data.shortCode}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setShortUrl('');
    setLongUrl('');
  };

  // --- Render Views ---

  if (!token) {
    return (
      <div className="container">
        <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleAuth}>
          {isSignup && (
            <input 
              type="text" 
              placeholder="First Name" 
              value={firstname}
              onChange={e => setFirstname(e.target.value)}
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>

        <p className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Have an account? Login' : 'Need an account? Sign up'}
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleShorten}>
        <input 
          type="url" 
          placeholder="Paste your long URL here" 
          value={longUrl}
          onChange={e => setLongUrl(e.target.value)}
          required 
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <div className="result">
          Your shortened url is - <br/>
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </div>
      )}

      <p className="toggle-link" onClick={handleLogout}>Logout</p>
    </div>
  );
}

export default App;