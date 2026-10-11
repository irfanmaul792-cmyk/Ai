import React, { useState, useEffect, useTransition } from 'react';
import { Navbar } from './components/Navbar';
import { KitchenBackgroundBanner } from './components/KitchenBackgroundBanner';
import { SmartFridgeModel } from './components/SmartFridgeModel';
import { PhotoUploader } from './components/PhotoUploader';
import { RecipeCard } from './components/RecipeCard';
import { CookingModeModal } from './components/CookingModeModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { ShareRecipeModal } from './components/ShareRecipeModal';
import { AuthModal } from './components/AuthModal';
import { AuthDashboard } from './components/AuthDashboard';
import { AccountMenuModal } from './components/AccountMenuModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { SearchModeSelector, SearchMode } from './components/SearchModeSelector';
import { INITIAL_INGREDIENTS } from './data/initialIngredients';
import { RECIPES_DATABASE } from './data/recipes';
import { generateDynamicRecipes } from './utils/recipeGenerator';
import { resolveIngredientIcon } from './utils/ingredientVisuals';
import { Ingredient, UploadedPhoto, Recipe, FilterOptions, ShoppingItem, User } from './types';
import { db } from './services/db';
import {
  Search,
  Sparkles,
  Refrigerator,
  Camera,
  Layers,
  Flame,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  ChefHat,
  Check,
  Zap,
  Info,
  Bookmark,
  ShoppingBag,
  Share2
} from 'lucide-react';

interface DetectedIngredientItem {
  name: string;
  quantity: string;
  category: string;
  urgency: string;
  shelf: string;
  icon?: string;
}

