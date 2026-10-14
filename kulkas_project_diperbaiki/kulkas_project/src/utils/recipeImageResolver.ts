import { Recipe } from '../types';

/**
 * Curated high-resolution food photography URLs (from Unsplash Food Collection).
 * Optimized with CDN auto-format, responsive sizing, and high visual aesthetic
 * matching Minimalist Baker rustic editorial kitchen styling.
 */
export const DEFAULT_RECIPE_IMAGES: Record<string, string> = {
  // Spaghetti Bolognese Daging Sapi Saus Prego
  'recipe-spaghetti-bolognese':
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80',
  // Oseng Daging Sapi & Wortel Saus Tiram Kilat
  'recipe-oseng-daging':
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
  // Sup Bening Daging Sapi Wortel Kuah Bawang Hangat
  'recipe-sup-daging':
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
  // Spaghetti Aglio Olio Daging Cincang & Cabai Rawit
  'recipe-pasta-aglio':
    'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80',
  // Nasi Goreng Daging Sapi Rawit Bawang
  'recipe-nasgor-sapi':
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80',
  // Semur Kilat Daging Sapi & Wortel Bumbu Rempah
  'recipe-semur-daging-wortel':
    'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80'
};

/**
 * Intelligent thematic food photography fallback for newly created AI recipes,
 * mapped by culinary keywords, ingredients, and preparation techniques.
 */
export function resolveRecipeImageUrl(
  recipe: Partial<Recipe> | { id?: string; title?: string; theme?: string; ingredients?: Array<{ name: string }> }
): string {
  // 1. If explicit imageUrl is provided and valid, prioritize it
  if ('imageUrl' in recipe && recipe.imageUrl && typeof recipe.imageUrl === 'string' && recipe.imageUrl.startsWith('http')) {
    return recipe.imageUrl;
  }

  // 2. Check if there's a curated image for this exact recipe ID
  if (recipe.id && DEFAULT_RECIPE_IMAGES[recipe.id]) {
    return DEFAULT_RECIPE_IMAGES[recipe.id];
  }

  // 3. Keyword analysis based on title, theme, and main ingredients
  const title = (recipe.title || '').toLowerCase();
  const theme = (recipe.theme || '').toLowerCase();
  const ingText = (recipe.ingredients || []).map(i => i.name.toLowerCase()).join(' ');

  // Spaghetti / Pasta / Noodles
  if (title.includes('spaghetti') || title.includes('pasta') || theme === 'pasta' || title.includes('mie') || title.includes('fettuccine')) {
    if (title.includes('bolognese') || title.includes('tomat') || title.includes('prego')) {
      return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80';
    }
    return 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80';
  }

  // Nasi Goreng / Rice Dishes
  if (title.includes('nasi') || title.includes('nasgor') || theme === 'rice' || title.includes('rice')) {
    return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80';
  }

  // Sup / Soto / Kuah / Bening / Sayur Asem
  if (title.includes('sup') || title.includes('soto') || title.includes('kuah') || title.includes('sayur asem') || title.includes('bening') || theme === 'soup') {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80';
  }

  // Semur / Rendang / Gulai / Kari / Stew
  if (title.includes('semur') || title.includes('rendang') || title.includes('gulai') || title.includes('kari') || title.includes('stew') || theme === 'stew') {
    return 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80';
  }

  // Ayam / Chicken
  if (title.includes('ayam') || ingText.includes('ayam') || title.includes('chicken')) {
    return 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80';
  }

  // Telur / Omelet / Dadar / Ceplok
  if (title.includes('telur') || title.includes('omelet') || title.includes('dadar') || title.includes('ceplok') || ingText.includes('telur')) {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80';
  }

  // Tumis / Oseng / Wok / Cah
  if (title.includes('tumis') || title.includes('oseng') || title.includes('cah') || title.includes('capcay') || theme === 'stirfry') {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';
  }

  // Ikan / Seafood / Udang
  if (title.includes('ikan') || title.includes('udang') || title.includes('seafood') || title.includes('cumi')) {
    return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80';
  }

  // Sayuran Sehat / Salad
  if (title.includes('sayur') || title.includes('kangkung') || title.includes('bayam') || title.includes('brokoli')) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80';
  }

  // Default Warm Editorial Culinary Classic
  return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80';
}
