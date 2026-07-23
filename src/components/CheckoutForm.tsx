import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, type OrderFormData } from '../schemas/order';
import { useCartStore } from '../store/cart';
import { BUSINESS } from '../config/business';
import { ShoppingCart, AlertCircle, ArrowRight } from 'lucide-react';

export default function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-cream rounded-full flex items-center justify-center animate-pulse">
          <ShoppingCart size={28} className="text-muted" />
        </div>
        <p className="font-body text-muted">Učitavanje...</p>
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
        <p className="font-body text-muted mb-6">Dodajte jela pre nego što nastavite.</p>
        <a
          href={`${import.meta.env.BASE_URL}ponuda`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-paprika text-white font-display uppercase tracking-widest rounded-xl hover:bg-paprika-dark transition-colors"
        >
          Pogledaj ponudu
        </a>
      </div>
    );
  }

  const onSubmit = (data: OrderFormData) => {
    const lines = [
      `VAU Ketering - Nova porudžbina`,
      ``,
      `Ime: ${data.name}`,
      `Adresa: ${data.address}`,
      `Telefon: ${data.phone}`,
    ];

    if (data.companyName) {
      lines.push(`Firma: ${data.companyName}`);
    }
    if (data.companyId) {
      lines.push(`PIB: ${data.companyId}`);
    }

    lines.push(``);
    lines.push(`Stavke:`);
    items.forEach((item) => {
      lines.push(`${item.quantity}x ${item.name} - ${(item.price * item.quantity).toLocaleString('sr-RS')} RSD`);
    });

    lines.push(``);
    lines.push(`Ukupno: ${totalPrice.toLocaleString('sr-RS')} RSD`);

    const message = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${BUSINESS.whatsappNumber}?text=${message}`;

    clearCart();
    window.location.href = url;
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Order summary */}
      <div className="bg-surface rounded-xl p-6 mb-8 border border-black/5 shadow-sm">
        <h2 className="font-display text-xl text-ink mb-4">Vaša porudžbina</h2>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between font-body text-sm">
              <span className="text-ink-light">
                {item.quantity}x {item.name}
              </span>
              <span className="text-ink font-medium">
                {(item.price * item.quantity).toLocaleString('sr-RS')} RSD
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-black/5 pt-3 flex items-center justify-between">
          <span className="font-display text-lg text-ink">Ukupno</span>
          <span className="font-display text-xl text-paprika">{totalPrice.toLocaleString('sr-RS')} RSD</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="block font-body text-sm font-medium text-ink mb-1.5">
            Ime i prezime *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-3.5 bg-surface border border-black/5 rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-paprika/20 focus:border-paprika/20 transition-all"
            placeholder="Unesite vaše ime"
          />
          {errors.name && (
            <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-paprika">
              <AlertCircle size={14} /> {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block font-body text-sm font-medium text-ink mb-1.5">
            Adresa dostave *
          </label>
          <input
            id="address"
            type="text"
            {...register('address')}
            className="w-full px-4 py-3.5 bg-surface border border-black/5 rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-paprika/20 focus:border-paprika/20 transition-all"
            placeholder="Unesite adresu"
          />
          {errors.address && (
            <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-paprika">
              <AlertCircle size={14} /> {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block font-body text-sm font-medium text-ink mb-1.5">
            Telefon *
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3.5 bg-surface border border-black/5 rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-paprika/20 focus:border-paprika/20 transition-all"
            placeholder="06x/xxx-xxxx"
          />
          {errors.phone && (
            <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-paprika">
              <AlertCircle size={14} /> {errors.phone.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="companyName" className="block font-body text-sm font-medium text-ink mb-1.5">
              Naziv firme
            </label>
            <input
              id="companyName"
              type="text"
              {...register('companyName')}
              className="w-full px-4 py-3.5 bg-surface border border-black/5 rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-paprika/20 focus:border-paprika/20 transition-all"
              placeholder="Opciono"
            />
          </div>
          <div>
            <label htmlFor="companyId" className="block font-body text-sm font-medium text-ink mb-1.5">
              PIB
            </label>
            <input
              id="companyId"
              type="text"
              {...register('companyId')}
              className="w-full px-4 py-3.5 bg-surface border border-black/5 rounded-xl font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-paprika/20 focus:border-paprika/20 transition-all"
              placeholder="Opciono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-paprika text-white font-display text-lg uppercase tracking-widest rounded-xl hover:bg-paprika-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-paprika/15"
        >
          <ArrowRight size={20} />
          Pošalji porudžbinu preko WhatsApp-a
        </button>

        <p className="font-body text-xs text-muted text-center">
          Klikom na dugme biće te preusmereni na WhatsApp sa unapred popunjenom porukom.
        </p>
      </form>
    </div>
  );
}
