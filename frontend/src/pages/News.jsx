import { Link } from 'react-router-dom';

export default function Home() {
  const gameFeatures = [
    { path: '/map', title: 'Карта мира', desc: 'Исследуй территории', color: 'bg-blue-600 hover:bg-blue-700' },
    { path: '/wars', title: 'Войны', desc: 'Сражайся с врагами', color: 'bg-red-600 hover:bg-red-700' },
    { path: '/market', title: 'Рынок', desc: 'Торгуй ресурсами', color: 'bg-green-600 hover:bg-green-700' },
    { path: '/storage', title: 'Склад', desc: 'Управляй запасами', color: 'bg-yellow-600 hover:bg-yellow-700' }
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center px-4" >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        Добро пожаловать в игру!
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8">
        Исследуй мир, веди войны и строй экономику!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {gameFeatures.map(feature => (
          <Link
            key={feature.path}
            to={feature.path}
            className={`${feature.color} p-4 rounded-lg transition block`}
          >
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-200">{feature.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
