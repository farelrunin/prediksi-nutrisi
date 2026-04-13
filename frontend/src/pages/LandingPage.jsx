import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, BarChart3, Users, Shield } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <Apple className="text-green-600" size={64} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Prediksi Nutrisi Cerdas
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pantau asupan gizi harian Anda dengan bantuan AI. Dapatkan rekomendasi personal
            untuk hidup sehat dan cegah risiko malnutrisi.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Mulai Sekarang
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Interaktif</h3>
              <p className="text-gray-600">
                Visualisasi grafik asupan harian dan tren mingguan nutrisi Anda.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prediksi Risiko AI</h3>
              <p className="text-gray-600">
                Analisis risiko malnutrisi dengan teknologi machine learning terkini.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rekomendasi Personal</h3>
              <p className="text-gray-600">
                Saran makanan yang disesuaikan dengan profil kesehatan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;