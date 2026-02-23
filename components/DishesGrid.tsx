'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Search, Filter, Clock, Star, ChevronDown, Check, X, Plus, Minus, AlertCircle, RefreshCcw, ArrowUpDown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Dish {
    id: number;
    name: string;
    price: number;
    image_url: string;
    description: string;
    category: string;
    cuisine: string;
    dietary_type: string;
    prep_method: string;
    flavor_profile: string;
    meal_type: string;
    texture: string;
    health_attributes: string;
    rating: number;
    prep_time: number;
}

interface DishesGridProps {
    onAdd: (dish: any) => void;
    onRemove: (id: string) => void;
    getQuantity: (id: string) => number;
    branchId: string;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

export default function DishesGrid({ onAdd, onRemove, getQuantity, branchId }: DishesGridProps) {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const fetchDishes = async () => {
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError('Supabase client not initialized. Check environment variables.');
            setLoading(false);
            return;
        }

        try {
            const { data, error: supabaseError } = await supabase
                .from(`dishes_${branchId}`)
                .select('*');

            if (supabaseError) {
                setError(supabaseError.message);
            } else {
                setDishes(data || []);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDishes();
    }, [branchId]);

    const categories = useMemo(() => {
        return {
            cuisines: Array.from(new Set(dishes.map(d => d.cuisine))).filter(Boolean).sort(),
            dietary: Array.from(new Set(dishes.map(d => d.dietary_type))).filter(Boolean).sort(),
            mealTypes: Array.from(new Set(dishes.map(d => d.meal_type))).filter(Boolean).sort(),
        };
    }, [dishes]);

    const filteredAndSortedDishes = useMemo(() => {
        let result = dishes.filter(dish => {
            const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dish.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCuisine = selectedCuisines.length === 0 || selectedCuisines.includes(dish.cuisine);
            const matchesDietary = selectedDietary.length === 0 || selectedDietary.includes(dish.dietary_type);
            const matchesMealType = selectedMealTypes.length === 0 || selectedMealTypes.includes(dish.meal_type);
            const matchesPrice = dish.price >= priceRange[0] && dish.price <= priceRange[1];
            const matchesRating = dish.rating >= minRating;

            return matchesSearch && matchesCuisine && matchesDietary && matchesMealType && matchesPrice && matchesRating;
        });

        // Sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Keep default Supabase order (usually by ID or created_at)
                break;
        }

        return result;
    }, [dishes, searchTerm, selectedCuisines, selectedDietary, selectedMealTypes, priceRange, minRating, sortBy]);

