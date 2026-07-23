import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cart';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  unit: string;
}

interface MenuModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ item, isOpen, onClose }: MenuModalProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  if (!isOpen) return null;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      unit: item.unit,
    });
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-ink/80 text-white rounded-full hover:bg-paprika transition-colors z-10"
          aria-label="Zatvori"
        >
          <X size={18} />
        </button>

        <div className="aspect-video w-full overflow-hidden bg-cream">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-6">
          <h3 className="font-display text-2xl text-ink mb-2">{item.name}</h3>
          <p className="font-body text-sm text-ink-light mb-5 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-2xl text-paprika">
              {item.price.toLocaleString('sr-RS')} RSD
            </span>
            <span className="font-body text-xs text-muted uppercase tracking-widest">
              po {item.unit}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="font-body text-sm text-ink">Količina:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-cream text-ink flex items-center justify-center hover:bg-paprika hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="font-display text-xl text-ink w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-cream text-ink flex items-center justify-center hover:bg-paprika hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-3.5 px-6 bg-paprika text-white font-display text-lg uppercase tracking-widest rounded-xl hover:bg-paprika-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-paprika/15"
          >
            <ShoppingCart size={20} />
            Dodaj u korpu — {(item.price * quantity).toLocaleString('sr-RS')} RSD
          </button>
        </div>
      </div>
    </div>
  );
}
