'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { LogOut, Clock, CheckCircle2, XCircle, Calendar, Plus, Package, Settings, User, Mail, Phone, Check, X } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:   { label: 'En attente',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200', icon: Clock },
  CONFIRMED: { label: 'Confirmée',   color: 'text-green-700',  bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
  CANCELLED: { label: 'Annulée',     color: 'text-red-700',    bg: 'bg-red-50 border-red-200', icon: XCircle },
  COMPLETED: { label: 'Terminée',    color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200', icon: CheckCircle2 },
};

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, logout, init } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'setup'>('bookings');

  const [setupForm, setSetupForm] = useState({
    businessName: '', description: '', category: 'PHOTOGRAPHER', city: '', address: '', website: '',
  });
  const [setupLoading, setSetupLoading] = useState(false);

  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', category: 'PHOTOGRAPHER' });
  const [serviceLoading, setServiceLoading] = useState(false);

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'PROVIDER') { router.push('/dashboard'); return; }

    Promise.all([
      api.get('/providers/me').catch(() => ({ data: null })),
      api.get('/bookings/provider').catch(() => ({ data: [] })),
    ]).then(([profileRes, bookingsRes]) => {
      setProfile(profileRes.data);
      setBookings(bookingsRes.data);
      if (!profileRes.data) setActiveTab('setup');
    }).finally(() => setLoading(false));
  }, [user]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupLoading(true);
    try {
      const { data } = await api.post('/providers', setupForm);
      setProfile(data);
      setActiveTab('bookings');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    } finally { setSetupLoading(false); }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceLoading(true);
    try {
      await api.post('/services', { ...serviceForm, price: parseFloat(serviceForm.price) });
      const { data } = await api.get('/providers/me');
      setProfile(data);
      setServiceForm({ name: '', description: '', price: '', category: setupForm.category });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    } finally { setServiceLoading(false); }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
    } catch { alert('Erreur lors de la mise à jour'); }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (!user || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { key: 'bookings', label: 'Réservations', icon: Calendar, count: bookings.filter(b => b.status === 'PENDING').length },
    { key: 'services', label: 'Services', icon: Package },
    { key: 'setup', label: 'Mon profil', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Qestra
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user.firstName[0]}</span>
              </div>
              <span className="text-sm font-semibold text-purple-700">{user.firstName} · Pro</span>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Espace prestataire</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 mb-8 border border-gray-100 w-fit shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count ? (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${activeTab === tab.key ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>
                  {tab.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* TAB: Réservations */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">Aucune réservation reçue</h3>
                <p className="text-gray-400 text-sm mt-1">Les réservations de vos clients apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => {
                  const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = status.icon;
                  return (
                    <div key={b.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{b.service?.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              <span>{b.client?.firstName} {b.client?.lastName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4" />
                              <span>{b.client?.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(b.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          {b.notes && <p className="text-sm text-gray-400 italic mt-2">&quot;{b.notes}&quot;</p>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.bg}`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                            <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
                          </div>
                          <span className="text-xl font-bold text-purple-600">{b.totalPrice?.toLocaleString()} DT</span>
                          {b.status === 'PENDING' && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')}
                                className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-green-600 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Confirmer
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(b.id, 'CANCELLED')}
                                className="flex items-center gap-1.5 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Refuser
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: Services */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Services actuels</h2>
              {!profile?.services?.length ? (
                <p className="text-gray-400 text-sm bg-white rounded-2xl p-6 border border-gray-100">Aucun service</p>
              ) : (
                <div className="space-y-3">
                  {profile.services.map((s: any) => (
                    <div key={s.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{s.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                        </div>
                        <span className="text-lg font-bold text-purple-600">{s.price?.toLocaleString()} DT</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-bold text-gray-900 mb-4">Ajouter un service</h2>
              <form onSubmit={handleAddService} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                <input required value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} placeholder="Nom du service" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input required value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Description" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input required type="number" min="0" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} placeholder="Prix (DA)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button type="submit" disabled={serviceLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-60">
                  <Plus className="w-4 h-4" />
                  {serviceLoading ? 'Ajout...' : 'Ajouter le service'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: Setup */}
        {activeTab === 'setup' && (
          <div className="max-w-lg">
            <h2 className="font-bold text-gray-900 mb-4">{profile ? 'Modifier mon profil' : 'Configurer mon profil'}</h2>
            <form onSubmit={handleSetup} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nom de l&apos;entreprise</label>
                <input required value={setupForm.businessName} onChange={(e) => setSetupForm({ ...setupForm, businessName: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="ex: Studio Lumière" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Catégorie</label>
                <select value={setupForm.category} onChange={(e) => setSetupForm({ ...setupForm, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {['PHOTOGRAPHER','BAND','FLORIST','CAKE','HOST','DECORATOR','VENUE','CATERING','OTHER'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Ville</label>
                <input required value={setupForm.city} onChange={(e) => setSetupForm({ ...setupForm, city: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="ex: Alger" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={setupForm.description} onChange={(e) => setSetupForm({ ...setupForm, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Décrivez votre activité..." />
              </div>
              <button type="submit" disabled={setupLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60">
                {setupLoading ? 'Enregistrement...' : profile ? 'Mettre à jour' : 'Créer mon profil'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
