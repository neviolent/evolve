import { useState } from 'react';

export default function Market() {
  const [activeTab, setActiveTab] = useState('buy');

  const marketItems = [
    { id: 1, name: 'Зерно', price: 10, quantity: 500, type: 'resource' },
    { id: 2, name: 'Железо', price: 25, quantity: 200, type: 'resource' },
    { id: 3, name: 'Мечи', price: 100, quantity: 50, type: 'weapon' }
  ];

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Рынок</h1>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-4 py-2 rounded transition ${
            activeTab === 'buy' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Покупка
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 rounded transition ${
            activeTab === 'sell' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Продажа
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded transition ${
            activeTab === 'history' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          История
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        {activeTab === 'buy' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">🛒 Доступные товары</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketItems.map(item => (
                <div key={item.id} className="bg-gray-700 p-4 rounded">
                  <h3 className="text-white font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">Цена: {item.price} золота</p>
                  <p className="text-gray-300 text-sm mb-3">Доступно: {item.quantity}</p>
                  <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition w-full">
                    Купить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'sell' && (
          <div className="text-center py-8">
            <p className="text-gray-300">Здесь будут ваши товары для продажи</p>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="text-center py-8">
            <p className="text-gray-300">История торговых операций</p>
          </div>
        )}
      </div>
    </div>
  );
}