export default function App() {
  // Check Gemini API status
  const [geminiConnected, setGeminiConnected] = useState<boolean | null>(null);

  // User Authentication & Multi-Account Database State
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'switch'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      if (params.get('auth') === 'register' || params.get('mode') === 'register' || params.has('register') || params.has('daftar') || hash.includes('register') || hash.includes('daftar')) {
        return 'register';
      }
      if (params.get('auth') === 'login' || params.get('mode') === 'login' || params.has('login') || params.has('logout') || hash.includes('login') || hash.includes('masuk')) {
        return 'login';
      }
    }
    const users = db.getUsers();
    if (users.length === 0) return 'register';
    const cur = db.getCurrentUser();
    return cur ? 'switch' : 'login';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Check URL parameters for explicit login/logout commands
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const hasAuthParam = 
        params.get('auth') === 'login' || 
        params.get('mode') === 'login' || 
        params.has('login') || 
        params.has('logout') ||
        params.get('auth') === 'register' ||
        params.get('mode') === 'register' ||
        params.has('register') ||
        params.has('daftar') ||
        hash.includes('login') ||
        hash.includes('register') ||
        hash.includes('masuk');

      if (hasAuthParam) {
        db.logout();
        return null;
      }
    }
    return db.getCurrentUser();
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const hasAuthParam = 
        params.get('auth') === 'login' || 
        params.get('mode') === 'login' || 
        params.has('login') || 
        params.has('logout') ||
        params.get('auth') === 'register' ||
        params.get('mode') === 'register' ||
        params.has('register') ||
        params.has('daftar') ||
        hash.includes('login') ||
        hash.includes('register') ||
        hash.includes('masuk');

      if (hasAuthParam) {
        return true;
      }
    }
    // Also if no user logged in, prompt user to log in or register
    return db.getCurrentUser() === null;
  });

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);

  // Monitor URL params dynamically for shareable login links
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const evaluateUrlAuth = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();

      const isRegister = 
        params.get('auth') === 'register' || 
        params.get('mode') === 'register' || 
        params.has('register') || 
        params.has('daftar') ||
        hash.includes('register') ||
        hash.includes('daftar');

      const isLogin = 
        params.get('auth') === 'login' || 
        params.get('mode') === 'login' || 
        params.has('login') || 
        params.has('logout') ||
        params.has('keluar') ||
        hash.includes('login') ||
        hash.includes('logout') ||
        hash.includes('masuk');

      if (isRegister) {
        db.logout();
        setCurrentUser(null);
        setIngredients([]);
        setSelectedFridgeIds({});
        setAuthModalMode('register');
        setIsAuthModalOpen(true);
      } else if (isLogin) {
        db.logout();
        setCurrentUser(null);
        setIngredients([]);
        setSelectedFridgeIds({});
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      }
    };

    evaluateUrlAuth();
    window.addEventListener('popstate', evaluateUrlAuth);
    window.addEventListener('hashchange', evaluateUrlAuth);
    return () => {
      window.removeEventListener('popstate', evaluateUrlAuth);
      window.removeEventListener('hashchange', evaluateUrlAuth);
    };
  }, []);

  // Ingredients in Kulkas Pintar (Isolated per user account - starts clean/empty for new user!)
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const user = db.getCurrentUser();
    if (user) {
      const data = db.getUserData(user.id);
      return data.ingredients || [];
    }
    return [];
  });

  // Selected ingredients from Kulkas Pintar for recipe search
  const [selectedFridgeIds, setSelectedFridgeIds] = useState<Record<string, boolean>>(() => {
    const user = db.getCurrentUser();
    if (user) {
      const data = db.getUserData(user.id);
      return data.selectedFridgeIds || {};
    }
    return {};
  });

  // Search mode state: 3 Options
  // 1. 'fridge_only' : Cari dari bahan kulkas
  // 2. 'photo_only'  : Cari dari foto yang di-upload
  // 3. 'hybrid'      : Gabungan foto + bahan kulkas
  const [searchMode, setSearchMode] = useState<SearchMode>('fridge_only');

  // Photo state (Starts empty)
  const [photos, setPhotos] = useState<UploadedPhoto[]>(() => {
    const user = db.getCurrentUser();
    return user ? db.getUserData(user.id).photos || [] : [];
  });

  // AI Vision states
  const [isAnalyzingPhotos, setIsAnalyzingPhotos] = useState<boolean>(false);
  const [visionSummary, setVisionSummary] = useState<string>('');
  const [detectedIngredientsList, setDetectedIngredientsList] = useState<DetectedIngredientItem[]>([]);
  const [photoDetectedItems, setPhotoDetectedItems] = useState<string[]>([]);
  const [visionError, setVisionError] = useState<string | null>(null);

  // AI Recipe generation states
  const [isGeneratingAiRecipes, setIsGeneratingAiRecipes] = useState<boolean>(false);
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Preference filters
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const user = db.getCurrentUser();
    return user ? db.getUserData(user.id).filters || {
      budget: 'Bebas',
      cookingTime: 'Maks. 30 menit',
      servings: '2',
      preferences: 'suka pedas'
    } : {
      budget: 'Bebas',
      cookingTime: 'Maks. 30 menit',
      servings: '2',
      preferences: 'suka pedas'
    };
  });

  // UI state
  const [activeRecipeForCooking, setActiveRecipeForCooking] = useState<Recipe | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [, startTransition] = useTransition();

  // Opsi 1: Shopping list state with user database persistence
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const user = db.getCurrentUser();
    return user ? db.getUserData(user.id).shoppingItems || [] : [];
  });
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState<boolean>(false);

  // Opsi 3: Favorite recipes state with user database persistence
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>(() => {
    const user = db.getCurrentUser();
    return user ? db.getUserData(user.id).favoriteRecipes || [] : [];
  });

  // Opsi 4: Share modal state
  const [sharingRecipe, setSharingRecipe] = useState<Recipe | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Change Password Modal state
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

  // Logout confirmation modal state
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  // Persist user's inventory, shopping items, and favorites directly into their database account
  useEffect(() => {
    if (currentUser) {
      db.saveUserData(currentUser.id, {
        userId: currentUser.id,
        ingredients,
        selectedFridgeIds,
        shoppingItems,
        favoriteRecipes,
        filters,
        photos,
        updatedAt: Date.now()
      });
    }
  }, [currentUser, ingredients, selectedFridgeIds, shoppingItems, favoriteRecipes, filters, photos]);

  // Account management handlers
  const handleUserChanged = (newUser: User) => {
    setCurrentUser(newUser);
    const data = db.getUserData(newUser.id);
    setIngredients(data.ingredients || []);
    setSelectedFridgeIds(data.selectedFridgeIds || {});
    setShoppingItems(data.shoppingItems || []);
    setFavoriteRecipes(data.favoriteRecipes || []);
    if (data.filters) setFilters(data.filters);
    if (data.photos) setPhotos(data.photos);
    showToast(`Beralih ke akun ${newUser.name}. Stok kulkas: ${(data.ingredients || []).length} bahan.`);
  };

  const handleClearFridge = () => {
    if (!currentUser) return;
    setIngredients([]);
    setSelectedFridgeIds({});
    db.clearUserFridge(currentUser.id);
    showToast('Kulkas berhasil dikosongkan!');
  };

  const handleLoadSampleIngredients = () => {
    if (!currentUser) return;
    setIngredients(INITIAL_INGREDIENTS);
    const map: Record<string, boolean> = {};
    INITIAL_INGREDIENTS.forEach(ing => {
      map[ing.id] = true;
    });
    setSelectedFridgeIds(map);
    showToast('Contoh bahan berhasil ditambahkan ke kulkas!');
  };

  const handleLogout = (targetMode: 'login' | 'register' | 'switch' = 'login') => {
    db.logout();
    setCurrentUser(null);
    setIngredients([]);
    setSelectedFridgeIds({});
    showToast('Berhasil keluar dari akun.');
    setAuthModalMode(targetMode);
    setIsAuthModalOpen(false);
  };

  // Opsi 1 Handlers: Shopping List
  const handleAddShoppingItem = (name: string, amount: string) => {
    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      amount,
      isBought: false,
      createdAt: Date.now(),
    };
    setShoppingItems(prev => [newItem, ...prev]);
    showToast(`🛒 "${name}" ditambahkan ke Daftar Belanja`);
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isBought: !item.isBought } : item))
    );
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearBoughtShoppingItems = () => {
    setShoppingItems(prev => prev.filter(item => !item.isBought));
    showToast('Bahan yang sudah dibeli telah dibersihkan');
  };

  const handleClearAllShoppingItems = () => {
    setShoppingItems([]);
    showToast('Daftar belanja telah dikosongkan');
  };

  const handleAddMissingToShoppingList = (recipe: Recipe) => {
    const unowned = recipe.ingredients.filter(i => !i.isOwned);
    if (unowned.length === 0) return;

    setShoppingItems(prev => {
      const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
      const toAdd: ShoppingItem[] = [];

      unowned.forEach(u => {
        if (!existingNames.has(u.name.toLowerCase())) {
          toAdd.push({
            id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: u.name,
            amount: u.amount,
            recipeTitle: recipe.title,
            isBought: false,
            createdAt: Date.now(),
          });
          existingNames.add(u.name.toLowerCase());
        }
      });

      return [...toAdd, ...prev];
    });

    showToast(`🛒 ${unowned.length} bahan kurang dicatat ke Daftar Belanja`);
    setIsShoppingModalOpen(true);
  };

  // Opsi 3 Handler: Favorites
  const handleToggleFavorite = (recipe: Recipe) => {
    setFavoriteRecipes(prev => {
      const exists = prev.some(r => r.id === recipe.id || r.title === recipe.title);
      if (exists) {
        showToast(`Resep "${recipe.title}" dihapus dari Favorit`);
        return prev.filter(r => r.id !== recipe.id && r.title !== recipe.title);
      } else {
        showToast(`⭐ Resep "${recipe.title}" disimpan ke Favorit!`);
        return [recipe, ...prev];
      }
    });
  };

  // Opsi 4 Handler: Share
  const handleOpenShare = (recipe: Recipe) => {
    setSharingRecipe(recipe);
    setIsShareModalOpen(true);
  };

  // Check Gemini connection & sync central multi-device database on mount
  useEffect(() => {
    db.syncWithServer();
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => {
        setGeminiConnected(data.connected);
      })
      .catch(() => {
        setGeminiConnected(false);
      });
  }, []);

  // Multi-modal Vision API: Analyze uploaded photos with Gemini
  const analyzePhotosWithGemini = async (currentPhotos: UploadedPhoto[]) => {
    if (currentPhotos.length === 0) {
      setVisionSummary('');
      setDetectedIngredientsList([]);
      setPhotoDetectedItems([]);
      setVisionError(null);
      return;
    }

    setIsAnalyzingPhotos(true);
    setVisionError(null);

    try {
      const response = await fetch('/api/gemini/analyze-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: currentPhotos })
      });

      if (!response.ok) {
        throw new Error(`Gagal menganalisis foto (status: ${response.status})`);
      }

      const data = await response.json();
      if (data.summary) {
        setVisionSummary(data.summary);
      }
      if (data.detectedIngredients && Array.isArray(data.detectedIngredients)) {
        setDetectedIngredientsList(data.detectedIngredients);
        setPhotoDetectedItems(
          data.detectedIngredients.map((item: DetectedIngredientItem) => `${item.name} (${item.quantity})`)
        );
      }
    } catch (err: unknown) {
      console.error('Vision analysis error:', err);
      setVisionError(err instanceof Error ? err.message : 'Gagal menganalisis foto');
      // Fallback: extract labels
      const fallbackItems = currentPhotos.map(p => p.label);
      setPhotoDetectedItems(fallbackItems);
      setVisionSummary(`Terdeteksi ${fallbackItems.length} foto bahan makanan.`);
    } finally {
      setIsAnalyzingPhotos(false);
    }
  };

  // Add detected items directly into Kulkas Pintar inventory
  const handleAddDetectedToFridge = () => {
    if (detectedIngredientsList.length === 0) return;

    const newFridgeItems: Ingredient[] = detectedIngredientsList.map((item, idx) => ({
      id: `ing-vision-${Date.now()}-${idx}`,
      name: item.name,
      quantity: item.quantity,
      category: (item.category as any) || 'protein',
      urgency: (item.urgency as any) || 'medium',
      shelf: (item.shelf as any) || 'chiller',
      icon: resolveIngredientIcon(item.name, item.icon),
      daysRemaining: item.urgency === 'urgent' ? 2 : 5
    }));

    setIngredients(prev => [...newFridgeItems, ...prev]);
    setSelectedFridgeIds(prev => {
      const copy = { ...prev };
      newFridgeItems.forEach(i => { copy[i.id] = true; });
      return copy;
    });
  };

  // Ingredient handlers for Kulkas Pintar
  const handleAddIngredient = (newIng: Omit<Ingredient, 'id'>) => {
    const newId = `ing-${Date.now()}`;
    const item: Ingredient = {
      ...newIng,
      id: newId,
      icon: resolveIngredientIcon(newIng.name, newIng.icon)
    };
    setIngredients(prev => [item, ...prev]);
    setSelectedFridgeIds(prev => ({ ...prev, [newId]: true }));
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
    setSelectedFridgeIds(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const toggleFridgeItemSelection = (id: string) => {
    setSelectedFridgeIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Photo handlers
  const handleAddPhoto = (newPhoto: UploadedPhoto) => {
    if (photos.length < 3) {
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      analyzePhotosWithGemini(updatedPhotos);
    }
  };

  const handleRemovePhoto = (id: string) => {
    const updatedPhotos = photos.filter(p => p.id !== id);
    setPhotos(updatedPhotos);
    analyzePhotosWithGemini(updatedPhotos);
  };

  // Selected fridge ingredients list
  const activeFridgeIngredients = ingredients.filter(i => selectedFridgeIds[i.id]);

  // Combined ingredient names count for current search mode
  const getSearchItemsSummary = () => {
    if (searchMode === 'fridge_only') {
      return {
        count: activeFridgeIngredients.length,
        label: `${activeFridgeIngredients.length} Bahan Kulkas`
      };
    }
    if (searchMode === 'photo_only') {
      return {
        count: photoDetectedItems.length,
        label: `${photoDetectedItems.length} Bahan dari Foto`
      };
    }
    // Hybrid mode
    const totalCount = activeFridgeIngredients.length + photoDetectedItems.length;
    return {
      count: totalCount,
      label: `${activeFridgeIngredients.length} Bahan Kulkas + ${photoDetectedItems.length} Bahan Foto`
    };
  };

  const searchSummary = getSearchItemsSummary();

  // Active ingredients for the search depending on the chosen search mode
  const currentSearchIngredients = React.useMemo(() => {
    if (searchMode === 'photo_only') return [];
    return activeFridgeIngredients;
  }, [searchMode, activeFridgeIngredients]);

  const currentSearchPhotoItems = React.useMemo(() => {
    if (searchMode === 'fridge_only') return [];
    return photoDetectedItems;
  }, [searchMode, photoDetectedItems]);

  // Client-side rule-based fallback generator
  const localFallbackRecipes = React.useMemo(() => {
    const dynamicList = generateDynamicRecipes({
      ingredients: currentSearchIngredients,
      photoItems: currentSearchPhotoItems,
      filters
    });

    if (dynamicList.length > 0) {
      return dynamicList;
    }
    return RECIPES_DATABASE;
  }, [currentSearchIngredients, currentSearchPhotoItems, filters]);

  // Main recipe search: calls Gemini Real-Time Synthesis
  const handleSearchRecipes = async (e?: React.FormEvent, customAvoidTitles?: string[]) => {
    if (e) e.preventDefault();
    setIsGeneratingAiRecipes(true);
    setHasSearched(true);

    const fridgeItemNames = searchMode === 'photo_only'
      ? []
      : activeFridgeIngredients.map(i => `${i.name} (${i.quantity})`);

    const photoItemNames = searchMode === 'fridge_only'
      ? []
      : photoDetectedItems;

    const allChosen = [...fridgeItemNames, ...photoItemNames];

    if (allChosen.length === 0) {
      setIsGeneratingAiRecipes(false);
      return;
    }

    try {
      const res = await fetch('/api/gemini/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: fridgeItemNames,
          photoItems: photoItemNames,
          searchMode: searchMode === 'fridge_only'
            ? 'Hanya Bahan Kulkas'
            : searchMode === 'photo_only'
              ? 'Hanya Foto Dapur'
              : 'Gabungan Foto + Bahan Kulkas',
          filters,
          avoidTitles: customAvoidTitles || (aiRecipes.map(r => r.title))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
          setAiRecipes(data.recipes);
        }
      }
    } catch (err) {
      console.error('Gemini recipe generation failed, keeping local recipes:', err);
    } finally {
      setIsGeneratingAiRecipes(false);
      const recipesEl = document.getElementById('recipes-section');
      if (recipesEl) {
        recipesEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Recipes to display: prefer AI generated recipes if available
  const displayRecipes = aiRecipes.length > 0 ? aiRecipes : localFallbackRecipes;

  // Kategori Dinamis: Ekstrak tag kategori yang benar-benar ada pada kumpulan resep saat ini
  const dynamicRecipeCategories = React.useMemo(() => {
    const list = displayRecipes;
    const categoryMap: Record<string, { label: string; icon: string; count: number; filterFn: (r: Recipe) => boolean }> = {};

    // 1. Pedas (jika ada resep pedas, balado, rica, rica-rica, cabai)
    const spicyFilter = (r: Recipe) => {
      const title = r.title.toLowerCase();
      const tastes = (r.tasteProfile || []).map(t => t.toLowerCase());
      return tastes.some(t => t.includes('pedas') || t.includes('balado') || t.includes('rica')) ||
        title.includes('pedas') || title.includes('balado') || title.includes('rica') || title.includes('mercon');
    };
    const spicyCount = list.filter(spicyFilter).length;
    if (spicyCount > 0) {
      categoryMap['pedas'] = { label: 'Pedas', icon: '🌶️', count: spicyCount, filterFn: spicyFilter };
    }

    // 2. Kuah & Sup (jika ada sup, soto, sayur asem, kuah, bening, lodeh)
    const soupFilter = (r: Recipe) => {
      const title = r.title.toLowerCase();
      return title.includes('sup') || title.includes('sayur') || title.includes('kuah') || 
        title.includes('soto') || title.includes('bening') || title.includes('lodeh') || title.includes('rawon') || title.includes('gulai');
    };
    const soupCount = list.filter(soupFilter).length;
    if (soupCount > 0) {
      categoryMap['kuah'] = { label: 'Kuah & Sup', icon: '🍲', count: soupCount, filterFn: soupFilter };
    }

    // 3. Tumisan / Oseng (jika ada tumis, oseng, cah)
    const stirFryFilter = (r: Recipe) => {
      const title = r.title.toLowerCase();
      return title.includes('tumis') || title.includes('oseng') || title.includes('cah');
    };
    const stirFryCount = list.filter(stirFryFilter).length;
    if (stirFryCount > 0) {
      categoryMap['tumis'] = { label: 'Tumisan', icon: '🍳', count: stirFryCount, filterFn: stirFryFilter };
    }

    // 4. Gorengan / Panggang (jika ada goreng, bakar, panggang, krispi)
    const friedFilter = (r: Recipe) => {
      const title = r.title.toLowerCase();
      return title.includes('goreng') || title.includes('krispi') || title.includes('crispy') || title.includes('bakar') || title.includes('panggang');
    };
    const friedCount = list.filter(friedFilter).length;
    if (friedCount > 0) {
      categoryMap['goreng'] = { label: 'Goreng & Bakar', icon: '🍗', count: friedCount, filterFn: friedFilter };
    }

    // 5. Olahan Ayam / Daging
    const meatFilter = (r: Recipe) => {
      const title = r.title.toLowerCase();
      return title.includes('ayam') || title.includes('sapi') || title.includes('daging') || title.includes('bakso') || title.includes('sosis');
    };
    const meatCount = list.filter(meatFilter).length;
    if (meatCount > 0) {
      categoryMap['daging'] = { label: 'Ayam & Daging', icon: '🥩', count: meatCount, filterFn: meatFilter };
    }

    // 6. Sayuran / Nabati / Tahu Tempe
    const veggieFilter = (r: Recipe) => {
      const title = r.title.toLowerCase();
      return title.includes('tahu') || title.includes('tempe') || title.includes('sayur') || title.includes('bayam') || 
        title.includes('kangkung') || title.includes('brokoli') || title.includes('buncis') || title.includes('jamur') || title.includes('terong');
    };
    const veggieCount = list.filter(veggieFilter).length;
    if (veggieCount > 0) {
      categoryMap['sayur'] = { label: 'Sayur & Nabati', icon: '🥬', count: veggieCount, filterFn: veggieFilter };
    }

    // 7. Mie & Pasta (hanya jika memang ada mie / pasta!)
    const pastaFilter = (r: Recipe) => {
      const title = r.title.toLowerCase();
      return title.includes('pasta') || title.includes('spaghetti') || title.includes('mie') || title.includes('bihun') || title.includes('kwetiau');
    };
    const pastaCount = list.filter(pastaFilter).length;
    if (pastaCount > 0) {
      categoryMap['mie_pasta'] = { label: 'Mie & Pasta', icon: '🍝', count: pastaCount, filterFn: pastaFilter };
    }

    // 8. Cepat & Praktis (<= 20 menit)
    const quickFilter = (r: Recipe) => {
      return (r.cookTimeMinutes && r.cookTimeMinutes <= 20) || (r.totalTimeMinutes && r.totalTimeMinutes <= 25) || r.difficulty === 'Mudah' || r.difficulty === 'Praktis';
    };
    const quickCount = list.filter(quickFilter).length;
    if (quickCount > 0) {
      categoryMap['cepat'] = { label: 'Praktis (≤20m)', icon: '⚡', count: quickCount, filterFn: quickFilter };
    }

    return Object.entries(categoryMap).map(([id, item]) => ({
      id,
      label: item.label,
      icon: item.icon,
      count: item.count,
      filterFn: item.filterFn,
    }));
  }, [displayRecipes]);

  // Filter resep berdasarkan kategori aktif yang dipilih
  const filteredRecipes = React.useMemo(() => {
    if (selectedTagFilter === 'favorites') {
      return favoriteRecipes;
    }
    if (selectedTagFilter === 'all') {
      return displayRecipes;
    }
    const activeCategory = dynamicRecipeCategories.find(c => c.id === selectedTagFilter);
    if (activeCategory) {
      return displayRecipes.filter(activeCategory.filterFn);
    }
    return displayRecipes;
  }, [selectedTagFilter, favoriteRecipes, displayRecipes, dynamicRecipeCategories]);

  // Urgent ingredients expiring soon for Zero-Waste Alert (Opsi 5)
  const urgentIngredients = ingredients.filter(
    i => i.urgency === 'urgent' || (i.daysRemaining && i.daysRemaining <= 2)
  );

  // Jika pengguna belum login, tampilkan portal login & registrasi
  if (!currentUser) {
    return (
      <AuthDashboard
        onLoginSuccess={handleUserChanged}
        initialMode={authModalMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-stone-900 flex flex-col font-sans relative">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar with Brand: Isi Kulkasku & Action Buttons */}
      <Navbar
        onScanClick={() => {
          setSearchMode('hybrid');
          const el = document.getElementById('search-menu-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFridgeClick={() => {
          const el = document.getElementById('fridge-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onPreferencesClick={() => {
          const el = document.getElementById('preferences-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onShoppingListClick={() => setIsShoppingModalOpen(true)}
        shoppingItemCount={shoppingItems.filter(i => !i.isBought).length}
        onFavoritesClick={() => {
          setSelectedTagFilter('favorites');
          const el = document.getElementById('recipes-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        favoritesCount={favoriteRecipes.length}
        geminiConnected={geminiConnected}
        currentUser={currentUser}
        onAccountClick={() => {
          if (currentUser) {
            setIsAccountMenuOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        onLogout={() => setIsLogoutConfirmOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-10 md:space-y-14">
        {/* SECTION 1: Kitchen Background Hero */}
        <section aria-label="Hero Kitchen & Kulkas Pintar">
          <KitchenBackgroundBanner
            detectedCount={ingredients.length}
            onExploreFridgeClick={() => {
              const el = document.getElementById('fridge-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onPreferencesClick={() => {
              const el = document.getElementById('preferences-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* SECTION 2: KULKAS PINTAR (Inventaris Rak Kulkas) */}
        <section id="fridge-section" className="space-y-4">
          <SmartFridgeModel
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onSearchRecipes={() => {
              setSearchMode('fridge_only');
              const el = document.getElementById('search-menu-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            currentUser={currentUser}
            onLoadSampleIngredients={handleLoadSampleIngredients}
          />
        </section>

        {/* OPSI 5: Smart Expiry Warning Alert (Zero Food Waste) */}
        {urgentIngredients.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-amber-950">
                    Pengingat Bahan Segera Habis ({urgentIngredients.length} Bahan Kritis)
                  </h4>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Prioritas Hari Ini
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Ada {urgentIngredients.length} bahan di kulkas yang perlu segera diolah sebelum kedaluwarsa:{' '}
                  <strong>{urgentIngredients.map(i => i.name).join(', ')}</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const newSelected: Record<string, boolean> = {};
                urgentIngredients.forEach(u => { newSelected[u.id] = true; });
                setSelectedFridgeIds(newSelected);
                setSearchMode('fridge_only');
                showToast('⚡ Bahan kritis kulkas terpilih untuk dimasak');
                const el = document.getElementById('search-menu-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shrink-0 transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Prioritaskan Olah Bahan Ini</span>
            </button>
          </div>
        )}

        {/* SECTION 3: MENU PENCARIAN RESEP (3 OPSI PENCARIAN) */}
        <section
          id="search-menu-section"
          className="bg-white rounded-3xl p-6 md:p-9 shadow-sm border border-stone-200/80 space-y-8"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Menu Pencarian Resep Pintar</span>
                <span className="text-stone-300">·</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px] border border-emerald-200/80">
                  Sistem Terintegrasi Otomatis
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
                Pilih Cara Mencari Resep Masakan
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                Pilih salah satu dari 3 opsi: mencari langsung dari bahan di <strong>Kulkas Pintar</strong>, mendeteksi otomatis dari <strong>Foto Bahan Dapur</strong>, atau <strong>Menggabungkan</strong> keduanya!
              </p>
            </div>

            {/* Connection Status Pill */}
            <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  Pemindai Dapur & Resep Cerdas
                </span>
                <span className="text-[11px] text-stone-500 block">
                  {geminiConnected !== false ? '🟢 Sistem Siap Memasak' : '🟡 Menjalankan Deteksi Cerdas'}
                </span>
              </div>
            </div>
          </div>

          {/* 3 OPSI METODE PENCARIAN (Interactive Mode Selector) */}
          <SearchModeSelector
            currentMode={searchMode}
            onSelectMode={(mode) => setSearchMode(mode)}
            fridgeItemCount={activeFridgeIngredients.length}
            photoCount={photos.length}
          />

          {/* KONTEN DINAMIS SESUAI OPSI YANG DIPILIH */}
          <div className="p-5 md:p-6 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-5">
            {/* OPSI 1: HANYA BAHAN DARI KULKAS PINTAR */}
            {searchMode === 'fridge_only' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Refrigerator className="w-4 h-4 text-emerald-700" />
                      <span>Bahan Kulkas yang Akan Dipakai untuk Mencari Resep</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Centang bahan yang ingin kamu olah hari ini:
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = ingredients.every(i => selectedFridgeIds[i.id]);
                      const newMap: Record<string, boolean> = {};
                      ingredients.forEach(i => {
                        newMap[i.id] = !allSelected;
                      });
                      setSelectedFridgeIds(newMap);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    {ingredients.every(i => selectedFridgeIds[i.id]) ? 'Batal Pilih Semua' : 'Pilih Semua Bahan'}
                  </button>
                </div>

                {/* Checklist chips of fridge ingredients */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {ingredients.map((item) => {
                    const isChecked = !!selectedFridgeIds[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleFridgeItemSelection(item.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-base" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                        <span>{item.name}</span>
                        <span className="text-[10px] opacity-80 font-mono">({item.quantity})</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ml-1 ${
                            isChecked ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && '✓'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-stone-500 italic">
                  💡 Kamu juga bisa menambah bahan baru ke kulkas lewat menu <strong>Kulkas Pintar</strong> di atas.
                </p>
              </div>
            )}

            {/* OPSI 2: HANYA DARI FOTO YANG DI-UPLOAD */}
            {searchMode === 'photo_only' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-700" />
                    <span>Upload Foto Dapur / Kulkas untuk Deteksi Resep</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Deteksi Foto Cerdas
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Unggah maksimal 3 foto kulkas atau dapur yang berantakan. Sistem akan memindai dan mengenali bahan makanan nyata yang terlihat secara otomatis.
                  </p>
                </div>

                <PhotoUploader
                  photos={photos}
                  onAddPhoto={handleAddPhoto}
                  onRemovePhoto={handleRemovePhoto}
                  isAnalyzing={isAnalyzingPhotos}
                />

                {/* Photo Vision Status & Summary Box */}
                {isAnalyzingPhotos && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-900 animate-pulse">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <div className="text-xs">
                      <strong className="block">Sistem sedang menganalisis foto dapur...</strong>
                      <span>Mendeteksi sayur, daging, bumbu, saus, dan memperkirakan takaran bahan secara akurat.</span>
                    </div>
                  </div>
                )}

                {/* Detected Items from Photo */}
                {!isAnalyzingPhotos && visionSummary && (
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>Hasil Deteksi Bahan dari Foto:</span>
                      </div>
                      {detectedIngredientsList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleAddDetectedToFridge}
                          className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Simpan Semua ke Kulkas Pintar</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-medium bg-purple-50/70 p-3 rounded-xl border border-purple-100">
                      ✨ {visionSummary}
                    </p>

                    {detectedIngredientsList.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-stone-500 block">
                          Daftar Bahan Siap Pakai ({detectedIngredientsList.length} Bahan):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {detectedIngredientsList.map((item, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${
                                item.urgency === 'urgent'
                                  ? 'bg-rose-50 text-rose-900 border-rose-200'
                                  : 'bg-stone-50 text-stone-800 border-stone-200'
                              }`}
                            >
                              <span className="text-base" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                              <span className="font-semibold">{item.name}</span>
                              <span className="text-[10px] opacity-75 font-mono">({item.quantity})</span>
                              {item.urgency === 'urgent' && (
                                <span className="text-[9px] bg-rose-200/80 text-rose-950 px-1.5 py-0.2 rounded font-bold">
                                  Segera Olah
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {visionError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{visionError} (Bahan dari nama file tetap digunakan)</span>
                  </div>
                )}
              </div>
            )}

            {/* OPSI 3: GABUNGAN FOTO YANG DI-UPLOAD + BAHAN DI KULKAS */}
            {searchMode === 'hybrid' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>Gabungkan Foto yang Di-upload + Bahan Pilihan di Kulkas</span>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Kombinasi Maksimal
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Kombinasi paling fleksibel: unggah foto bahan baru, biarkan sistem mendeteksinya secara otomatis, lalu kombinasikan dengan stok di Kulkas Pintarmu.
                  </p>
                </div>

                {/* Bagian 1: Foto */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      <span>1. Foto Bahan Masakan yang Di-upload:</span>
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">{photos.length}/3 Foto</span>
                  </div>

                  <PhotoUploader
                    photos={photos}
                    onAddPhoto={handleAddPhoto}
                    onRemovePhoto={handleRemovePhoto}
                    isAnalyzing={isAnalyzingPhotos}
                  />

                  {/* Summary from Photo */}
                  {visionSummary && (
                    <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-950 font-medium">
                      ✨ {visionSummary}
                    </div>
                  )}
                </div>

                {/* Bagian 2: Checklist Bahan Kulkas Tambahan */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <Refrigerator className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2. Tambahkan Bahan dari Kulkas Pintar:</span>
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">
                      {activeFridgeIngredients.length} bahan terpilih
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((item) => {
                      const isChecked = !!selectedFridgeIds[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleFridgeItemSelection(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-purple-900 text-white border-purple-950 shadow-sm'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className="text-base" role="img" aria-label={item.name}>{resolveIngredientIcon(item.name, item.icon)}</span>
                          <span>{item.name}</span>
                          <span className="text-[10px] opacity-75 font-mono">({item.quantity})</span>
                          <span className="text-xs">{isChecked ? '✓' : '+'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ringkasan Penggabungan */}
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200/80 flex items-center justify-between text-xs text-purple-950">
                  <span className="font-semibold">
                    ⚡ Total Bahan Gabungan: <strong>{searchSummary.label}</strong>
                  </span>
                  <span className="font-mono bg-purple-200/80 px-2 py-0.5 rounded font-bold">
                    Siap Dikombinasikan
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* FORM FILTER PREFERENSI (Budget, Waktu, Porsi, Selera) */}
          <form id="preferences-section" onSubmit={handleSearchRecipes} className="scroll-mt-24 space-y-6 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="text-base">⚙️</span>
                  <span>Pengaturan Budget, Waktu Masak & Selera</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Sesuaikan preferensi agar rekomendasi menu sesuai anggaran dan ketersediaan waktumu
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Budget
                </label>
                <select
                  value={filters.budget}
                  onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 bg-stone-50/50 hover:bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-stone-800 transition-colors"
                >
                  <option value="Bebas">Bebas</option>
                  <option value="Hemat (< Rp 30.000)">Hemat (&lt; Rp 30.000)</option>
                  <option value="Sedang (Rp 30.000 - 60.000)">Sedang (Rp 30.000 - 60.000)</option>
                  <option value="Sultan (> Rp 60.000)">Sultan (&gt; Rp 60.000)</option>
                </select>
              </div>

              {/* Waktu masak */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Waktu masak
                </label>
                <select
                  value={filters.cookingTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, cookingTime: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 bg-stone-50/50 hover:bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-stone-800 transition-colors"
                >
                  <option value="Maks. 15 menit">Maks. 15 menit (Kilat)</option>
                  <option value="Maks. 30 menit">Maks. 30 menit</option>
                  <option value="Maks. 45 menit">Maks. 45 menit</option>
                  <option value="Bebas">Bebas</option>
                </select>
              </div>

              {/* Jumlah porsi */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Jumlah porsi
                </label>
                <select
                  value={filters.servings}
                  onChange={(e) => setFilters(prev => ({ ...prev, servings: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 bg-stone-50/50 hover:bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-stone-800 transition-colors"
                >
                  <option value="1">1 Porsi (Sendiri)</option>
                  <option value="2">2 Porsi</option>
                  <option value="3-4">3-4 Porsi</option>
                  <option value="Keluarga (5+)">Keluarga (5+)</option>
                </select>
              </div>

              {/* Selera atau pantangan */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Selera atau pantangan
                </label>
                <input
                  type="text"
                  placeholder="misal: suka pedas, tanpa santan"
                  value={filters.preferences}
                  onChange={(e) => setFilters(prev => ({ ...prev, preferences: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 bg-stone-50/50 hover:bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-stone-800 transition-colors placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Quick Preference Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Pilihan cepat:</span>
              {['suka pedas', 'tanpa santan', 'tinggi protein', 'rendah lemak', 'kids friendly'].map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, preferences: pref }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    filters.preferences.toLowerCase() === pref
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>

            {/* TOMBOL AKSI UTAMA PENCARIAN RESEP */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isGeneratingAiRecipes}
                className="w-full py-4 rounded-2xl bg-stone-900 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold font-display text-base tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-75 cursor-pointer"
              >
                {isGeneratingAiRecipes ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Chef Sedang Menulis Resep Baru Real-Time...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>
                      {searchMode === 'fridge_only' && `Hasilkan Resep Real-Time dari Bahan Kulkas (${searchSummary.label})`}
                      {searchMode === 'photo_only' && `Hasilkan Resep Real-Time dari Foto Dapur (${searchSummary.label})`}
                      {searchMode === 'hybrid' && `⚡ Hasilkan Resep Gabungan Real-Time (${searchSummary.label})`}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  Resep ditulis langsung oleh <strong>Executive Chef</strong> secara real-time dengan variasi unik, lengkap dengan cerita kuliner dan tips koki.
                </span>
              </div>
            </div>
          </form>
        </section>

        {/* SECTION 4: HASIL REKOMENDASI RESEP (Tanpa Gambar Resep, Bersih & Informatif) */}
        <section id="recipes-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-800">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Rekomendasi Menu Siap Saji</span>
                {aiRecipes.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    ✨ Variasi Resep Spesial
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
                Resep Masakan yang Paling Cocok
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Disusun dari pencarian <strong>{searchSummary.label}</strong>, budget <strong>{filters.budget}</strong>, dan waktu <strong>{filters.cookingTime}</strong>.
              </p>
            </div>

            {/* Action to regenerate fresh new variation */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSearchRecipes(undefined, aiRecipes.map(r => r.title))}
                disabled={isGeneratingAiRecipes}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                title="Minta chef membuat variasi menu lain yang berbeda dari resep saat ini"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAiRecipes ? 'animate-spin' : ''}`} />
                <span>Variasi Resep Baru</span>
              </button>

              {/* Filter segments (Otomatis Dinamis Mengikuti Resep yang Ada) */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => startTransition(() => setSelectedTagFilter('all'))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedTagFilter === 'all'
                      ? 'bg-white text-stone-950 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Semua ({displayRecipes.length})
                </button>

                {/* Opsi 3: Favorit filter segment */}
                <button
                  type="button"
                  onClick={() => startTransition(() => setSelectedTagFilter('favorites'))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedTagFilter === 'favorites'
                      ? 'bg-amber-100 text-amber-900 shadow-sm font-bold border border-amber-300/80'
                      : 'text-stone-600 hover:text-amber-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${selectedTagFilter === 'favorites' ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>Favorit ({favoriteRecipes.length})</span>
                </button>

                {/* Tag Kategori Dinamis: Hanya muncul jika resep dengan kategori ini benar-benar ada */}
                {dynamicRecipeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => startTransition(() => setSelectedTagFilter(cat.id))}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      selectedTagFilter === cat.id
                        ? 'bg-white text-stone-950 shadow-sm font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label} ({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recipe Cards Grid (No Images, Clean & Typographic - 6 Resep) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onCookClick={(rec) => setActiveRecipeForCooking(rec)}
                isFavorite={favoriteRecipes.some(f => f.id === recipe.id || f.title === recipe.title)}
                onToggleFavorite={handleToggleFavorite}
                onShareClick={handleOpenShare}
                onAddMissingToShoppingList={handleAddMissingToShoppingList}
              />
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              {selectedTagFilter === 'favorites' ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">Belum Ada Resep Favorit</h4>
                  <p className="text-stone-500 text-xs max-w-md mx-auto">
                    Simpan resep yang kamu sukai dengan menekan ikon bookmark pada kartu resep agar mudah ditemukan kembali di sini.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedTagFilter('all')}
                    className="mt-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Jelajahi Semua Resep
                  </button>
                </>
              ) : (
                <>
                  <p className="text-stone-600 font-medium">Tidak ada resep yang cocok dengan kriteria filter saat ini.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({
                        budget: 'Bebas',
                        cookingTime: 'Bebas',
                        servings: '2',
                        preferences: 'suka pedas'
                      });
                      setSelectedTagFilter('all');
                    }}
                    className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Reset Semua Filter
                  </button>
                </>
              )}
            </div>
          )}
        </section>

        {/* SECTION 5: Zero-Waste Cooking Tips */}
        <section
          id="zerowaste-section"
          className="bg-emerald-950 text-emerald-50 rounded-3xl p-6 md:p-10 shadow-xl border border-emerald-900 relative overflow-hidden"
        >
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-emerald-400">
              <HeartHandshake className="w-4 h-4" />
              <span>Gerakan Dapur Zero Food Waste</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              Mengapa Masak dari Isi Kulkas Sangat Menguntungkan?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              Dengan mengelola <strong>Kulkas Pintar</strong> dan mendahulukan bahan yang bertanda <em>Segera Olah</em>, kamu dapat menghemat uang belanja bulanan hingga <strong>Rp 450.000</strong> sekaligus mengurangi sampah sisa makanan rumah tangga.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800">
                <span className="text-xs font-bold text-amber-300 block">🥩 Rak Daging</span>
                <span className="text-[11px] text-emerald-200 mt-1 block">
                  Daging segar di chiller sebaiknya dimasak dalam 1-2 hari. Jika belum sempat, pindahkan ke Freezer -18°C.
                </span>
              </div>
              <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800">
                <span className="text-xs font-bold text-amber-300 block">🥦 Laci Sayur</span>
                <span className="text-[11px] text-emerald-200 mt-1 block">
                  Sayuran seperti buncis & wortel simpan dalam keadaan kering agar tetap renyah hingga 5 hari.
                </span>
              </div>
              <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800">
                <span className="text-xs font-bold text-amber-300 block">🥫 Saus & Pasta</span>
                <span className="text-[11px] text-emerald-200 mt-1 block">
                  Saus Prego yang sudah dibuka sebaiknya disimpan di kulkas rak atas dan dihabiskan dalam 5-7 hari.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Cooking Mode Modal */}
      {activeRecipeForCooking && (
        <CookingModeModal
          recipe={activeRecipeForCooking}
          onClose={() => setActiveRecipeForCooking(null)}
          isFavorite={favoriteRecipes.some(f => f.id === activeRecipeForCooking.id || f.title === activeRecipeForCooking.title)}
          onToggleFavorite={handleToggleFavorite}
          onShareClick={handleOpenShare}
        />
      )}

      {/* Opsi 1: Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingModalOpen}
        onClose={() => setIsShoppingModalOpen(false)}
        items={shoppingItems}
        onToggleItem={handleToggleShoppingItem}
        onDeleteItem={handleDeleteShoppingItem}
        onAddItem={handleAddShoppingItem}
        onClearBought={handleClearBoughtShoppingItems}
        onClearAll={handleClearAllShoppingItems}
      />

      {/* Opsi 4: Share Recipe Modal */}
      <ShareRecipeModal
        recipe={sharingRecipe}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Multi-Account Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={handleUserChanged}
        initialMode={authModalMode}
      />

      {/* Account Management & Database Backup Modal */}
      <AccountMenuModal
        isOpen={isAccountMenuOpen}
        onClose={() => setIsAccountMenuOpen(false)}
        currentUser={currentUser}
        onOpenSwitchAccount={() => {
          setIsAccountMenuOpen(false);
          handleLogout('switch');
        }}
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
        onClearFridge={handleClearFridge}
        onDeleteAccount={() => {
          if (currentUser) {
            const userName = currentUser.name;
            const userId = currentUser.id;
            db.deleteUser(userId);
            showToast(`Akun "${userName}" berhasil dihapus.`);
            handleLogout('switch');
          }
        }}
        onDataImported={() => {
          if (currentUser) {
            const data = db.getUserData(currentUser.id);
            setIngredients(data.ingredients || []);
            setSelectedFridgeIds(data.selectedFridgeIds || {});
            setShoppingItems(data.shoppingItems || []);
            setFavoriteRecipes(data.favoriteRecipes || []);
            showToast('Data kulkas berhasil dipulihkan dari cadangan!');
          }
        }}
        onLogout={() => {
          setIsAccountMenuOpen(false);
          setIsLogoutConfirmOpen(true);
        }}
        ingredientCount={ingredients.length}
        favoriteCount={favoriteRecipes.length}
        shoppingCount={shoppingItems.length}
      />

      {/* Ubah Kata Sandi Modal (Sinkron Multi-Device) */}
      {currentUser && (
        <ChangePasswordModal
          currentUser={currentUser}
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Konfirmasi Keluar Akun Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          handleLogout('login');
        }}
        userName={currentUser?.name}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold font-display text-stone-900 text-sm">Isi Kulkasku</span>
            <span>·</span>
            <span>Aplikasi Cerdas Masak dari Isi Kulkas</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Pemindai Foto Cerdas</span>
            <span>·</span>
            <span>Variasi Resep Real-Time</span>
            <span>·</span>
            <span>Zero Food Waste</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
