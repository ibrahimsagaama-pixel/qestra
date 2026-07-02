'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Plus, Calendar, Clock, CheckCircle2, XCircle, LogOut, Search, User } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:   { label: 'En attente',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200', icon: Clock },
  CONFIRMED: { label: 'Confirmée',   color: 'text-green-700',  bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
  CANCELLED: { label: 'Annulée',     color: 'text-red-700',    bg: 'bg-red-50 border-red-200', icon: XCircle },
  COMPLETED: { label: 'Terminée',    color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200', icon: CheckCircle2 },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, init } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get('/bookings/client')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => { logout(); router.push('/'); };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Qestra
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user.firstName[0]}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.firstName}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
            <p className="text-gray-500 text-sm mt-1">Suivez vos événements en cours</p>
          </div>
          <Link
            href="/providers"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Nouvelle réservation
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune réservation</h3>
            <p className="text-gray-400 mb-6">Vous n&apos;avez pas encore réservé de prestataire</p>
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <Search className="w-4 h-4" />
              Trouver un prestataire
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;
              return (
                <div key={b.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{b.service?.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{b.provider?.businessName}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(b.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.bg}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                        <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">{b.totalPrice?.toLocaleString()} DT</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
