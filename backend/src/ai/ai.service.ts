import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  async chat(message: string, history: AiMessage[]): Promise<{ reply: string; suggestions?: string[] }> {
    const lower = message.toLowerCase();

    // Budget estimation
    if (lower.includes('budget') || lower.includes('combien') || lower.includes('prix') || lower.includes('coût')) {
      return this.handleBudget(lower);
    }

    // Provider recommendations
    if (lower.includes('recommand') || lower.includes('suggest') || lower.includes('trouver') || lower.includes('cherch') || lower.includes('besoin')) {
      return this.handleRecommendation(lower);
    }

    // Event planning tips
    if (lower.includes('mariage') || lower.includes('wedding')) {
      return this.handleWeddingTips();
    }

    if (lower.includes('anniversaire') || lower.includes('birthday') || lower.includes('fête')) {
      return this.handleBirthdayTips();
    }

    // Checklist
    if (lower.includes('checklist') || lower.includes('liste') || lower.includes('préparer') || lower.includes('organiser')) {
      return this.handleChecklist(lower);
    }

    // Platform help
    if (lower.includes('comment') || lower.includes('réserver') || lower.includes('fonctionn')) {
      return this.handleHowTo();
    }

    // Default: Intelligent greeting or general response
    return this.handleGeneral(message, history);
  }

  private async handleBudget(message: string): Promise<{ reply: string; suggestions?: string[] }> {
    const providers = await this.db.providerProfile.findMany({
      include: { services: { where: { isActive: true } } },
    });

    const avgPrices: Record<string, number> = {};
    for (const p of providers) {
      if (p.services.length > 0) {
        const avg = p.services.reduce((sum: number, s: any) => sum + s.price, 0) / p.services.length;
        if (!avgPrices[p.category] || avg < avgPrices[p.category]) {
          avgPrices[p.category] = avg;
        }
      }
    }

    let budgetInfo = '💰 **Estimation de budget pour un événement complet :**\n\n';
    const categories = {
      PHOTOGRAPHER: 'Photographe',
      DECORATOR: 'Décorateur',
      VENUE: 'Salle',
      CATERING: 'Traiteur',
      CAKE: 'Pâtissier',
      BAND: 'Musique / DJ',
    };

    let total = 0;
    for (const [key, label] of Object.entries(categories)) {
      if (avgPrices[key]) {
        budgetInfo += `• ${label} : à partir de **${avgPrices[key].toLocaleString()} DT**\n`;
        total += avgPrices[key];
      }
    }

    budgetInfo += `\n📊 **Budget total estimé : ${total.toLocaleString()} — ${(total * 1.5).toLocaleString()} DT**`;
    budgetInfo += '\n\nCes prix varient selon la ville, la saison et les options choisies.';

    return {
      reply: budgetInfo,
      suggestions: ['Voir les photographes', 'Trouver une salle', 'Conseils pour réduire le budget'],
    };
  }

  private async handleRecommendation(message: string): Promise<{ reply: string; suggestions?: string[] }> {
    let category = '';
    if (message.includes('photo')) category = 'PHOTOGRAPHER';
    else if (message.includes('dj') || message.includes('musique') || message.includes('group')) category = 'BAND';
    else if (message.includes('déco') || message.includes('decor')) category = 'DECORATOR';
    else if (message.includes('gâteau') || message.includes('cake') || message.includes('pâtissier')) category = 'CAKE';
    else if (message.includes('salle') || message.includes('lieu') || message.includes('venue')) category = 'VENUE';
    else if (message.includes('traiteur') || message.includes('repas')) category = 'CATERING';
    else if (message.includes('fleur') || message.includes('floral')) category = 'FLORIST';

    const where = category ? { category, isVerified: true } : { isVerified: true };
    const providers = await this.db.providerProfile.findMany({
      where,
      orderBy: { rating: 'desc' },
      take: 3,
      include: { services: { take: 1, where: { isActive: true } } },
    });

    if (providers.length === 0) {
      return {
        reply: 'Je n\'ai pas trouvé de prestataires correspondant à votre recherche. Essayez de reformuler ou explorez directement notre catalogue.',
        suggestions: ['Explorer tous les prestataires', 'Estimer mon budget', 'Conseils planification'],
      };
    }

    let reply = '✨ **Voici mes recommandations :**\n\n';
    for (const p of providers) {
      const price = p.services[0] ? ` — à partir de ${p.services[0].price.toLocaleString()} DT` : '';
      reply += `⭐ **${p.businessName}** (${p.city}) — Note : ${p.rating}/5${price}\n`;
      if (p.description) reply += `   _${p.description.substring(0, 80)}..._\n`;
      reply += '\n';
    }

    reply += 'Vous pouvez consulter leur profil et réserver directement sur la plateforme.';

    return {
      reply,
      suggestions: ['Voir plus de détails', 'Estimer le budget total', 'Autre recommandation'],
    };
  }

  private handleWeddingTips(): { reply: string; suggestions?: string[] } {
    return {
      reply: '💍 **Conseils pour organiser votre mariage :**\n\n' +
        '**6-12 mois avant :**\n' +
        '• Définir le budget global\n' +
        '• Réserver la salle (c\'est le plus demandé !)\n' +
        '• Choisir le photographe\n\n' +
        '**3-6 mois avant :**\n' +
        '• Réserver traiteur, DJ, décorateur\n' +
        '• Commander le gâteau\n' +
        '• Envoyer les invitations\n\n' +
        '**1 mois avant :**\n' +
        '• Confirmer tous les prestataires\n' +
        '• Plan de table\n' +
        '• Essayage final\n\n' +
        '💡 **Astuce :** Réservez en avance ! Les meilleurs prestataires sont souvent pris 6 mois à l\'avance.',
      suggestions: ['Estimer le budget mariage', 'Trouver un photographe', 'Trouver une salle'],
    };
  }

  private handleBirthdayTips(): { reply: string; suggestions?: string[] } {
    return {
      reply: '🎉 **Conseils pour un anniversaire réussi :**\n\n' +
        '• **Thème :** Choisissez un thème qui plaira à l\'invité d\'honneur\n' +
        '• **Lieu :** Maison, restaurant, ou salle louée selon le nombre d\'invités\n' +
        '• **Animation :** DJ, karaoké, ou animateur pour maintenir l\'ambiance\n' +
        '• **Gâteau :** Personnalisé avec le thème choisi\n' +
        '• **Déco :** Ballons, guirlandes, centre de table\n\n' +
        '💡 **Budget moyen :** 30 000 — 80 000 DT pour 30-50 invités.',
      suggestions: ['Trouver un pâtissier', 'Trouver un DJ', 'Estimer le budget'],
    };
  }

  private handleChecklist(message: string): { reply: string; suggestions?: string[] } {
    return {
      reply: '📋 **Checklist événement :**\n\n' +
        '☐ Définir la date et le nombre d\'invités\n' +
        '☐ Fixer le budget total\n' +
        '☐ Réserver la salle / le lieu\n' +
        '☐ Choisir et réserver le traiteur\n' +
        '☐ Réserver photographe / vidéaste\n' +
        '☐ Réserver musique / DJ\n' +
        '☐ Commander le gâteau\n' +
        '☐ Planifier la décoration\n' +
        '☐ Envoyer les invitations\n' +
        '☐ Confirmer tous les prestataires 1 semaine avant\n\n' +
        '💡 Utilisez Qestra pour réserver chaque prestataire et suivre l\'avancement depuis votre dashboard !',
      suggestions: ['Estimer mon budget', 'Trouver des prestataires', 'Conseils mariage'],
    };
  }

  private handleHowTo(): { reply: string; suggestions?: string[] } {
    return {
      reply: '🔧 **Comment utiliser Qestra :**\n\n' +
        '1. **Recherchez** — Explorez les prestataires par catégorie ou ville\n' +
        '2. **Comparez** — Consultez les profils, avis et tarifs\n' +
        '3. **Réservez** — Envoyez une demande de réservation en un clic\n' +
        '4. **Suivez** — Le prestataire confirme, tout est visible dans votre dashboard\n\n' +
        'C\'est gratuit pour les clients. Les prestataires ont un espace dédié pour gérer leurs services et réservations.',
      suggestions: ['Explorer les prestataires', 'Créer un compte', 'Estimer mon budget'],
    };
  }

  private handleGeneral(message: string, history: AiMessage[]): { reply: string; suggestions?: string[] } {
    if (history.length === 0) {
      return {
        reply: '👋 Bonjour ! Je suis **Qestra AI**, votre assistant événementiel.\n\n' +
          'Je peux vous aider à :\n' +
          '• 🎯 **Recommander** des prestataires adaptés\n' +
          '• 💰 **Estimer** votre budget\n' +
          '• 📋 **Planifier** votre événement étape par étape\n' +
          '• 💡 **Conseiller** sur l\'organisation\n\n' +
          'Quel type d\'événement préparez-vous ?',
        suggestions: ['Je prépare un mariage', 'Budget pour un anniversaire', 'Trouver un photographe'],
      };
    }

    return {
      reply: 'Je comprends votre demande ! Pour mieux vous aider, pourriez-vous préciser :\n\n' +
        '• Le **type d\'événement** (mariage, anniversaire, soirée...)\n' +
        '• Le **nombre d\'invités** approximatif\n' +
        '• Votre **ville**\n\n' +
        'Ou choisissez une suggestion ci-dessous :',
      suggestions: ['Estimer mon budget', 'Recommander des prestataires', 'Checklist événement'],
    };
  }
}
