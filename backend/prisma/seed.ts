import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const db = prisma as any;
  console.log('🌱 Seeding database...');

  await db.notification.deleteMany();
  await db.message.deleteMany();
  await db.review.deleteMany();
  await db.booking.deleteMany();
  await db.service.deleteMany();
  await db.providerProfile.deleteMany();
  await db.user.deleteMany();

  const hash = (pwd: string) => bcrypt.hash(pwd, 10);

  // ── Client test ──────────────────────────────────────────────────
  await db.user.create({
    data: {
      email: 'client@test.com',
      password: await hash('password123'),
      firstName: 'Ahmed',
      lastName: 'Benali',
      phone: '+213 555 123 456',
      role: 'CLIENT',
    },
  });

  // ── Prestataires ─────────────────────────────────────────────────
  const providers = [
    {
      email: 'photo@test.com', firstName: 'Yasmine', lastName: 'Khelifa',
      businessName: 'Studio Lumière', category: 'PHOTOGRAPHER', city: 'Alger',
      description: 'Photographe professionnelle spécialisée mariages et événements. +10 ans d\'expérience.',
      rating: 4.8, reviewCount: 24,
      services: [
        { name: 'Reportage mariage complet', description: 'Couverture complète (8h) + album', price: 80000 },
        { name: 'Séance photo événement', description: 'Couverture événement (4h) + retouches', price: 35000 },
      ],
    },
    {
      email: 'deco@test.com', firstName: 'Karim', lastName: 'Mansouri',
      businessName: 'Déco Prestige', category: 'DECORATOR', city: 'Alger',
      description: 'Décoration haut de gamme pour mariages, anniversaires et événements corporate.',
      rating: 4.6, reviewCount: 18,
      services: [
        { name: 'Décoration mariage complète', description: 'Salle + tables + entrée + scène', price: 120000 },
        { name: 'Décoration salle anniversaire', description: 'Thème personnalisé, ballons, tables', price: 45000 },
      ],
    },
    {
      email: 'music@test.com', firstName: 'Sofiane', lastName: 'Rahmani',
      businessName: 'DJ Sofiane Events', category: 'BAND', city: 'Oran',
      description: 'DJ professionnel avec 8 ans d\'expérience. Sonorisation complète fournie.',
      rating: 4.9, reviewCount: 42,
      services: [
        { name: 'Animation soirée DJ (6h)', description: 'DJ + sonorisation + lumières', price: 60000 },
        { name: 'Animation mariage (12h)', description: 'DJ full day + matériel complet', price: 100000 },
      ],
    },
    {
      email: 'cake@test.com', firstName: 'Nadia', lastName: 'Boucherit',
      businessName: 'Sweet Dreams Pâtisserie', category: 'CAKE', city: 'Constantine',
      description: 'Gâteaux de mariage et wedding cakes personnalisés. Livraison dans toute l\'Algérie.',
      rating: 4.7, reviewCount: 31,
      services: [
        { name: 'Wedding cake 5 étages', description: 'Gâteau mariage 5 étages, personnalisé', price: 35000 },
        { name: 'Gâteau anniversaire', description: 'Gâteau thème personnalisé (10-15 parts)', price: 8000 },
      ],
    },
    {
      email: 'venue@test.com', firstName: 'Hamid', lastName: 'Zerrouki',
      businessName: 'Villa El Riad', category: 'VENUE', city: 'Alger',
      description: 'Villa avec jardin pour mariages et réceptions. Capacité 300 personnes. Parking.',
      rating: 4.5, reviewCount: 15,
      services: [
        { name: 'Location salle mariage (1 jour)', description: 'Salle 300 pers + jardin + parking', price: 200000 },
        { name: 'Location salle événement (1/2 journée)', description: 'Salle 150 personnes, 5h', price: 80000 },
      ],
    },
    {
      email: 'catering@test.com', firstName: 'Samira', lastName: 'Hadj',
      businessName: 'Traiteur Al Baraka', category: 'CATERING', city: 'Oran',
      description: 'Traiteur spécialisé cuisine algérienne traditionnelle et moderne. Menu sur mesure.',
      rating: 4.4, reviewCount: 28,
      services: [
        { name: 'Menu mariage complet (par personne)', description: 'Entrées + plat + dessert', price: 3500 },
        { name: 'Buffet froid (par personne)', description: 'Buffet froid varié pour cocktail', price: 1800 },
      ],
    },
  ];

  for (const p of providers) {
    const user = await db.user.create({
      data: {
        email: p.email,
        password: await hash('password123'),
        firstName: p.firstName,
        lastName: p.lastName,
        role: 'PROVIDER',
      },
    });

    const profile = await db.providerProfile.create({
      data: {
        userId: user.id,
        businessName: p.businessName,
        category: p.category,
        city: p.city,
        description: p.description,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isVerified: true,
      },
    });

    for (const s of p.services) {
      await db.service.create({
        data: {
          providerId: profile.id,
          name: s.name,
          description: s.description,
          price: s.price,
          category: p.category,
        },
      });
    }
  }

  console.log('✅ Seed terminé !');
  console.log('\nComptes de test:');
  console.log('  CLIENT   → client@test.com / password123');
  console.log('  PROVIDER → photo@test.com / password123');
  console.log('  PROVIDER → deco@test.com / password123');
}

main()
  .catch(console.error)
  .finally(() => (prisma as any).$disconnect());
