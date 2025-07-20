import { useState } from 'react';
import { isAuthenticated } from '../utils/auth';

export default function Auth() {
  const [mode, setMode] = useState('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      mode === 'register'
        ? 'http://localhost:8001/api/auth/register'
        : 'http://localhost:8001/api/auth/login';

    const payload =
      mode === 'register'
        ? { username, email, password }
        : { username, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const valid = await isAuthenticated();

        if (valid) {
          window.location.href = '/';
        } else {
          console.warn('[auth] Токен получен, но isAuthenticated() вернул false');

          const tokenDebug = await fetch('http://localhost:8001/api/auth/validate-token', {
            credentials: 'include',
          });

          const debugJson = await tokenDebug.json();
          console.log('[auth] validate-token response:', debugJson);

          alert(`Не удалось подтвердить авторизацию.\nОтвет сервера: ${debugJson.error || JSON.stringify(debugJson)}`);
        }
      } else {
        const err = await res.json();
        console.error('[auth] Ошибка при логине/регистрации:', err);
        alert(err.error || err.message || 'Ошибка входа');
      }
    } catch (error) {
      console.error('[auth] Сервер недоступен:', error);
      alert('Сервер недоступен');
    }
  };

  const googleLogin = () => {
    window.location.href = 'http://localhost:8001/auth/google';
  };

  const vkLogin = () => {
    window.location.href = 'http://localhost:8001/auth/vk';
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('/assets/cover.png')`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60" />
      <div className="relative z-10 bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {mode === 'register' ? 'Регистрация' : 'Авторизация'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Введите логин"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Введите email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Введите пароль"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold transition"
          >
            {mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          {mode === 'register' ? (
            <>
              Уже есть аккаунт?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 hover:underline"
              >
                Войти
              </button>
            </>
          ) : (
            <>
              Нет аккаунта?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-400 hover:underline"
              >
                Зарегистрироваться
              </button>
            </>
          )}
        </div>

        <div className="mt-6">
          <p className="text-center text-gray-400 mb-2">или войдите через</p>
          <div className="flex gap-4">
            <button
              onClick={googleLogin}
              className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              Google
            </button>
            <button
              onClick={vkLogin}
              className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              ВКонтакте
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
