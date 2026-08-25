import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { cloudinaryUrl } from '../lib/cloudinary';
import { useCartStore } from '../store/cart';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  unit: string;
  tags?: string[];
  allergens?: string[];
  note?: string;
}

interface MenuModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuModal({ item, isOpen, onClose }: MenuModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (isOpen) setImageLoaded(false);
  }, [isOpen, item.id]);

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
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-ink/60 backdrop-blur-sm cursor-pointer'
        onClick={onClose}
      />
      <div className='relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 p-2 bg-ink/80 text-white rounded-full hover:bg-burgundy transition-colors z-10'
          aria-label='Zatvori'
        >
          <X size={18} />
        </button>

        <div className='aspect-video w-full overflow-hidden bg-cream relative'>
          {/* Blurred thumbnail — already cached from grid, shows instantly */}
          <img
            src={cloudinaryUrl(item.image, 400)}
            alt=''
            className='absolute inset-0 w-full h-full object-cover '
            aria-hidden='true'
          />
          {/* Full image fades in when ready */}
          <img
            src={cloudinaryUrl(item.image, 800)}
            alt={item.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className='p-6'>
          <h3 className='font-display text-2xl text-ink mb-2'>{item.name}</h3>
          <p className='font-body text-sm text-ink-light mb-3 leading-relaxed'>
            {item.description}
          </p>
          {item.note && (
            <p className='font-body text-xs text-burgundy mb-5 leading-relaxed bg-burgundy/5 rounded-lg px-3 py-2'>
              {item.note}
            </p>
          )}

          <div className='flex items-center justify-between mb-6'>
            <span className='font-display text-2xl text-burgundy'>
              {item.price.toLocaleString('sr-RS')} RSD
              <span className='text-base text-muted font-body'>
                {' '}
                /{item.unit}
              </span>
            </span>
          </div>

          <div className='flex items-center gap-4 mb-6'>
            <span className='font-body text-sm text-ink'>Količina:</span>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className='w-10 h-10 rounded-xl bg-cream text-ink flex items-center justify-center hover:bg-burgundy hover:text-white transition-colors'
              >
                <Minus size={16} />
              </button>
              <span className='font-display text-xl text-ink w-8 text-center'>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className='w-10 h-10 rounded-xl bg-cream text-ink flex items-center justify-center hover:bg-burgundy hover:text-white transition-colors'
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className='w-full py-3.5 px-6 bg-burgundy text-white font-display text-lg uppercase tracking-widest rounded-xl hover:bg-burgundy-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-burgundy/15'
          >
            <ShoppingCart size={20} />
            Dodaj u korpu
          </button>
        </div>
      </div>
    </div>
  );
}
