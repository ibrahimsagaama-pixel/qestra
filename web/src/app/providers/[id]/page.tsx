'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { ArrowLeft, MapPin, Star, CheckCircle2, Calendar, Users, FileText, Send, Camera, Music, Cake, Mic2, Palette, Building2, UtensilsCrossed, Flower2, Sparkles } from 'lucide-react';

const EVENT_TYPES = [
  { value: 'WEDDING', label: 'Mariage' },
  { value: 'ANNIVERSARY', label: 'Anniversaire' },
  { value: 'BIRTHDAY', label: 'Fête' },
  { value: 'PARTY', label: 'Soirée' },
  { value: 'DINNER', label: 'Dîner' },
  { value: 'CORPORATE', label: 'Entreprise' },
  { value: 'OTHER', label: 'Autre' },
];

const CAT_ICONS: Record<string, any> = {
  PHOTOGRAPHER: Camera, BAND: Music, CAKE: Cake, HOST: Mic2,
  DECORATOR: Palette, VENUE: Building2, CATERING: UtensilsCrossed, FLORIST: Flower2, OTHER: Sparkles,
};

const CAT_COLORS: Record<string, string> = {
  PHOTOGRAPHER: 'from-violet-500 to-purple-600', BAND: 'from-pink-500 to-rose-600',
  DECORATOR: 'from-emerald-500 to-teal-600', CAKE: 'from-amber-500 to-orange-600',
  VENUE: 'from-blue-500 to-indigo-600', CATERING: 'from-red-500 to-rose-600',
  FLORIST: 'from-pink-400 to-fuchsia-500', HOST: 'from-cyan-500 to-blue-600', OTHER: 'from-gray-500 to-gray-600',
};

export default function ProviderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [booking, setBooking] = useState({
    eventType: 'WEDDING', eventDate: '', guestCount: '', location: '', notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    api.get(`/providers/${id}`)
      .then(({ data }) => setProvider(data))
      .catch(() => router.push('/providers'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/auth/login'); return; }
    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        serviceId: selectedService.id,
        providerId: provider.id,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        guestCount: booking.guestCount ? parseInt(booking.guestCount) : undefined,
        location: booking.location,
        notes: booking.notes,
      });
      setBookingSuccess(true);
      setShowBookingForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );

  if (!provider) return null;

  const Icon = CAT_ICONS[provider.category] || Sparkles;
  const gradient = CAT_COLORS[provider.category] || CAT_COLORS.OTHER;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Qestra
          </Link>
          <button onClick={() => router.push('/providers')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Provider header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
          <div className={`h-48 bg-gradient-to-br ${gradient} relative`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-24 h-24 text-white/20" />
            </div>
          </div>
          <div className="p-8 -mt-12 relative">
            <div className="flex items-end gap-5">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl border-4 border-white`}>
                <Icon className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{provider.businessName}</h1>
                  {provider.isVerified && (
                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Vérifié</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {provider.rating > 0 ? provider.rating.toFixed(1) : 'Nouveau'}
                    </span>
                    {provider.reviewCount > 0 && (
                      <span className="text-sm text-gray-400">({provider.reviewCount} avis)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {provider.description && (
              <p className="text-gray-600 mt-5 leading-relaxed">{provider.description}</p>
            )}
          </div>
        </div>

        {/* Success message */}
        {bookingSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Réservation envoyée avec succès !</p>
              <p className="text-green-600 text-sm mt-0.5">Le prestataire va traiter votre demande. <Link href="/dashboard" className="underline font-medium">Voir mes réservations</Link></p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Services proposés</h2>
            {provider.services?.length === 0 ? (
              <p className="text-gray-400 bg-white rounded-2xl p-8 text-center">Aucun service disponible</p>
            ) : (
              <div className="space-y-3">
                {provider.services?.map((service: any) => (
                  <div key={service.id} className={`bg-white rounded-2xl p-5 border transition-all ${selectedService?.id === service.id ? 'border-purple-300 ring-2 ring-purple-100 shadow-md' : 'border-gray-100 hover:border-purple-200 hover:shadow-sm'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <span className="text-xl font-bold text-purple-600">{service.price.toLocaleString()} DT</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                    <button
                      onClick={() => { setSelectedService(service); setShowBookingForm(true); setBookingSuccess(false); }}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5"
                    >
                      Réserver ce service
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews */}
            {provider.reviews?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Avis clients</h2>
                <div className="space-y-3">
                  {provider.reviews.map((review: any) => (
                    <div key={review.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{review.client?.firstName?.[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{review.client?.firstName} {review.client?.lastName}</p>
                          <div className="flex gap-0.5 mt-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking form (sticky) */}
          {showBookingForm && selectedService && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Réserver</h3>
                <p className="text-sm text-gray-500 mb-5">{selectedService.name} — <span className="font-semibold text-purple-600">{selectedService.price.toLocaleString()} DT</span></p>
                
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Type d&apos;événement</label>
                    <select
                      value={booking.eventType}
                      onChange={(e) => setBooking({ ...booking, eventType: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date" required
                        min={new Date().toISOString().split('T')[0]}
                        value={booking.eventDate}
                        onChange={(e) => setBooking({ ...booking, eventDate: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Invités</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number" min="1"
                        value={booking.guestCount}
                        onChange={(e) => setBooking({ ...booking, guestCount: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="ex: 100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Lieu</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={booking.location}
                        onChange={(e) => setBooking({ ...booking, location: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ville ou adresse"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Notes</label>
                    <textarea
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Demandes spéciales..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      {bookingLoading ? 'Envoi...' : 'Confirmer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
