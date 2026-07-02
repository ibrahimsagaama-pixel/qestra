'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Search, MapPin, Star, Camera, Music, Cake, Mic2, Palette, Building2, UtensilsCrossed, Flower2, Sparkles, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'Tous', icon: Sparkles },
  { value: 'PHOTOGRAPHER', label: 'Photo', icon: Camera },
  { value: 'BAND', label: 'Musique', icon: Music },
  { value: 'DECORATOR', label: 'Déco', icon: Palette },
  { value: 'CAKE', label: 'Pâtisserie', icon: Cake },
  { value: 'VENUE', label: 'Salles', icon: Building2 },
  { value: 'CATERING', label: 'Traiteur', icon: UtensilsCrossed },
  { value: 'FLORIST', label: 'Fleurs', icon: Flower2 },
  { value: 'HOST', label: 'Animation', icon: Mic2 },
];

const CATEGORY_COLORS: Record<string, string> = {
  PHOTOGRAPHER: 'from-violet-500 to-purple-600',
  BAND: 'from-pink-500 to-rose-600',
  DECORATOR: 'from-emerald-500 to-teal-600',
  CAKE: 'from-amber-500 to-orange-600',
  VENUE: 'from-blue-500 to-indigo-600',
  CATERING: 'from-red-500 to-rose-600',
  FLORIST: 'from-pink-400 to-fuchsia-500',
  HOST: 'from-cyan-500 to-blue-600',
  OTHER: 'from-gray-500 to-gray-600',
};

interface Provider {
  id: string;
  businessName: string;
  description?: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  services: { name: string; price: number }[];
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (city) params.append('city', city);
      const { data } = await api.get(`/providers?${params}`);
      setProviders(data);
    } catch {
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviders(); }, [category]);

  const getCategoryIcon = (cat: string) => {
    const found = CATEGORIES.find(c => c.value === cat);
    return found?.icon || Sparkles;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Qestra
          </Link>
          <div className="flex gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-purple-600 px-4 py-2">
              Connexion
            </Link>
            <Link href="/auth/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all">
              Inscription
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Trouver un prestataire</h1>
          <p className="text-gray-500">Découvrez les meilleurs professionnels de l&apos;événementiel</p>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ville..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProviders()}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchProviders}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all"
          >
            Rechercher
          </button>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat.value
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun prestataire trouvé</h3>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => {
              const Icon = getCategoryIcon(p.category);
              const gradient = CATEGORY_COLORS[p.category] || CATEGORY_COLORS.OTHER;
              return (
                <Link
                  key={p.id}
                  href={`/providers/${p.id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-50 transition-all overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  {/* Image header with gradient */}
                  <div className={`h-44 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-white" />
                      <span className="text-xs font-semibold text-white">
                        {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white rounded-full px-3 py-1.5 shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">
                          {p.rating > 0 ? p.rating.toFixed(1) : 'Nouveau'}
                        </span>
                        {p.reviewCount > 0 && (
                          <span className="text-xs text-gray-400">({p.reviewCount})</span>
                        )}
                      </div>
                    </div>
                    {/* Large icon centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-20 h-20 text-white/20" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                      {p.businessName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{p.city}</span>
                    </div>
                    {p.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{p.description}</p>
                    )}
                    {p.services?.[0] && (
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-xs text-gray-400">À partir de</span>
                        <span className="text-lg font-bold text-purple-600">
                          {p.services[0].price.toLocaleString()} DT
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
