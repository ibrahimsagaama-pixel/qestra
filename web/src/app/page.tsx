import Link from 'next/link';
import { Camera, Palette, Music, Cake, Building2, UtensilsCrossed, Flower2, Mic2, ArrowRight, Star, CheckCircle2, Search, CalendarCheck, PartyPopper } from 'lucide-react';

const categories = [
  { icon: Camera, label: 'Photographes', color: 'from-violet-500 to-purple-600' },
  { icon: Music, label: 'Groupes & DJ', color: 'from-pink-500 to-rose-600' },
  { icon: Cake, label: 'Pâtissiers', color: 'from-amber-500 to-orange-600' },
  { icon: Building2, label: 'Salles', color: 'from-blue-500 to-indigo-600' },
  { icon: Palette, label: 'Décorateurs', color: 'from-emerald-500 to-teal-600' },
  { icon: UtensilsCrossed, label: 'Traiteurs', color: 'from-red-500 to-rose-600' },
  { icon: Flower2, label: 'Fleuristes', color: 'from-pink-400 to-fuchsia-500' },
  { icon: Mic2, label: 'Animateurs', color: 'from-cyan-500 to-blue-600' },
];

const stats = [
  { value: '200+', label: 'Prestataires' },
  { value: '1500+', label: 'Événements' },
  { value: '4.8', label: 'Note moyenne' },
  { value: '98%', label: 'Satisfaction' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Qestra
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/providers" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
              Prestataires
            </Link>
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 -translate-x-1/2" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-30 translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
            <span className="text-sm font-medium text-purple-700">La plateforme #1 pour vos événements</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
            Votre événement,
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              notre expertise
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Trouvez, comparez et réservez les meilleurs prestataires pour vos mariages,
            anniversaires et événements. Tout en un seul endroit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/providers"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-purple-200 transition-all hover:-translate-y-0.5"
            >
              Explorer les prestataires
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/register?role=PROVIDER"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-purple-300 hover:text-purple-600 transition-all"
            >
              Je suis prestataire
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Tous les services pour votre événement
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Des professionnels qualifiés dans chaque catégorie
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/providers`}
                className="group bg-white rounded-2xl p-6 flex flex-col items-center gap-3 border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-50 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Simple comme 1, 2, 3
            </h2>
            <p className="text-gray-500 text-lg">Organisez votre événement en quelques clics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, step: '01', title: 'Recherchez', desc: 'Parcourez des centaines de prestataires par catégorie, ville ou budget', color: 'from-purple-500 to-indigo-500' },
              { icon: CalendarCheck, step: '02', title: 'Réservez', desc: 'Choisissez le service parfait et envoyez une demande de réservation', color: 'from-indigo-500 to-blue-500' },
              { icon: PartyPopper, step: '03', title: 'Célébrez', desc: 'Le prestataire confirme et votre événement est prêt !', color: 'from-violet-500 to-purple-500' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-purple-50 transition-all group">
                <div className="text-5xl font-black text-gray-100 absolute top-4 right-6 group-hover:text-purple-50 transition-colors">
                  {item.step}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Qestra */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            Pourquoi choisir Qestra ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { title: 'Prestataires vérifiés', desc: 'Chaque professionnel est vérifié pour garantir la qualité' },
              { title: 'Réservation sécurisée', desc: 'Processus simple et transparent du début à la fin' },
              { title: 'Support 24/7', desc: 'Notre équipe vous accompagne à chaque étape' },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <CheckCircle2 className="w-8 h-8 text-green-300 mb-4 mx-auto" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-purple-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Prêt à organiser votre événement ?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Rejoignez des milliers d&apos;utilisateurs qui font confiance à Qestra
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-purple-200 transition-all hover:-translate-y-0.5"
          >
            Créer mon compte gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Qestra
          </div>
          <p className="text-sm text-gray-400">
            © 2026 Qestra — Plateforme d&apos;événements
          </p>
          <div className="flex gap-6">
            <Link href="/providers" className="text-sm text-gray-500 hover:text-purple-600">Prestataires</Link>
            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-purple-600">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
