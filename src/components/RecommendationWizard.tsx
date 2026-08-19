import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sliders,
  DollarSign,
  Zap,
  Star
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface RecommendationWizardProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const RecommendationWizard: React.FC<RecommendationWizardProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [primaryNeed, setPrimaryNeed] = useState<string>('any');
  const [budgetTier, setBudgetTier] = useState<string>('any');
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);

  const categories = StorageService.getCategories();
  const allProducts = StorageService.getProducts();

  const handleComputeRecommendations = () => {
    let results = allProducts.filter((p) => p.published);

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      results = results.filter((p) => p.categoryId === selectedCategory);
    }

    // 2. Budget Filter
    if (budgetTier === 'under150') {
      results = results.filter((p) => (p.price || 0) <= 150);
    } else if (budgetTier === '150to450') {
      results = results.filter((p) => (p.price || 0) > 150 && (p.price || 0) <= 450);
    } else if (budgetTier === 'premium') {
      results = results.filter((p) => (p.price || 0) > 450);
    }

    // Sort by editor score descending
    results.sort((a, b) => b.editorScore - a.editorScore);

    // If no strict matches found, fallback to top scored products in category or globally
    if (results.length === 0) {
      results = allProducts
        .filter((p) => (selectedCategory !== 'all' ? p.categoryId === selectedCategory : true))
        .slice(0, 3);
    }

    setMatchedProducts(results);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCategory('all');
    setPrimaryNeed('any');
    setBudgetTier('any');
    setMatchedProducts([]);
  };

  return (
    <div
      id="product-recommendation-engine"
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto"
    >
      {/* Wizard Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Product Matcher</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Find Your Perfect Match in 3 Steps
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-2">
          Answer 3 quick questions. We evaluate real laboratory test data to match you with products that fit your exact workflow and budget.
        </p>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i
                  ? 'w-8 bg-emerald-600'
                  : step > i
                  ? 'w-4 bg-emerald-300'
                  : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Category */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900">Step 1: What type of gear are you shopping for?</h3>
            <p className="text-xs text-slate-500 mt-1">Select the main category you want to evaluate.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedCategory === 'all'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-slate-900 text-sm">All Categories</div>
              <div className="text-xs text-slate-500 mt-1">Show top tested recommendations across all categories</div>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedCategory === cat.id
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-slate-900 text-sm">{cat.name}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.description}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-sm"
            >
              <span>Next: Primary Priority</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Priority */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900">Step 2: What matters most to you?</h3>
            <p className="text-xs text-slate-500 mt-1">Pick your top decisive purchase criterion.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'any', label: 'Balanced Overall Excellence', desc: 'Highest editorial testing score & proven longevity' },
              { id: 'comfort', label: 'Maximum Comfort & Ergonomics', desc: 'Zero fatigue, gentle clamping, and postural relief' },
              { id: 'performance', label: 'Uncompromised Pro Performance', desc: 'Top tier noise cancellation, high-DPI, or studio audio' },
              { id: 'battery', label: 'Endurance & Battery Life', desc: 'Days of usage between charges and rapid top-ups' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPrimaryNeed(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  primaryNeed === item.id
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-sm"
            >
              <span>Next: Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Budget Tier */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900">Step 3: What is your target price range?</h3>
            <p className="text-xs text-slate-500 mt-1">We will only suggest products within your preferred investment bracket.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'under150', label: '$ Value Pick', range: 'Under $150', desc: 'Best performance per dollar' },
              { id: '150to450', label: '$$ Mid-Range Sweet Spot', range: '$150 – $450', desc: 'Flagship features without luxury markup' },
              { id: 'premium', label: '$$$ Ultimate Premium', range: '$450+', desc: 'No-compromise industry benchmark gear' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setBudgetTier(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  budgetTier === item.id
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">{item.range}</div>
                <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleComputeRecommendations}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Show Matches</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Results */}
      {step === 4 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif-editorial">
                Matched Products Based on Your Criteria
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Showing {matchedProducts.length} curated recommendation{matchedProducts.length === 1 ? '' : 's'} tested by our editorial staff.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                placement="recommendation_wizard"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
