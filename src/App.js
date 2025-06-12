import React, { useState, useMemo } from 'react';

// --- Data for Ingredient Analysis ---
const INGREDIENT_DATA = {
  seedOils: {
    name: 'Seed Oils',
    color: 'bg-yellow-400/20 text-yellow-800 border-yellow-400/30',
    keywords: ['canola oil', 'corn oil', 'soybean oil', 'sunflower oil', 'safflower oil', 'grapeseed oil', 'rice bran oil', 'cottonseed oil'],
  },
  artificialColors: {
    name: 'Artificial Colors',
    color: 'bg-red-400/20 text-red-800 border-red-400/30',
    keywords: ['red no. 40', 'red 40', 'yellow no. 5', 'yellow 5', 'yellow no. 6', 'yellow 6', 'blue no. 1', 'blue 1', 'blue no. 2', 'blue 2', 'green no. 3', 'green 3', 'titanium dioxide'],
  },
  preservatives: {
    name: 'Artificial Preservatives',
    color: 'bg-purple-400/20 text-purple-800 border-purple-400/30',
    keywords: ['bha', 'bht', 'tbhq', 'sodium benzoate', 'potassium sorbate', 'sodium nitrite', 'sodium nitrate'],
  },
  sweeteners: {
    name: 'Artificial Sweeteners & Syrups',
    color: 'bg-blue-400/20 text-blue-800 border-blue-400/30',
    keywords: ['high fructose corn syrup', 'corn syrup', 'aspartame', 'sucralose', 'saccharin', 'acesulfame potassium', 'acesulfame k'],
  },
  allergens: {
    name: 'Common Allergens',
    color: 'bg-orange-400/20 text-orange-800 border-orange-400/30',
    keywords: ['wheat', 'soy', 'peanuts', 'tree nuts', 'milk', 'eggs', 'fish', 'shellfish', 'gluten'],
  },
  processed: {
    name: 'Highly Processed Ingredients',
    color: 'bg-gray-400/20 text-gray-800 border-gray-400/30',
    keywords: ['monosodium glutamate', 'msg', 'hydrolyzed soy protein', 'autolyzed yeast extract', 'carrageenan', 'partially hydrogenated oil', 'hydrogenated oil'],
  }
};

const INITIAL_FILTERS = {
  seedOils: true,
  artificialColors: true,
  preservatives: true,
  sweeteners: true,
  allergens: false,
  processed: true,
};

// --- Helper Functions ---
const parseIngredients = (text) => {
    return text
        .toLowerCase()
        .replace(/\([^)]+\)/g, '') 
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);
};


// --- React Components ---

const Header = () => (
    <header className="text-center p-4 md:p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Ingredient Inspector
        </h1>
        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Paste a food's ingredient list below to check for items you want to avoid. Your data never leaves your device.
        </p>
    </header>
);

const FilterCheckbox = ({ id, label, checked, onChange, colorClass }) => (
    <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-colors hover:bg-gray-100">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <span className={`px-2 py-1 text-sm font-medium rounded-full ${colorClass}`}>
            {label}
        </span>
    </label>
);

const AnalysisResults = ({ flagged, isLoading }) => {
    if (isLoading) {
        return (
             <div className="w-full bg-white rounded-xl shadow-md p-6 mt-6 min-h-[200px] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    if (flagged.length === 0) {
        return (
            <div className="w-full bg-white rounded-xl shadow-md p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Complete</h3>
                <div className="text-center py-8 px-4 bg-green-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-green-800">
                        Looks good! No flagged ingredients found based on your selections.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Flagged Ingredients</h3>
            <div className="space-y-3">
                {flagged.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold capitalize text-gray-700">{item.ingredient}</span>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${INGREDIENT_DATA[item.category].color}`}>
                            {INGREDIENT_DATA[item.category].name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function App() {
    const [ingredientsText, setIngredientsText] = useState('');
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [analysisPerformed, setAnalysisPerformed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const flaggedIngredients = useMemo(() => {
        if (!analysisPerformed) return [];

        const parsed = parseIngredients(ingredientsText);
        const flagged = [];
        
        for (const ingredient of parsed) {
            for (const category in filters) {
                if (filters[category]) {
                    if (INGREDIENT_DATA[category].keywords.some(keyword => ingredient.includes(keyword))) {
                        flagged.push({ ingredient, category });
                        break;
                    }
                }
            }
        }
        return flagged;
    }, [ingredientsText, filters, analysisPerformed]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.id]: e.target.checked });
    };
    
    const handleAnalyze = () => {
        setIsLoading(true);
        setAnalysisPerformed(false);
        setTimeout(() => {
            setAnalysisPerformed(true);
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-700">
            <div className="container mx-auto px-4 py-8">
                <Header />

                <main className="max-w-4xl mx-auto mt-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <label htmlFor="ingredients-input" className="block text-lg font-semibold text-gray-800 mb-2">
                            Ingredient List
                        </label>
                        <textarea
                            id="ingredients-input"
                            rows="6"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            placeholder="e.g., Enriched flour, corn syrup, high fructose corn syrup, soy lecithin, red 40..."
                            value={ingredientsText}
                            onChange={(e) => {
                                setIngredientsText(e.target.value);
                                setAnalysisPerformed(false);
                            }}
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                         <h3 className="text-xl font-semibold text-gray-800 mb-2">Flag Ingredients By Category</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                            {Object.entries(INGREDIENT_DATA).map(([key, value]) => (
                                <FilterCheckbox
                                    key={key}
                                    id={key}
                                    label={value.name}
                                    checked={filters[key]}
                                    onChange={handleFilterChange}
                                    colorClass={value.color}
                                />
                            ))}
                         </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <button
                          onClick={handleAnalyze}
                          disabled={!ingredientsText || isLoading}
                          className="px-12 py-4 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                        >
                          {isLoading ? 'Analyzing...' : 'Inspect Ingredients'}
                        </button>
                    </div>

                    {analysisPerformed && <AnalysisResults flagged={flaggedIngredients} isLoading={isLoading} />}
                </main>
                
                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Ingredient Inspector. For informational purposes only.</p>
                </footer>
            </div>
        </div>
    );
}

