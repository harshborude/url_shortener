import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'https://url-r9vl.onrender.com'; // Your backend URL

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [longUrl, setLongUrl] = useState('');

  // Dashboard States
  const [username, setUsername] = useState('');
  const [urls, setUrls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Clear errors when switching views
  useEffect(() => { setError(''); }, [isSignup]);

  // Fetch user info and URLs when logged in
  useEffect(() => {
    if (token) {
      fetchUserInfo();
      fetchUrls();
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { handleLogout(); return; }
      const data = await res.json();
      setUsername(data.firstname);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    }
  };

  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_BASE}/codes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { handleLogout(); return; }
      const data = await res.json();
      setUrls(data.codes || []);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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

      setShortUrl(`${API_BASE}/${data.shortCode}`);
      setLongUrl('');
      // Add the new URL to the list
      setUrls(prev => [...prev, { targetURL: longUrl, shortCode: data.shortCode }]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setShortUrl('');
    setLongUrl('');
    setUsername('');
    setUrls([]);
    setSearchQuery('');
  };

  // Filter URLs based on search query
  const filteredUrls = urls.filter(u =>
    u.targetURL.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? (isSignup ? 'Registering...' : 'Logging in...')
              : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <p className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Have an account? Login' : 'Need an account? Sign up'}
        </p>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>
          <p>
            Note: This app uses a Render free tier subscription. The server may be "sleeping"
            and could take up to 50 seconds to wake up. Please be patient!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Left Pane - Dashboard */}
      <div className="left-pane">
        <h1>Hello, {username || '...'} 👋</h1>

        <input
          type="text"
          className="search-box"
          placeholder="🔍 Search your URLs..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <div className="table-wrapper">
          {filteredUrls.length === 0 ? (
            <p className="empty-state">
              {urls.length === 0
                ? 'No shortened URLs yet. Create one →'
                : 'No URLs match your search.'}
            </p>
          ) : (
            <table className="url-table">
              <thead>
                <tr>
                  <th>Long URL</th>
                  <th>Short URL</th>
                </tr>
              </thead>
              <tbody>
                {filteredUrls.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <a href={u.targetURL} target="_blank" rel="noreferrer" title={u.targetURL}>
                        {u.targetURL.length > 50
                          ? u.targetURL.substring(0, 50) + '...'
                          : u.targetURL}
                      </a>
                    </td>
                    <td>
                      <a href={`${API_BASE}/${u.shortCode}`} target="_blank" rel="noreferrer">
                        {u.shortCode}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="url-count">{urls.length} URL{urls.length !== 1 ? 's' : ''} shortened</p>
      </div>

      {/* Right Pane - Shorten Form */}
      <div className="right-pane">
        <h2>Shorten a URL</h2>
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
            Your shortened URL: <br />
            <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
          </div>
        )}

        <p className="toggle-link" onClick={handleLogout}>Logout</p>
      </div>
    </div>
  );
}

export default App;