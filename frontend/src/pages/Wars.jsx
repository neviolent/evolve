export default function Wars() {
  const activeWars = [
    { id: 1, enemy: 'Восточное королевство', status: 'В процессе', troops: 1500 },
    { id: 2, enemy: 'Горные кланы', status: 'Подготовка', troops: 800 }
  ];

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Войны</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            ⚔️ Активные войны
          </h2>
          <div className="space-y-3">
            {activeWars.map(war => (
              <div key={war.id} className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{war.enemy}</span>
                  <span className="text-yellow-400 text-sm">{war.status}</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">Войска: {war.troops}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-white flex items-center">
            📜 История войн
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Морские пираты</span>
                <span className="text-green-400 text-sm">Победа</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">Завершена 3 дня назад</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Лесные эльфы</span>
                <span className="text-blue-400 text-sm">Мир</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">Завершена неделю назад</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}