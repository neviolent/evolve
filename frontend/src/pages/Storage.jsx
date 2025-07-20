export default function Storage() {
  const resources = [
    { name: 'Зерно', icon: '🌾', amount: 1250, maxCapacity: 2000 },
    { name: 'Железо', icon: '⚒️', amount: 430, maxCapacity: 1000 },
    { name: 'Золото', icon: '💰', amount: 89, maxCapacity: 500 },
    { name: 'Оружие', icon: '⚔️', amount: 156, maxCapacity: 300 }
  ];

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Склад</h1>
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-white">📦 Ваши ресурсы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource, index) => {
            const percentage = (resource.amount / resource.maxCapacity) * 100;
            return (
              <div key={index} className="bg-gray-700 p-4 rounded">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{resource.icon}</div>
                  <div className="text-white font-bold">{resource.name}</div>
                  <div className="text-gray-300">{resource.amount} / {resource.maxCapacity}</div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-center text-xs text-gray-400 mt-1">
                  {Math.round(percentage)}% заполнено
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-gray-700 p-4 rounded">
          <h3 className="text-white font-bold mb-2">Управление складом</h3>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition">
              Расширить склад
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm transition">
              Организовать ресурсы
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}