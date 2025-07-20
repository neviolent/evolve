import { Link } from 'react-router-dom';

export default function Home() {
  const gameFeatures = [
    { path: '/map', title: 'Карта мира', desc: 'Исследуй территории', color: 'bg-blue-600 hover:bg-blue-700' },
    { path: '/wars', title: 'Войны', desc: 'Сражайся с врагами', color: 'bg-red-600 hover:bg-red-700' },
    { path: '/market', title: 'Рынок', desc: 'Торгуй ресурсами', color: 'bg-green-600 hover:bg-green-700' },
    { path: '/storage', title: 'Склад', desc: 'Управляй запасами', color: 'bg-yellow-600 hover:bg-yellow-700' }
  ];

  // Заглушки
  const countries = ['Россия', 'США', 'Германия', 'Китай'];
  const parties = ['Партия Свободы', 'Национальный Фронт', 'Зелёные'];
  const messages = [
    { user: 'Игрок1', text: 'Всем привет!' },
    { user: 'Игрок2', text: 'Готовимся к войне!' },
  ];

  return (
    <div className="flex flex-col px-4 py-6 space-y-8 text-white">
      {/* Заголовок */}
      <h1 className="text-4xl md:text-5xl font-bold text-center">Добро пожаловать!</h1>

      {/* Основные функции */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gameFeatures.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className={`${feature.color} p-4 rounded-lg transition block text-center`}
          >
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-200">{feature.desc}</p>
          </Link>
        ))}
      </div>

      {/* Раздел: Государства */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Государства</h2>
        <ul className="bg-gray-800 rounded-lg p-4 space-y-1">
          {countries.map((country, i) => (
            <li key={i} className="text-gray-200">{country}</li>
          ))}
        </ul>
      </div>

      {/* Раздел: Политические партии */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Политические партии</h2>
        <ul className="bg-gray-800 rounded-lg p-4 space-y-1">
          {parties.map((party, i) => (
            <li key={i} className="text-gray-200">{party}</li>
          ))}
        </ul>
      </div>

      {/* Раздел: Игровой чат */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Игровой чат (заглушка)</h2>
        <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="font-bold text-blue-400">{msg.user}: </span>
              <span className="text-gray-300">{msg.text}</span>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-4 italic">* Здесь будет WebSocket-чат *</p>
        </div>
      </div>
    </div>
  );
}
