import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useState, useEffect } from 'react';

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-cream rounded-full flex items-center justify-center animate-pulse">
          <ShoppingCart size={28} className="text-muted" />
        </div>
        <p className="font-body text-muted">Učitavanje korpe...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-cream rounded-full flex items-center justify-center">
          <ShoppingCart size={28} className="text-muted" />
        </div>
        <h2 className="font-display text-2xl text-ink mb-2">Korpa je prazna</h2>
        <p className="font-body text-muted mb-6">Dodajte jela iz ponude da biste napravili porudžbinu.</p>
        <a
          href="/ponuda"
          className="inline-flex items-center gap-2 px-6 py-3 bg-paprika text-white font-display uppercase tracking-widest rounded-xl hover:bg-paprika-dark transition-colors"
        >
          Pogledaj ponudu
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-surface rounded-xl p-4 border border-black/5 shadow-sm"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-display text-base text-ink truncate">{item.name}</h3>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-muted hover:text-paprika transition-colors flex-shrink-0 rounded-lg hover:bg-paprika/5"
                  aria-label="Ukloni"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="font-body text-xs text-muted mb-3">{item.price.toLocaleString('sr-RS')} RSD / {item.unit}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center hover:bg-paprika hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-display text-sm text-ink w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center hover:bg-paprika hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-display text-base text-paprika">
                  {(item.price * item.quantity).toLocaleString('sr-RS')} RSD
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-black/5 pt-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-sm text-ink-light">Ukupno</span>
          <span className="font-display text-2xl text-paprika">{totalPrice.toLocaleString('sr-RS')} RSD</span>
        </div>
      </div>

      <a
        href="/porudzbina"
        className="block w-full py-4 px-6 bg-paprika text-white font-display text-lg uppercase tracking-widest text-center rounded-xl hover:bg-paprika-dark transition-colors shadow-lg shadow-paprika/15"
      >
        Nastavi na porudžbinu
      </a>
    </div>
  );
}
