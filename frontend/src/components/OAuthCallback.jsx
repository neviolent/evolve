import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      alert('Ошибка авторизации');
      navigate('/auth');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      Авторизация через OAuth...
    </div>
  );
}
