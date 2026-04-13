import { useState } from 'react'
import axios from 'axios'
import { User, Apple, BarChart3, History, Settings } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [formData, setFormData] = useState({
    food_name: '',
    quantity: '',
    age: '',
    condition: ''
  })
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    condition: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/predict', {
        food_name: formData.food_name,
        quantity: parseFloat(formData.quantity),
        age: parseInt(formData.age),
        condition: formData.condition
      })
      setPrediction(response.data)
      setHistory([...history, { ...formData, ...response.data, timestamp: new Date() }])
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghubungi API')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  // Mock data for chart
  const chartData = history.length > 0 ? history.map((item, index) => ({
    name: `Prediksi ${index + 1}`,
    score: item.score
  })) : [
    { name: 'Prediksi 1', score: 0.2 },
    { name: 'Prediksi 2', score: 0.5 },
    { name: 'Prediksi 3', score: 0.8 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Apple className="text-green-600" />
              Prediksi Nutrisi
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-md ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Beranda
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <History size={16} />
                Riwayat
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Settings size={16} />
                Profil
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <User className="text-blue-600" />
                Input Data Makanan
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Makanan</label>
                  <input
                    type="text"
                    name="food_name"
                    value={formData.food_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jumlah (gram)</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usia Anak</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Usia anak dalam tahun"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kondisi</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih kondisi</option>
                    <option value="anak">Anak</option>
                    <option value="ibu hamil">Ibu Hamil</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Prediksi Nutrisi'}
                </button>
              </form>

              {prediction && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold">Hasil Prediksi:</h3>
                  <p>Risk Level: <span className={`font-bold ${prediction.risk_level === 'Low' ? 'text-green-600' : prediction.risk_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>{prediction.risk_level}</span></p>
                  <p>Score: {prediction.score}</p>
                  <p>Saran: {prediction.suggestion}</p>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="text-green-600" />
                Grafik Risiko Nutrisi
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <History className="text-blue-600" />
              Riwayat Prediksi
            </h2>
            {history.length === 0 ? (
              <p className="text-gray-600">Belum ada riwayat prediksi.</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <p><strong>Makanan:</strong> {item.food_name}</p>
                    <p><strong>Jumlah:</strong> {item.quantity}g</p>
                    <p><strong>Risk Level:</strong> {item.risk_level}</p>
                    <p><strong>Score:</strong> {item.score}</p>
                    <p><strong>Saran:</strong> {item.suggestion}</p>
                    <p className="text-sm text-gray-500">Waktu: {item.timestamp.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="text-blue-600" />
              Profil Pengguna
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usia</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kondisi</label>
                <select
                  name="condition"
                  value={profile.condition}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Pilih kondisi</option>
                  <option value="anak">Anak</option>
                  <option value="ibu hamil">Ibu Hamil</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Simpan Profil
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
