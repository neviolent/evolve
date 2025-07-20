import { useRef, useState, useEffect } from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';
import WorldSvg from '../assets/World.jsx';

export default function WorldMap() {
  const Viewer = useRef(null);
  const [tool, setTool] = useState('auto');
  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Динамические данные из БД
  const [regions, setRegions] = useState({});
  const [states, setStates] = useState({});
  const [loading, setLoading] = useState(true);

  // Загрузка данных из БД
  useEffect(() => {
    loadRegionsData();
    loadStatesData();
  }, []);

  useEffect(() => {
    if (Viewer.current) {
      Viewer.current.fitToViewer();
    }
  }, []);

  // Функция загрузки данных о регионах
  async function loadRegionsData() {
    try {
      const response = await fetch('/api/regions');
      const data = await response.json();
      
      // Преобразуем массив в объект для быстрого доступа
      const regionsMap = {};
      data.forEach(region => {
        regionsMap[region.svg_id] = region;
      });
      
      setRegions(regionsMap);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки регионов:', error);
      setLoading(false);
    }
  }

  // Функция загрузки данных о государствах
  async function loadStatesData() {
    try {
      const response = await fetch('/api/states');
      const data = await response.json();
      
      const statesMap = {};
      data.forEach(state => {
        statesMap[state.id] = state;
      });
      
      setStates(statesMap);
    } catch (error) {
      console.error('Ошибка загрузки государств:', error);
    }
  }

  // Обработчик клика по региону
  function handleRegionClick(regionId) {
    const region = regions[regionId];
    if (region) {
      console.log("Клик по региону:", region);
      setSelected(regionId);
      
      // Здесь можно добавить логику для различных действий:
      // - Показать детали региона
      // - Начать атаку (если игрок может)
      // - Показать экономические данные
      // - Переместить армию и т.д.
    }
  }

  // Обработчик наведения на регион
  function handleRegionHover(regionId, event) {
    if (regions[regionId]) {
      setHovered(regionId);
      if (event) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    }
  }

  function handleRegionLeave() {
    setHovered(null);
  }

  // Получение цвета региона по принадлежности к государству
  function getRegionColor(region) {
    if (!region || !region.state_id) {
      return '#888888'; // Нейтральные регионы
    }
    
    const state = states[region.state_id];
    return state ? state.color : '#888888';
  }

  // Получение данных о регионе для отображения
  function getRegionDisplayData(regionId) {
    const region = regions[regionId];
    if (!region) return null;
    
    const state = region.state_id ? states[region.state_id] : null;
    
    return {
      name: region.name,
      population: region.population,
      economy: region.economy_level,
      defense: region.defense_level,
      state: state ? {
        name: state.name,
        flag: state.flag_url,
        color: state.color
      } : null,
      coat_of_arms: region.coat_of_arms_url
    };
  }

  // Генерация CSS стилей для регионов на основе данных БД
  function generateRegionStyles() {
    let styles = '';
    
    Object.keys(regions).forEach(regionId => {
      const region = regions[regionId];
      const color = getRegionColor(region);
      
      styles += `
        g[id="${regionId}"] path,
        g[id="${regionId}"] polygon {
          fill: ${color} !important;
          stroke: #333 !important;
          stroke-width: 0.5px !important;
          transition: all 0.2s ease !important;
          cursor: pointer !important;
        }
        
        g[id="${regionId}"]:hover path,
        g[id="${regionId}"]:hover polygon {
          filter: brightness(1.2) !important;
          stroke: #fff !important;
          stroke-width: 2px !important;
        }
      `;
    });
    
    // Стиль для выбранного региона
    if (selected) {
      styles += `
        g[id="${selected}"] path,
        g[id="${selected}"] polygon {
          stroke: #ffd700 !important;
          stroke-width: 3px !important;
          filter: brightness(1.3) !important;
        }
      `;
    }
    
    return styles;
  }

  if (loading) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        Загрузка карты мира...
      </div>
    );
  }

  const hoveredData = hovered ? getRegionDisplayData(hovered) : null;
  const selectedData = selected ? getRegionDisplayData(selected) : null;

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1e1e1e', position: 'relative' }}>
      <style>
        {`
          svg > rect[fill="#fff"] { fill: none !important; }
          
          .info-tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            pointer-events: none;
            max-width: 280px;
            border: 1px solid #444;
          }
          
          .region-panel {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 6px 30px rgba(0, 0, 0, 0.6);
            border: 1px solid #444;
          }
          
          .coat-of-arms {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: 10px;
          }
          
          .state-flag {
            width: 30px;
            height: 20px;
            object-fit: cover;
            border-radius: 2px;
            margin-right: 8px;
          }
          
          .region-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          
          .region-name {
            font-size: 1.4em;
            font-weight: bold;
          }
          
          .region-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 15px;
          }
          
          .stat-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 8px;
            border-radius: 4px;
            text-align: center;
          }
          
          .stat-value {
            font-size: 1.2em;
            font-weight: bold;
            color: #4fc3f7;
          }
          
          .stat-label {
            font-size: 0.8em;
            opacity: 0.8;
          }
          
          ${generateRegionStyles()}
        `}
      </style>

      <ReactSVGPanZoom
        width={window.innerWidth}
        height={window.innerHeight}
        ref={Viewer}
        tool={tool}
        onChangeTool={setTool}
        value={value}
        onChangeValue={setValue}
        detectAutoPan={false}
        miniatureProps={{ visible: false }}
        background="#2c3e50"
      >
        <svg viewBox="0 0 1800 1000" style={{ width: '100%', height: '100%' }}>
          <rect x="0" y="0" width="1800" height="1000" fill="#2c3e50" />
         
          <g 
            onClick={(e) => {
              const regionId = e.target.closest('g[id]')?.id;
              if (regionId && regionId !== 'World' && regionId !== 'World_2' && regions[regionId]) {
                handleRegionClick(regionId);
              }
            }}
            onMouseMove={(e) => {
              const regionId = e.target.closest('g[id]')?.id;
              if (regionId && regionId !== 'World' && regionId !== 'World_2' && regions[regionId]) {
                handleRegionHover(regionId, e);
              }
            }}
            onMouseLeave={handleRegionLeave}
          >
            <WorldSvg />
          </g>
        </svg>
      </ReactSVGPanZoom>

      {/* Tooltip при наведении */}
      {hoveredData && (
        <div 
          className="info-tooltip"
          style={{
            left: mousePosition.x + 15,
            top: mousePosition.y - 10,
            transform: mousePosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="region-header">
            {hoveredData.coat_of_arms && (
              <img 
                src={hoveredData.coat_of_arms} 
                alt="Герб" 
                className="coat-of-arms"
              />
            )}
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                {hoveredData.name}
              </div>
              {hoveredData.state && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                  {hoveredData.state.flag && (
                    <img 
                      src={hoveredData.state.flag} 
                      alt="Флаг государства" 
                      className="state-flag"
                    />
                  )}
                  <span style={{ fontSize: '14px', opacity: '0.9' }}>
                    {hoveredData.state.name}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: '12px', opacity: '0.7' }}>
            Население: {hoveredData.population?.toLocaleString() || 'Неизвестно'}
          </div>
        </div>
      )}

      {/* Панель с детальной информацией о выбранном регионе */}
      {selectedData && (
        <div className="region-panel">
          <div 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              cursor: 'pointer',
              fontSize: '20px',
              opacity: '0.7'
            }}
            onClick={() => setSelected(null)}
          >
            ✕
          </div>
          
          <div className="region-header">
            {selectedData.coat_of_arms && (
              <img 
                src={selectedData.coat_of_arms} 
                alt="Герб региона" 
                className="coat-of-arms"
              />
            )}
            <div>
              <div className="region-name">
                {selectedData.name}
              </div>
              {selectedData.state && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                  {selectedData.state.flag && (
                    <img 
                      src={selectedData.state.flag} 
                      alt="Флаг государства" 
                      className="state-flag"
                    />
                  )}
                  <span style={{ fontSize: '16px' }}>
                    {selectedData.state.name}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="region-stats">
            <div className="stat-item">
              <div className="stat-value">
                {selectedData.population?.toLocaleString() || '0'}
              </div>
              <div className="stat-label">Население</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-value">
                {selectedData.economy || '0'}
              </div>
              <div className="stat-label">Экономика</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-value">
                {selectedData.defense || '0'}
              </div>
              <div className="stat-label">Оборона</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-value" style={{ 
                color: selectedData.state ? selectedData.state.color : '#888'
              }}>
                {selectedData.state ? 'Занят' : 'Свободен'}
              </div>
              <div className="stat-label">Статус</div>
            </div>
          </div>
          
          {/* Здесь можно добавить кнопки действий */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button style={{
              flex: 1,
              padding: '8px 12px',
              background: '#4fc3f7',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}>
              Подробнее
            </button>
            <button style={{
              flex: 1,
              padding: '8px 12px',
              background: '#f44336',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}>
              Атаковать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}