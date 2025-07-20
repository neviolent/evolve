import WorldMap from '../components/WorldMap'

export default function Map() {
  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Карта мира</h1>
      <div className="flex-grow" style={{ backgroundColor: '#cceeff' }}>
        <WorldMap />
      </div>
    </div>
  )
}