    const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCuisines([]);
        setSelectedDietary([]);
        setSelectedMealTypes([]);
        setPriceRange([0, 2000]);
        setMinRating(0);
        setSortBy('default');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40 bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
                    <p className="text-zinc-500 font-medium animate-pulse">Curating your experience...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-40 px-4 bg-background">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl border border-red-100 dark:border-red-900/30 text-center">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Connection Error</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                        Database connection failed.
                        <br /><span className="mt-2 block font-bold text-red-500">{error}</span>
                    </p>
                    <button onClick={fetchDishes} className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all">
                        <RefreshCcw className="w-5 h-5" /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-background min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-zinc-900 dark:text-white">
                            SANGEM <span className="text-primary  italic">Kitchen</span>
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Explore 100+ Authentic Flavors (INR)</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary  transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by flavor, cuisine, name..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-orange-600 outline-none transition-all font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Toolbar: Filters and Sorting */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${showFilters ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-sm'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            Advanced Filters
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSort(!showSort)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-primary/50 transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <ArrowUpDown className="w-5 h-5" />
                                <span>Sort by: {
                                    sortBy === 'price-asc' ? 'Lowest Price' :
                                        sortBy === 'price-desc' ? 'Highest Price' :
                                            sortBy === 'rating-desc' ? 'Top Rated' : 'Default'
                                }</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showSort && (
                                    <>
                                        {/* Overlay to close on click outside */}
                                        <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setShowSort(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                                        >
                                            {[
                                                { id: 'default', label: 'Recommended' },
                                                { id: 'price-asc', label: 'Price: Low to High' },
                                                { id: 'price-desc', label: 'Price: High to Low' },
                                                { id: 'rating-desc', label: 'Highest Rated' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => {
                                                        setSortBy(opt.id as SortOption);
                                                        setShowSort(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${sortBy === opt.id ? 'bg-orange-50 dark:bg-orange-900/20 text-primary ' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                                        }`}
                                                >
                                                    {opt.label}
                                                    {sortBy === opt.id && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Active Tag Indicators */}
                        {selectedCuisines.length > 0 && <span className="text-[10px] font-black uppercase text-zinc-400 mr-2">Cuisines: {selectedCuisines.length}</span>}
                        {priceRange[0] > 0 || priceRange[1] < 2000 ? (
                            <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-200 dark:border-orange-800">
                                ₹{priceRange[0]}-₹{priceRange[1]}
                                <X className="w-3 h-3 inline ml-1 cursor-pointer" onClick={() => setPriceRange([0, 2000])} />
                            </span>
                        ) : null}
                        {minRating > 0 && (
                            <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-200 dark:border-yellow-800">
                                {minRating}+ Stars
                                <X className="w-3 h-3 inline ml-1 cursor-pointer" onClick={() => setMinRating(0)} />
                            </span>
                        )}
                        {(selectedCuisines.length > 0 || selectedDietary.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000 || minRating > 0) && (
                            <button onClick={resetFilters} className="text-xs font-black text-primary  hover:underline uppercase tracking-widest ml-4">
                                Reset All
                            </button>
                        )}
                    </div>
                </div>

                {/* Enhanced Filter Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10 mb-12 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -mr-32 -mt-32" />

                            {/* Category Filters */}
                            <div className="z-10 bg-white/50 dark:bg-transparent rounded-3xl p-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3" /> Cuisines
                                </h4>
                                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                    {categories.cuisines.map(cuisine => (
                                        <button
                                            key={cuisine}
                                            onClick={() => toggleFilter(selectedCuisines, setSelectedCuisines, cuisine)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border ${selectedCuisines.includes(cuisine)
                                                ? 'bg-primary text-white border-orange-600 shadow-lg shadow-orange-600/20'
                                                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-orange-600/30'
                                                }`}
                                        >
                                            {cuisine}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="z-10 bg-white/50 dark:bg-transparent rounded-3xl p-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Price Preference</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { label: 'Budget (Under ₹300)', range: [0, 300] as [number, number] },
                                        { label: 'Mid-Range (₹300 - ₹800)', range: [300, 800] as [number, number] },
                                        { label: 'Premium (Over ₹800)', range: [800, 2000] as [number, number] },
                                        { label: 'Any Price', range: [0, 2000] as [number, number] },
                                    ].map((p) => (
                                        <button
                                            key={p.label}
                                            onClick={() => setPriceRange(p.range)}
                                            className={`w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black transition-all border flex items-center justify-between ${priceRange[0] === p.range[0] && priceRange[1] === p.range[1]
                                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xl translate-x-1'
                                                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-transparent hover:border-zinc-200 dark:hover:border-zinc-600'
                                                }`}
                                        >
                                            {p.label}
                                            {priceRange[0] === p.range[0] && priceRange[1] === p.range[1] && <Check className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quality/Rating Filter */}
                            <div className="z-10 bg-white/50 dark:bg-transparent rounded-3xl p-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Rating Threshold</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {[4.8, 4.5, 4.0, 0].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setMinRating(star)}
                                            className={`w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black transition-all border flex items-center justify-between ${minRating === star
                                                ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20 translate-x-1'
                                                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-transparent hover:border-zinc-200 dark:hover:border-zinc-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {star > 0 ? (
                                                    <>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map(idx => (
                                                                <Star key={idx} className={`w-3 h-3 ${idx <= Math.floor(star) ? 'fill-current' : 'opacity-20'}`} />
                                                            ))}
                                                        </div>
                                                        <span>{star}+ Stars</span>
                                                    </>
                                                ) : (
                                                    <span>All Ratings</span>
                                                )}
                                            </div>
                                            {minRating === star && <Check className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dietary Selection */}
                            <div className="z-10 bg-white/50 dark:bg-transparent rounded-3xl p-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Dietary Style</h4>
                                <div className="flex flex-wrap gap-2">
                                    {categories.dietary.map(diet => (
                                        <button
                                            key={diet}
                                            onClick={() => toggleFilter(selectedDietary, setSelectedDietary, diet)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border ${selectedDietary.includes(diet)
                                                ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20'
                                                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-green-600/30'
                                                }`}
                                        >
                                            {diet}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* The Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredAndSortedDishes.map((dish) => {
                            const qty = getQuantity(dish.id.toString());

                            return (
                                <motion.div
                                    layout
                                    key={dish.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group relative bg-background rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-zinc-200 dark:border-zinc-800 flex flex-col"
                                >
                                    <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                                        <Image src={dish.image_url} alt={dish.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                                        {/* Floating Price in INR */}
                                        <div className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 px-3 shadow-2xl flex flex-col items-center">
                                            <span className="text-[10px] font-black uppercase text-zinc-400">INR</span>
                                            <span className="text-xl font-black text-primary ">₹{Math.floor(dish.price)}</span>
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                                    <span className="text-[10px] font-black text-white">{dish.rating}</span>
                                                </div>
                                                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-white" />
                                                    <span className="text-[10px] font-black text-white">{dish.prep_time}m</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex gap-2 mb-3">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary  bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md border border-orange-100 dark:border-orange-800/10">
                                                    {dish.cuisine}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${dish.dietary_type.includes('Vegetarian') || dish.dietary_type === 'Vegan'
                                                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/10'
                                                    : 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/10'
                                                    }`}>
                                                    {dish.dietary_type}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-zinc-900 dark:text-white leading-tight mb-2 group-hover:text-primary  transition-colors line-clamp-1">
                                                {dish.name}
                                            </h3>
                                            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium line-clamp-2 leading-relaxed h-8">
                                                {dish.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Method</span>
                                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{dish.prep_method}</span>
                                            </div>

                                            <AnimatePresence mode="wait">
                                                {qty > 0 ? (
                                                    <motion.div
                                                        key="qty"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-inner border border-zinc-200 dark:border-zinc-700"
                                                    >
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onRemove(dish.id.toString()); }}
                                                            className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-200 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-6 text-center font-black text-sm text-zinc-900 dark:text-white">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onAdd({ id: dish.id.toString(), name: dish.name, price: dish.price, image: dish.image_url, discount: 0 }); }}
                                                            className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-200 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.button
                                                        key="add"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        onClick={(e) => { e.stopPropagation(); onAdd({ id: dish.id.toString(), name: dish.name, price: dish.price, image: dish.image_url, discount: 0 }); }}
                                                        className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group/btn hover:bg-primary transition-all active:scale-95 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                                                    >
                                                        <Plus className="w-6 h-6 text-zinc-900 dark:text-white group-hover/btn:text-white transition-colors" />
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredAndSortedDishes.length === 0 && dishes.length > 0 && (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-zinc-400" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">No matching dishes</h3>
                        <p className="text-zinc-500 font-medium">Try different keywords or reset your filters</p>
                        <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:bg-primary dark:hover:bg-orange-700 transition-all shadow-xl">
                            Reset Filters
                        </button>
                    </div>
                )}

                {dishes.length === 0 && !loading && !error && (
                    <div className="text-center py-40 px-4">
                        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-zinc-800">
                            <AlertCircle className="w-10 h-10 text-primary  mx-auto mb-6 animate-bounce" />
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">No Data in Kitchen</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
                                Table `dishes` found but it's currently empty.
                            </p>
                            <button onClick={fetchDishes} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary  hover:text-orange-700 underline underline-offset-8 decoration-2">
                                <RefreshCcw className="w-4 h-4" /> Refresh Grid
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
