import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Map from './pages/Map.jsx';
import Wars from './pages/Wars.jsx';
import Market from './pages/Market.jsx';
import Storage from './pages/Storage.jsx';
import News from './pages/News.jsx';
import Auth from './pages/Auth.jsx';
import OAuthCallback from './components/OAuthCallback';
import { isAuthenticated } from './utils/auth.js';

export default function App() {
  const location = useLocation();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const check = async () => {
      const result = await isAuthenticated();
      setAuth(result);
    };
    check();
  }, []);

  if (auth === null) {
    return <div className="text-center mt-10 text-white">Проверка авторизации...</div>;
  }

  if (!auth && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {auth && <Navbar />}
      <main className="flex-1 flex flex-col overflow-y-auto h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/wars" element={<Wars />} />
          <Route path="/market" element={<Market />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/news" element={<News />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Routes>
      </main>
    </div>
  );
}
