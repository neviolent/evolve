// auth.js - полностью переписанный для JWT cookies

export const isAuthenticated = async () => {
  console.log('[auth] Проверка токена...');
  try {
    const response = await fetch('http://localhost:8001/api/auth/validate-token', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[auth] Токен валиден:', data);
      return !!data.username;
    }
    
    console.log('[auth] Токен невалиден, статус:', response.status);
    return false;
  } catch (error) {
    console.error('[auth] Ошибка при проверке токена:', error);
    return false;
  }
};

export const logout = async () => {
  console.log('[auth] Выполняется выход...');
  try {
    const response = await fetch('http://localhost:8001/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      console.log('[auth] Выход успешен');
      // Перенаправляем на страницу авторизации
      window.location.href = '/auth';
    } else {
      console.error('[auth] Ошибка при выходе:', response.status);
      // Всё равно перенаправляем, возможно cookie уже истёк
      window.location.href = '/auth';
    }
  } catch (error) {
    console.error('[auth] Сервер недоступен при выходе:', error);
    // Перенаправляем даже при ошибке сети
    window.location.href = '/auth';
  }
};

export const getUser = async () => {
  console.log('[auth] Получение данных пользователя...');
  try {
    const response = await fetch('http://localhost:8001/api/auth/validate-token', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        username: data.username || 'Unknown',
        user_id: data.user_id,
        isAuthenticated: true
      };
    }
    
    return {
      username: 'Guest',
      user_id: null,
      isAuthenticated: false
    };
  } catch (error) {
    console.error('[auth] Ошибка при получении пользователя:', error);
    return {
      username: 'Guest',
      user_id: null,
      isAuthenticated: false
    };
  }
};

// Новая функция для проверки и получения пользователя одним запросом
export const getCurrentUser = async () => {
  const user = await getUser();
  return user.isAuthenticated ? user : null;
};