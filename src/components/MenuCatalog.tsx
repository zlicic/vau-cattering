import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import MenuModal from './MenuModal';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  unit: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
}

interface Subcategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface MenuCatalogProps {
  items: MenuItem[];
  categories: Category[];
}

export default function MenuCatalog({ items, categories }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);

  const subcategories = useMemo(() => {
    if (activeCategory === 'all') return [];
    const cat = categories.find((c) => c.id === activeCategory);
    return cat?.subcategories ?? [];
  }, [activeCategory, categories]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        activeCategory === 'all' || item.categoryId === activeCategory;
      const matchSubcategory =
        activeSubcategory === 'all' || item.subcategoryId === activeSubcategory;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSubcategory && matchSearch;
    });
  }, [items, activeCategory, activeSubcategory, searchQuery]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setActiveSubcategory('all');
  };

  const tabs = [{ id: 'all', name: 'Sva jela' }, ...categories.map((c) => ({ id: c.id, name: c.name }))];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Search */}
      <div className="mb-8 relative max-w-md mx-auto">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Pretraži ponudu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-surface border border-black/5 rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-paprika/20 focus:border-paprika/20 transition-all"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-2 border-b border-black/5">
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={`relative px-5 py-3 font-display text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeCategory === tab.id
                  ? 'text-paprika'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab.name}
              {activeCategory === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-paprika rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory pills */}
      {subcategories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => setActiveSubcategory('all')}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-colors ${
              activeSubcategory === 'all'
                ? 'bg-ink text-white'
                : 'bg-surface text-ink-light hover:bg-cream'
            }`}
          >
            Sve
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubcategory(sub.id)}
              className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-colors ${
                activeSubcategory === sub.id
                  ? 'bg-ink text-white'
                  : 'bg-surface text-ink-light hover:bg-cream'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="font-body text-xs text-muted mb-6 uppercase tracking-wider">
        {filteredItems.length} {filteredItems.length === 1 ? 'stavka' : 'stavki'}
      </p>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-muted text-lg">Nema rezultata za vašu pretragu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex gap-5 bg-surface rounded-xl p-4 border border-black/5 hover:shadow-lg hover:border-black/10 transition-all duration-300 cursor-pointer"
              onClick={() => setModalItem(item)}
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-display text-lg text-ink leading-tight group-hover:text-paprika transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-display text-lg text-paprika whitespace-nowrap">
                      {item.price.toLocaleString('sr-RS')} RSD
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted mb-2 uppercase tracking-wide">
                    {item.subcategoryName}
                  </p>
                  <p className="font-body text-sm text-ink-light line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-body text-[10px] text-muted uppercase tracking-widest">
                    po {item.unit}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalItem(item);
                    }}
                    className="w-9 h-9 rounded-full bg-paprika text-white flex items-center justify-center hover:bg-paprika-dark transition-colors shadow-sm"
                    aria-label="Dodaj u korpu"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MenuModal
        item={modalItem ?? { id: '', name: '', description: '', price: 0, image: '', unit: '' }}
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
      />
    </div>
  );
}
